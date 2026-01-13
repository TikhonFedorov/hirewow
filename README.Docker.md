# Docker Setup Guide

This project uses Docker and Docker Compose for containerization and orchestration.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your configuration** (especially JWT_SECRET and database passwords)

3. **Build and start all services:**
   ```bash
   docker-compose up -d --build
   ```

4. **Check service status:**
   ```bash
   docker-compose ps
   ```

5. **View logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f api
   docker-compose logs -f web
   docker-compose logs -f db
   docker-compose logs -f proxy
   ```

## Services

- **db**: PostgreSQL 16 database (no external ports)
- **api**: FastAPI backend application (uses `./backend/.env` for configuration)
- **web**: Frontend build service that copies static files to shared volume
- **proxy**: Nginx reverse proxy (Port 80) - serves frontend and proxies API calls

## Development Mode

For development with hot-reload:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

This will:
- Enable hot-reload for backend (uvicorn --reload)
- Run frontend dev server with Vite
- Mount source code as volumes

## Database

The database data is persisted in a Docker volume `postgres_data`.

To reset the database:
```bash
docker-compose down -v
docker-compose up -d
```

## Building Individual Services

```bash
# Backend only
docker-compose build backend

# Frontend only
docker-compose build frontend
```

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Environment Variables

### Database (in docker-compose.yml)
- `POSTGRES_USER`: hirewow (hardcoded)
- `POSTGRES_PASSWORD`: fmCp%oKS2LH (hardcoded)
- `POSTGRES_DB`: appdb (hardcoded)

### Backend (in `./backend/.env`)
Create `./backend/.env` file with:
- `DATABASE_URL`: postgresql://hirewow:fmCp%oKS2LH@db:5432/appdb
- `JWT_SECRET`: Secret key for JWT tokens (change in production!)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: JWT token expiration time (default: 60)
- `EMAIL_ENABLED`: Enable email features (default: false)

### Frontend (build-time)
- `VITE_API_BASE_URL`: Frontend API base URL (empty for same-origin, set in docker-compose build args)

## Production Deployment

For production:

1. Set strong `JWT_SECRET` in `.env`
2. Use proper database credentials
3. Configure `VITE_API_BASE_URL` if frontend and backend are on different domains
4. Consider using Docker secrets for sensitive data
5. Set up SSL/TLS certificates for nginx

## Troubleshooting

**Backend can't connect to database:**
- Check database status: `docker-compose ps db`
- Verify `DATABASE_URL` in `./backend/.env` file
- Check database logs: `docker-compose logs db`

**Frontend can't reach backend:**
- Verify nginx configuration in `./nginx/nginx.conf`
- Check API is running: `docker-compose ps api`
- Check proxy logs: `docker-compose logs proxy`
- Verify web service copied files: `docker-compose logs web`

**Port conflicts:**
- Update port mappings in `docker-compose.yml` or `.env`


