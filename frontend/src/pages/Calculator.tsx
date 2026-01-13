import React, { useState } from 'react';
import { api } from '../api/client';
import HubLayout from '../components/HubLayout';
import { Button, Input, Select, Checkbox, Card, Table } from '../components/ui';
import './Calculator.css';

interface SalaryRequest {
  salary: number;
  monthly_bonus?: number;
  rk_rate: number;
  sn_percentage: number;
  kpi_enabled: boolean;
  kpi_percentage?: number;
  kpi_period: 'quarter' | 'halfyear';
}

interface MonthResult {
  month: string;
  income: string;
  kpi_bonus: string;
  kpi_note: string;
  tax: string;
  net_income: string;
  tax_info: string;
  rate_details: string;
  cumulative_income: string;
}

interface SalarySummary {
  annual_income: string;
  annual_tax: string;
  annual_net_income: string;
}

interface SalaryResponse {
  months: MonthResult[];
  summary: SalarySummary;
}

export default function Calculator() {
  const [salary, setSalary] = useState<string>('');
  const [monthlyBonus, setMonthlyBonus] = useState<string>('');
  const [rkRate, setRkRate] = useState<string>('1.0');
  const [snPercentage, setSnPercentage] = useState<string>('0');
  const [kpiEnabled, setKpiEnabled] = useState(false);
  const [kpiPercentage, setKpiPercentage] = useState<string>('');
  const [kpiPeriod, setKpiPeriod] = useState<'quarter' | 'halfyear'>('quarter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SalaryResponse | null>(null);

  const calculateSalary = async () => {
    setError(null);
    setLoading(true);

    try {
      const formData: SalaryRequest = {
        salary: parseFloat(salary) || 0,
        monthly_bonus: monthlyBonus ? parseFloat(monthlyBonus) : undefined,
        rk_rate: parseFloat(rkRate) || 1.0,
        sn_percentage: parseFloat(snPercentage) || 0,
        kpi_enabled: kpiEnabled,
        kpi_percentage: kpiEnabled && kpiPercentage ? parseFloat(kpiPercentage) : undefined,
        kpi_period: kpiPeriod,
      };

      const response = await api.post<SalaryResponse>('/salary', formData);
      setResult(response.data);
      
      // Save to history
      try {
        await api.post('/history', {
          module_name: 'calculator',
          query: JSON.stringify(formData),
          response: JSON.stringify(response.data),
        });
        console.log('History saved successfully');
      } catch (historyErr: any) {
        // Don't fail the request if history save fails
        console.error('Failed to save history:', historyErr);
        console.error('Error details:', historyErr?.response?.data);
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Сессия истекла, пожалуйста, войдите снова');
      } else {
        const errorMessage =
          err?.response?.data?.detail ||
          err?.message ||
          'Ошибка расчета. Проверьте введенные данные.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'month', name: 'Месяц' },
    { id: 'income', name: 'Доход (руб.)' },
    { 
      id: 'kpi_bonus', 
      name: 'Квартальная премия (руб.)',
      render: (value: string) => value === '0.00' ? '—' : value
    },
    { id: 'tax', name: 'Налог (руб.)' },
    { id: 'net_income', name: 'На руки (руб.)' },
    { 
      id: 'tax_info', 
      name: 'Ставка',
      render: (value: string) => value || '—'
    },
    { id: 'cumulative_income', name: 'Накопленный доход (руб.)' },
  ];

  const inputPanel = (
    <div className="calculator-inputs">
      <Input
        type="number"
        label="Оклад"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
        placeholder="0"
        disabled={loading}
        fullWidth
      />

      <Input
        type="number"
        label="Ежемесячная премия"
        value={monthlyBonus}
        onChange={(e) => setMonthlyBonus(e.target.value)}
        placeholder="0"
        disabled={loading}
        fullWidth
      />

      <Input
        type="number"
        step="0.1"
        label="Региональный коэффициент"
        value={rkRate}
        onChange={(e) => setRkRate(e.target.value)}
        placeholder="1.0"
        disabled={loading}
        fullWidth
      />

      <Input
        type="number"
        label="Северная надбавка (%)"
        value={snPercentage}
        onChange={(e) => setSnPercentage(e.target.value)}
        placeholder="0"
        disabled={loading}
        fullWidth
      />

      <div className="calculator-divider" />

      <Checkbox
        checked={kpiEnabled}
        onChange={(e) => setKpiEnabled(e.target.checked)}
        disabled={loading}
        label="Включить KPI бонусы"
        fullWidth
      />

      {kpiEnabled && (
        <>
          <Input
            type="number"
            label="Процент KPI"
            value={kpiPercentage}
            onChange={(e) => setKpiPercentage(e.target.value)}
            placeholder="0"
            disabled={loading}
            fullWidth
          />

          <Select
            label="Период выплаты KPI"
            value={kpiPeriod}
            onChange={(value) => setKpiPeriod(value as 'quarter' | 'halfyear')}
            options={[
              { value: 'quarter', label: 'Квартал' },
              { value: 'halfyear', label: 'Полгода' },
            ]}
            disabled={loading}
            fullWidth
          />
        </>
      )}

      {error && (
        <div className="calculator-error" role="alert">
          {error}
        </div>
      )}

      <Button
        onClick={calculateSalary}
        disabled={loading || !salary}
        fullWidth
        isLoading={loading}
        className="calculator-submit"
      >
        {loading ? 'Расчет...' : 'Рассчитать'}
      </Button>
    </div>
  );

  const outputPanel = result ? (
    <div className="calculator-results">
      <div className="results-table">
        <Table columns={columns} data={result.months} />
      </div>

      <Card variant="elevated" className="results-summary">
        <h3 className="summary-title">Итоги за год</h3>
        <div className="summary-content">
          <div className="summary-row">
            <span className="summary-label">Годовой доход:</span>
            <span className="summary-value">{result.summary.annual_income}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Годовой налог:</span>
            <span className="summary-value">{result.summary.annual_tax}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-row-highlight">
            <span className="summary-label">Годовой чистый доход:</span>
            <span className="summary-value summary-value-highlight">
              {result.summary.annual_net_income}
            </span>
          </div>
        </div>
      </Card>
    </div>
  ) : (
    <div className="calculator-empty">
      <p>Введите параметры и нажмите "Рассчитать" для получения результатов</p>
    </div>
  );

  return (
    <HubLayout
      title="Калькулятор зарплаты"
      description="Рассчитайте зарплату с учетом всех коэффициентов и надбавок"
      inputPanel={inputPanel}
      outputPanel={outputPanel}
    >
      <div />
    </HubLayout>
  );
}
