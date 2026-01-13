#!/bin/bash

# Deployment script for hirewow.tech
# Usage: ./deploy.sh [staging|production]

set -e

ENV=${1:-production}
DOMAIN="hirewow.tech"

echo "🚀 Deploying HireWow to $ENV environment..."

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env not found!"
    echo "Please create backend/.env from backend/.env.production.example"
    exit 1
fi

# Set nginx config based on environment
if [ "$ENV" = "production" ]; then
    echo "📝 Using production nginx configuration..."
    cp nginx/nginx.production.conf nginx/nginx.conf
    export VITE_API_BASE_URL="https://$DOMAIN"
else
    echo "📝 Using staging nginx configuration..."
    cp nginx/nginx.staging.conf nginx/nginx.conf
    export VITE_API_BASE_URL="http://$DOMAIN"
fi

# Build frontend with correct API URL
echo "🔨 Building frontend..."
docker-compose build web

# Build backend
echo "🔨 Building backend..."
docker-compose build api

# Start services
echo "🚀 Starting services..."
if [ "$ENV" = "production" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
else
    docker-compose up -d
fi

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo "📊 Service status:"
docker-compose ps

# Check health
echo "🏥 Health check:"
curl -f http://localhost/health || echo "⚠️  Health check failed"

echo "✅ Deployment complete!"
echo "🌐 Visit: http://$DOMAIN (or https://$DOMAIN for production)"

