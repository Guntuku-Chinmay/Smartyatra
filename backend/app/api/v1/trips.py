from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.repositories.trip import TripRepository
from app.schemas.trip import (
    TripCreate,
    TripUpdate,
    TripResponse,
)
from app.services.trip import TripService

router = APIRouter(
    prefix="/trips",
    tags=["Trips"],
)


@router.get("/", response_model=list[TripResponse])
def get_trips(db: Session = Depends(get_db)):
    service = TripService(TripRepository(db))
    return service.get_all_trips()


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db),
):
    service = TripService(TripRepository(db))

    trip = service.get_trip(trip_id)

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    return trip


@router.post("/", response_model=TripResponse, status_code=201)
def create_trip(
    trip: TripCreate,
    db: Session = Depends(get_db),
):
    service = TripService(TripRepository(db))
    return service.create_trip(trip)


@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: int,
    trip: TripUpdate,
    db: Session = Depends(get_db),
):
    service = TripService(TripRepository(db))

    updated = service.update_trip(
        trip_id,
        trip,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    return updated


@router.delete("/{trip_id}")
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
):
    service = TripService(TripRepository(db))

    deleted = service.delete_trip(trip_id)

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found",
        )

    return {
        "message": "Trip deleted successfully"
    }