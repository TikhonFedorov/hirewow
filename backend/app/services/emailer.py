from app.config import settings

def send_email(to: str, subject: str, body: str, is_html: bool = False) -> None:
    if not settings.EMAIL_ENABLED:
        return
    # здесь раньше была реальная отправка; код удалён до возвращения фичи