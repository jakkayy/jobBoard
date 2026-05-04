from fastapi import APIRouter

from app.api.routes import admin, applications, auth, health, jobs, notifications, profiles, uploads

api_router = APIRouter()
api_router.include_router(admin.router)
api_router.include_router(applications.router)
api_router.include_router(auth.router)
api_router.include_router(health.router)
api_router.include_router(jobs.router)
api_router.include_router(notifications.router)
api_router.include_router(profiles.router)
api_router.include_router(uploads.router)
