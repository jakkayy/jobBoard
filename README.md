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
