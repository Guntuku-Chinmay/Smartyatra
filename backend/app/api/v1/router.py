from fastapi import APIRouter

from app.api.v1.cities import router as cities_router

api_router = APIRouter()

api_router.include_router(cities_router)