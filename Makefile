.PHONY: help build up down restart logs clean dev test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build all Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## Show logs from all services
	docker-compose logs -f

logs-api: ## Show API logs
	docker-compose logs -f api

logs-web: ## Show web (frontend) logs
	docker-compose logs -f web

logs-db: ## Show database logs
	docker-compose logs -f db

logs-proxy: ## Show proxy (nginx) logs
	docker-compose logs -f proxy

dev: ## Start in development mode with hot-reload
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

dev-down: ## Stop development services
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

clean: ## Stop services and remove volumes
	docker-compose down -v

clean-all: ## Stop services, remove volumes and images
	docker-compose down -v --rmi all

ps: ## Show running containers
	docker-compose ps

shell-api: ## Open shell in API container
	docker-compose exec api /bin/bash

shell-db: ## Open PostgreSQL shell
	docker-compose exec db psql -U hirewow -d appdb

test: ## Run tests (if available)
	docker-compose exec api pytest

rebuild: ## Rebuild and restart all services
	docker-compose up -d --build


