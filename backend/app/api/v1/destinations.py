from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.repositories.destination import DestinationRepository
from app.schemas.destination import (
    DestinationCreate,
    DestinationUpdate,
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
def get_destination(
    destination_id: int,
    db: Session = Depends(get_db),
):
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


@router.put("/{destination_id}", response_model=DestinationResponse)
def update_destination(
    destination_id: int,
    destination: DestinationUpdate,
    db: Session = Depends(get_db),
):
    service = DestinationService(DestinationRepository(db))

    updated = service.update_destination(
        destination_id,
        destination,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Destination not found",
        )

    return updated


@router.delete("/{destination_id}")
def delete_destination(
    destination_id: int,
    db: Session = Depends(get_db),
):
    service = DestinationService(DestinationRepository(db))

    deleted = service.delete_destination(destination_id)

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Destination not found",
        )

    return {
        "message": "Destination deleted successfully"
    }


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


from app.ai.recommendation import RecommendationEngine
from app.ai.recommendation.models import UserPreferences, RecommendationResult

@router.post("/recommend", response_model=list[RecommendationResult])
def recommend_destinations(
    preferences: UserPreferences,
    db: Session = Depends(get_db),
):
    engine = RecommendationEngine(db)
    return engine.recommend(preferences)