from app.models.trip import Trip
from app.repositories.trip import TripRepository
from app.schemas.trip import (
    TripCreate,
    TripUpdate,
)


class TripService:
    def __init__(self, repository: TripRepository):
        self.repository = repository

    def get_all_trips(self):
        return self.repository.get_all()

    def get_trip(self, trip_id: int):
        return self.repository.get(trip_id)

    def create_trip(self, trip_data: TripCreate):
        trip = Trip(**trip_data.model_dump())
        return self.repository.create(trip)

    def get_trips_by_city(self, city_id: int):
        return self.repository.get_by_city(city_id)

    def get_trips_by_status(self, status):
        return self.repository.get_by_status(status)

    def update_trip(
        self,
        trip_id: int,
        trip_data: TripUpdate,
    ):
        trip = self.repository.get(trip_id)

        if trip is None:
            return None

        update_data = trip_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(trip, key, value)

        return self.repository.update(trip)

    def delete_trip(self, trip_id: int):
        trip = self.repository.get(trip_id)

        if trip is None:
            return None

        self.repository.delete(trip)
        return trip