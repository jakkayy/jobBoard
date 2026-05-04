# Job Board / Freelance Platform

A full-stack job board and freelance platform built with Next.js, FastAPI, PostgreSQL, and Redis.

## Tech Stack

- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: FastAPI, SQLAlchemy
- Database: PostgreSQL
- Cache: Redis
- Storage: Cloudinary or S3-compatible storage
- Email: Background tasks with an email provider

## Project Structure

```text
jobBoard/
├── frontend/
├── backend/
├── infra/
├── .github/
│   └── workflows/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Development Phases

1. Repository bootstrap
2. Local infrastructure
3. Backend foundation and migrations
4. Authentication and profiles
5. Jobs and search
6. Application workflow
7. Frontend foundation and auth
8. Job UI and dashboards
9. Upload, email, and Redis
10. Testing, CI/CD, and deployment

## Getting Started

Copy the example environment file before starting local services.

```bash
cp .env.example .env
```

Start local infrastructure.

```bash
docker compose up -d postgres redis
```

Create and activate a Python virtual environment for the backend.

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
```

Install backend dependencies.

```bash
pip install -e "backend[dev]"
```

Install frontend dependencies.

```bash
npm install --prefix frontend
```

Run the backend API.

```bash
uvicorn app.main:app --reload --app-dir backend
```

Run the frontend app.

```bash
npm run dev --prefix frontend
```

Open the backend health check.

```bash
curl http://localhost:8000/api/v1/health
```

Create a new database migration.

```bash
alembic -c backend/alembic.ini revision --autogenerate -m "describe changes"
```

Run database migrations.

```bash
alembic -c backend/alembic.ini upgrade head
```

Check running services.

```bash
docker compose ps
```

Stop local infrastructure.

```bash
docker compose down
```

Stop local infrastructure and remove volumes.

```bash
docker compose down -v
```

## Local Infrastructure

The local infrastructure includes:

- PostgreSQL on port `5432`
- Redis on port `6379`

Default PostgreSQL credentials are defined in `.env.example`.

## Database Migrations

Backend migrations are managed with Alembic.

- Migration config: `backend/alembic.ini`
- Migration environment: `backend/migrations/env.py`
- Migration versions: `backend/migrations/versions`

## Backend API

Current backend endpoints:

- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/jobs`
- `GET /api/v1/jobs/{job_id}`
- `POST /api/v1/jobs`
- `PATCH /api/v1/jobs/{job_id}`
- `DELETE /api/v1/jobs/{job_id}`
- `POST /api/v1/jobs/{job_id}/apply`
- `GET /api/v1/me/applications`
- `GET /api/v1/employer/jobs/{job_id}/applications`
- `PATCH /api/v1/applications/{application_id}`
- `POST /api/v1/uploads/{upload_type}`
- `POST /api/v1/profiles/candidate/me`
- `GET /api/v1/profiles/candidate/me`
- `PATCH /api/v1/profiles/candidate/me`
- `POST /api/v1/profiles/employer/me`
- `GET /api/v1/profiles/employer/me`
- `PATCH /api/v1/profiles/employer/me`

Example job search query:

```bash
curl "http://localhost:8000/api/v1/jobs?keyword=FastAPI&location=Bangkok&employment_type=full_time&page=1&limit=10&sort=newest"
```

## Frontend App

The frontend is a Next.js App Router application.

- App directory: `frontend/src/app`
- API client: `frontend/src/lib/api.ts`
- Auth API client: `frontend/src/lib/auth-api.ts`
- Auth token storage: `frontend/src/lib/auth-token.ts`
- Candidate API client: `frontend/src/lib/candidate-api.ts`
- Employer API client: `frontend/src/lib/employer-api.ts`
- Job API client: `frontend/src/lib/job-api.ts`
- Upload API client: `frontend/src/lib/upload-api.ts`
- Types: `frontend/src/types`
- Local env example: `frontend/.env.local.example`

Current frontend pages:

- `/`
- `/login`
- `/register`
- `/jobs`
- `/jobs/[id]`
- `/candidate/dashboard`
- `/candidate/profile`
- `/candidate/applications`
- `/employer/dashboard`
- `/employer/profile`
- `/employer/jobs`
- `/employer/jobs/new`
- `/employer/jobs/[id]/edit`
- `/employer/jobs/[id]/applicants`
