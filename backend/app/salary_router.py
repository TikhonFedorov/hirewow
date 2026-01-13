from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import SalaryRequest, SalaryResponse, MonthResult, SalarySummary
from app.auth import get_current_user
from typing import List, Dict, Tuple

router = APIRouter()

# Годовые пороги для НДФЛ (прогрессивная шкала)
THRESHOLDS: Dict[float, float] = {
    2_400_000: 0.13,   # 13% до 2.4 млн
    5_000_000: 0.15,   # 15% до 5 млн
    20_000_000: 0.18,  # 18% до 20 млн
    50_000_000: 0.20,  # 20% до 50 млн
    float('inf'): 0.22 # 22% свыше 50 млн
}

# Month names in Russian
MONTH_NAMES = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
]

def format_number(number: float) -> str:
    """Форматирует число с разделителями тысяч."""
    return "{:,.0f}".format(number).replace(",", " ")

def format_number_decimal(number: float) -> str:
    """Форматирует число с разделителями тысяч и двумя знаками после запятой."""
    return "{:,.2f}".format(number).replace(",", " ")


def calculate_salary(request: SalaryRequest) -> SalaryResponse:
    """
    Calculate salary breakdown for 12 months with progressive tax system.
    """
    # Calculate base monthly income with regional coefficient and northern allowance
    base_salary = request.salary
    monthly_bonus = request.monthly_bonus or 0.0
    rk_rate = request.rk_rate
    sn_percentage = request.sn_percentage / 100.0
    
    # Base income with regional coefficient
    base_income = (base_salary + monthly_bonus) * rk_rate
    
    # Northern allowance
    sn_amount = base_income * sn_percentage
    
    # Monthly regular income (base + regional coefficient + northern allowance)
    monthly_regular = base_income + sn_amount
    
    # Determine KPI bonus calculation based on period
    monthly_data = []
    cumulative_income = 0.0
    total_tax = 0.0
    yearly_gross = monthly_regular * 12
    
    # Calculate KPI bonuses
    if request.kpi_enabled and request.kpi_percentage:
        if request.kpi_period == "quarter":
            # Quarterly: bonus for 3 months, paid in months 4, 7, 10, 12
            quarterly_bonus = monthly_regular * (request.kpi_percentage / 100.0) * 3
            yearly_gross += quarterly_bonus * 4
            bonus_months = [3, 6, 9, 11]  # April, July, October, December (0-indexed)
            period_months = 3
            period_name = "квартал"
        else:  # halfyear
            # Halfyear: bonus for 6 months, paid in months 6 and 12
            halfyear_bonus = monthly_regular * (request.kpi_percentage / 100.0) * 6
            yearly_gross += halfyear_bonus * 2
            bonus_months = [5, 11]  # June and December (0-indexed)
            period_months = 6
            period_name = "полгода"
    else:
        quarterly_bonus = 0.0
        halfyear_bonus = 0.0
        bonus_months = []
        period_months = 0
        period_name = ""
    
    # Calculate monthly breakdown with progressive taxes
    for month_idx in range(12):
        monthly_gross = monthly_regular
        bonus = 0.0
        kpi_note = ""
        
        if month_idx in bonus_months:
            if request.kpi_enabled and request.kpi_period == "quarter":
                bonus = quarterly_bonus
            elif request.kpi_enabled and request.kpi_period == "halfyear":
                bonus = halfyear_bonus
            monthly_gross += bonus
            kpi_note = f"KPI выплата ({period_name})"
        
        cumulative_income += monthly_gross
        monthly_tax = 0.0
        tax_info_parts = []
        temp_cumulative = cumulative_income
        
        # Progressive tax calculation based on cumulative income
        prev_threshold = 0.0
        sorted_thresholds = sorted(THRESHOLDS.items())
        
        for threshold, rate in sorted_thresholds:
            if temp_cumulative > prev_threshold:
                taxable = min(temp_cumulative, threshold) - prev_threshold
                if taxable > 0:
                    if cumulative_income <= threshold:
                        # Весь месячный доход попадает в этот диапазон
                        monthly_tax += min(monthly_gross, taxable) * rate
                        tax_info_parts.append(f"{rate*100:.0f}% на {format_number(min(monthly_gross, taxable))} руб.")
                    elif cumulative_income - monthly_gross < threshold <= cumulative_income:
                        # Часть месячного дохода попадает в этот диапазон
                        base = threshold - (cumulative_income - monthly_gross)
                        monthly_tax += base * rate
                        tax_info_parts.append(f"{rate*100:.0f}% на {format_number(base)} руб.")
                    prev_threshold = threshold
            else:
                break
        
        total_tax += monthly_tax
        net_income = monthly_gross - monthly_tax
        
        monthly_data.append({
            'month': MONTH_NAMES[month_idx],
            'gross': format_number_decimal(monthly_gross),
            'tax': format_number_decimal(monthly_tax),
            'net': format_number_decimal(net_income),
            'tax_info': " ".join(tax_info_parts),
            'cumulative': format_number_decimal(cumulative_income),
            'bonus': format_number_decimal(bonus) if bonus > 0 else "0.00",
            'kpi_note': kpi_note
        })
    
    yearly_net = yearly_gross - total_tax
    
    # Build rate details
    rate_details = f"РК: {rk_rate:.2f}"
    if sn_percentage > 0:
        rate_details += f", СН: {request.sn_percentage:.1f}%"
    
    # Convert to MonthResult format
    months: List[MonthResult] = []
    for data in monthly_data:
        months.append(MonthResult(
            month=data['month'],
            income=data['gross'],
            kpi_bonus=data['bonus'],
            kpi_note=data['kpi_note'],
            tax=data['tax'],
            net_income=data['net'],
            tax_info=data['tax_info'],
            rate_details=rate_details,
            cumulative_income=data['cumulative']
        ))

    summary = SalarySummary(
        annual_income=format_number_decimal(yearly_gross),
        annual_tax=format_number_decimal(total_tax),
        annual_net_income=format_number_decimal(yearly_net)
    )

    return SalaryResponse(months=months, summary=summary)

@router.post("/salary", response_model=SalaryResponse)
def calculate_salary_endpoint(
    request: SalaryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Calculate salary breakdown. Requires authentication.
    """
    # Validation
    if request.salary < 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Salary must be non-negative"
        )
    
    if request.monthly_bonus is not None and request.monthly_bonus < 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Monthly bonus must be non-negative"
        )
    
    if request.rk_rate < 1.0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Regional coefficient must be >= 1.0"
        )
    
    if not (0 <= request.sn_percentage <= 100):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Northern allowance percentage must be between 0 and 100"
        )
    
    if request.kpi_enabled:
        if request.kpi_percentage is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="KPI percentage is required when KPI is enabled"
            )
        if not (0 <= request.kpi_percentage <= 100):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="KPI percentage must be between 0 and 100"
            )
        if request.kpi_period is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="KPI period is required when KPI is enabled"
            )
        if request.kpi_period not in ["quarter", "halfyear"]:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="KPI period must be 'quarter' or 'halfyear'"
            )

    try:
        result = calculate_salary(request)
        return result
    except Exception as e:
        # Log the full error server-side
        import logging
        logging.error(f"Salary calculation error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during calculation"
        )

