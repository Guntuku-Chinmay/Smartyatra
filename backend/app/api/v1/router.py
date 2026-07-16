from fastapi import APIRouter

from app.api.v1.categories import router as categories_router
from app.api.v1.cities import router as cities_router
from app.api.v1.destinations import router as destinations_router
from app.api.v1.routes import router as routes_router
from app.api.v1.trips import router as trips_router
from app.api.v1.budgets import router as budgets_router

api_router = APIRouter()

api_router.include_router(cities_router)
api_router.include_router(categories_router)
api_router.include_router(destinations_router)
api_router.include_router(trips_router)
api_router.include_router(routes_router)
api_router.include_router(budgets_router)