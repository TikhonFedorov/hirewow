#!/bin/bash
# Helper script to generate secure secrets for the application

echo "🔐 Generating secure secrets for HireWow..."
echo ""

# Generate JWT Secret (64 hex characters = 32 bytes)
JWT_SECRET=$(openssl rand -hex 32)
echo "JWT_SECRET generated:"
echo "$JWT_SECRET"
echo ""

# Generate Database Password (32 random characters)
DB_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-32)
echo "Database password generated:"
echo "$DB_PASSWORD"
echo ""

echo "📝 Add these to your backend/.env file:"
echo "JWT_SECRET=$JWT_SECRET"
echo "DATABASE_URL=postgresql://hirewow:$DB_PASSWORD@db:5432/appdb"
echo ""
echo "📝 Add this to your root .env file:"
echo "POSTGRES_PASSWORD=$DB_PASSWORD"
echo ""

