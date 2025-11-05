FROM python:3.11-slim

WORKDIR /code

# системные зависимости для psycopg2 и криптографии
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev build-essential \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app /code/app

# ВАЖНО: --forwarded-allow-ips должен иметь значение (например, "*")
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "-b", "0.0.0.0:8000", "--workers", "4", "--forwarded-allow-ips", "*"]
