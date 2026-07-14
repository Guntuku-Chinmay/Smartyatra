from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.repositories.destination import DestinationRepository
from app.schemas.destination import (
    DestinationCreate,
    DestinationResponse,
)
from app.services.destination import DestinationService

router = APIRouter(
    prefix="/destinations",
    tags=["Destinations"],
)


@router.get("/", response_model=list[DestinationResponse])
def get_destinations(db: Session = Depends(get_db)):
    service = DestinationService(DestinationRepository(db))
    return service.get_all_destinations()


@router.get("/{destination_id}", response_model=DestinationResponse)
def get_destination(destination_id: int, db: Session = Depends(get_db)):
    service = DestinationService(DestinationRepository(db))

    destination = service.get_destination(destination_id)

    if destination is None:
        raise HTTPException(
            status_code=404,
            detail="Destination not found",
        )

    return destination


@router.post("/", response_model=DestinationResponse, status_code=201)
def create_destination(
    destination: DestinationCreate,
    db: Session = Depends(get_db),
):
    service = DestinationService(DestinationRepository(db))
    return service.create_destination(destination)


@router.get("/city/{city_id}", response_model=list[DestinationResponse])
def get_destinations_by_city(
    city_id: int,
    db: Session = Depends(get_db),
):
    service = DestinationService(DestinationRepository(db))
    return service.get_destinations_by_city(city_id)


@router.get("/category/{category_id}", response_model=list[DestinationResponse])
def get_destinations_by_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    service = DestinationService(DestinationRepository(db))
    return service.get_destinations_by_category(category_id)