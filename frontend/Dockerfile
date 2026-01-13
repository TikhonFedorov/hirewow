# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Ensure devDependencies are installed by setting NODE_ENV
ENV NODE_ENV=development

# Copy package files (context is root, so reference frontend/)
COPY frontend/package.json frontend/package-lock.json* ./

# Install all dependencies including devDependencies (needed for vite build)
# npm ci installs devDependencies when NODE_ENV is not 'production'
RUN if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi && \
    # Verify vite is installed
    npx vite --version || (echo "ERROR: vite not found!" && npm list vite && exit 1)

# Copy source code (node_modules excluded via .dockerignore)
COPY frontend/ .

# Build arguments for environment variables
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

