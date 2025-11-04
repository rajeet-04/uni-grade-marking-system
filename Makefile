.PHONY: help up down build migrate seed backup-db restore-db logs clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

up: ## Start all services with Docker Compose
	docker-compose up -d

down: ## Stop all services
	docker-compose down

build: ## Build all Docker images
	docker-compose build

rebuild: ## Rebuild all Docker images without cache
	docker-compose build --no-cache

migrate: ## Run database migrations
	docker-compose exec backend npm run migrate

seed: ## Seed the database with initial data
	docker-compose exec backend npm run seed

logs: ## Show logs from all services
	docker-compose logs -f

logs-backend: ## Show backend logs
	docker-compose logs -f backend

logs-frontend: ## Show frontend logs
	docker-compose logs -f frontend

logs-db: ## Show database logs
	docker-compose logs -f postgres

backup-db: ## Backup the database
	@mkdir -p ./backups
	docker-compose exec -T postgres pg_dump -U gradeuser grade_management > ./backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Database backed up to ./backups/"

restore-db: ## Restore database from backup (usage: make restore-db FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "Error: Please specify FILE=backup.sql"; \
		exit 1; \
	fi
	docker-compose exec -T postgres psql -U gradeuser -d grade_management < $(FILE)

clean: ## Clean up containers, volumes, and generated files
	docker-compose down -v
	rm -rf ./data/pdfs/*
	rm -rf ./data/uploads/*

reset: ## Reset everything (clean + rebuild + migrate + seed)
	make clean
	make build
	make up
	sleep 10
	make migrate
	make seed

install-backend: ## Install backend dependencies
	cd backend && npm install

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

install: install-backend install-frontend ## Install all dependencies

dev-backend: ## Run backend in development mode (outside Docker)
	cd backend && npm run start:dev

dev-frontend: ## Run frontend in development mode (outside Docker)
	cd frontend && npm run dev

test-backend: ## Run backend tests
	docker-compose exec backend npm test

test-frontend: ## Run frontend tests
	docker-compose exec frontend npm test

status: ## Show status of all services
	docker-compose ps
