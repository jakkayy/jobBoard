VENV    = backend/venv
PYTHON  = $(VENV)/bin/python
PIP     = $(VENV)/bin/pip
ALEMBIC = $(VENV)/bin/alembic
UVICORN = $(VENV)/bin/uvicorn

.PHONY: help setup db migrate dev-back dev-front test lint db-down db-reset

help:
	@echo "Usage: make <command>"
	@echo ""
	@echo "  setup      Install all dependencies (run once)"
	@echo "  db         Start PostgreSQL (Docker)"
	@echo "  migrate    Run database migrations"
	@echo "  dev-back   Start backend API  → http://localhost:8000"
	@echo "  dev-front  Start frontend     → http://localhost:3000"
	@echo "  test       Run backend tests"
	@echo "  lint       Run ruff linter"
	@echo "  db-down    Stop all Docker services"
	@echo "  db-reset   Wipe database and re-migrate"

# ── First-time setup ──────────────────────────────────────────────────────────

setup:
	cp -n .env.example .env || true
	python3 -m venv $(VENV)
	$(PIP) install -e "backend[dev]"
	npm install --prefix frontend
	@echo ""
	@echo "Done. Edit .env, then run: make db && make migrate"

# ── Database ──────────────────────────────────────────────────────────────────

db:
	docker compose up -d postgres

db-down:
	docker compose down

db-reset:
	docker compose down -v
	docker compose up -d postgres
	sleep 2
	cd backend && ../$(ALEMBIC) -c alembic.ini upgrade head

migrate:
	cd backend && ../$(ALEMBIC) -c alembic.ini upgrade head

migration:
	cd backend && ../$(ALEMBIC) -c alembic.ini revision --autogenerate -m "$(msg)"

# ── Dev servers ───────────────────────────────────────────────────────────────

dev-back:
	$(UVICORN) app.main:app --reload --app-dir backend

dev-front:
	npm run dev --prefix frontend

# ── Quality ───────────────────────────────────────────────────────────────────

test:
	cd backend && ../$(VENV)/bin/pytest

lint:
	$(VENV)/bin/ruff check backend/app
