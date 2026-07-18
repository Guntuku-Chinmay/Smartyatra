from app.models.itinerary import Itinerary
from app.repositories.crud import CRUDRepository


class ItineraryRepository(CRUDRepository[Itinerary]):

    def __init__(self, db):
        super().__init__(db, Itinerary)

    def get_by_trip(self, trip_id: int):
        return (
            self.db.query(Itinerary)
            .filter(Itinerary.trip_id == trip_id)
            .all()
        )

    def get_by_destination(self, destination_id: int):
        return (
            self.db.query(Itinerary)
            .filter(Itinerary.destination_id == destination_id)
            .all()
        )