# Стадия сборки фронтенда
FROM node:lts AS builder
WORKDIR /app
# Если Dockerfile лежит в корне репозитория и контекст = .
COPY frontend/package*.json ./
RUN npm ci --include=dev
COPY frontend/ ./
RUN npm run build

# Унифицируем выход (если Vite создаёт dist)
RUN if [ -d dist ]; then mv dist build; fi

# Стадия Nginx
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
# Итоговые статики в стандартный корень Nginx
COPY --from=builder /app/build /usr/share/nginx/html