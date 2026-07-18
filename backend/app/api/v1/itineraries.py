from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.repositories.itinerary import ItineraryRepository
from app.schemas.itinerary import (
    ItineraryCreate,
    ItineraryResponse,
    ItineraryUpdate,
)
from app.services.itinerary import ItineraryService

router = APIRouter(
    prefix="/itineraries",
    tags=["Itineraries"],
)


@router.get("/", response_model=list[ItineraryResponse])
def get_itineraries(db: Session = Depends(get_db)):
    service = ItineraryService(ItineraryRepository(db))
    return service.get_all_itineraries()


@router.get("/{itinerary_id}", response_model=ItineraryResponse)
def get_itinerary(itinerary_id: int, db: Session = Depends(get_db)):
    service = ItineraryService(ItineraryRepository(db))

    itinerary = service.get_itinerary(itinerary_id)

    if itinerary is None:
        raise HTTPException(
            status_code=404,
            detail="Itinerary not found",
        )

    return itinerary


@router.post("/", response_model=ItineraryResponse, status_code=201)
def create_itinerary(
    itinerary: ItineraryCreate,
    db: Session = Depends(get_db),
):
    service = ItineraryService(ItineraryRepository(db))
    return service.create_itinerary(itinerary)


@router.put("/{itinerary_id}", response_model=ItineraryResponse)
def update_itinerary(
    itinerary_id: int,
    itinerary: ItineraryUpdate,
    db: Session = Depends(get_db),
):
    service = ItineraryService(ItineraryRepository(db))

    updated = service.update_itinerary(itinerary_id, itinerary)

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Itinerary not found",
        )

    return updated


@router.delete("/{itinerary_id}")
def delete_itinerary(
    itinerary_id: int,
    db: Session = Depends(get_db),
):
    service = ItineraryService(ItineraryRepository(db))

    deleted = service.delete_itinerary(itinerary_id)

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Itinerary not found",
        )

    return {
        "message": "Itinerary deleted successfully"
    }