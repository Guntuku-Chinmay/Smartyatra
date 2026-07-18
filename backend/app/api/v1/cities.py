from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.repositories.city import CityRepository
from app.schemas.city import (
    CityCreate,
    CityUpdate,
    CityResponse,
)
from app.services.city import CityService

router = APIRouter(prefix="/cities", tags=["Cities"])


@router.get("/", response_model=list[CityResponse])
def get_cities(db: Session = Depends(get_db)):
    service = CityService(CityRepository(db))
    return service.get_all_cities()


@router.get("/{city_id}", response_model=CityResponse)
def get_city(city_id: int, db: Session = Depends(get_db)):
    service = CityService(CityRepository(db))

    city = service.get_city(city_id)

    if city is None:
        raise HTTPException(status_code=404, detail="City not found")

    return city


@router.post("/", response_model=CityResponse, status_code=201)
def create_city(city: CityCreate, db: Session = Depends(get_db)):
    service = CityService(CityRepository(db))
    return service.create_city(city)

@router.put("/{city_id}", response_model=CityResponse)
def update_city(
    city_id: int,
    city: CityUpdate,
    db: Session = Depends(get_db),
):
    service = CityService(CityRepository(db))

    updated = service.update_city(city_id, city)

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="City not found",
        )

    return updated

@router.delete("/{city_id}")
def delete_city(
    city_id: int,
    db: Session = Depends(get_db),
):
    service = CityService(CityRepository(db))

    deleted = service.delete_city(city_id)

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="City not found",
        )

    return {
        "message": "City deleted successfully"
    }