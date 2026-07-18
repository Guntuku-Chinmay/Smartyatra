from app.models.itinerary import Itinerary
from app.repositories.itinerary import ItineraryRepository
from app.schemas.itinerary import ItineraryCreate


class ItineraryService:
    """
    Business logic for Itinerary operations.
    """

    def __init__(self, repository: ItineraryRepository):
        self.repository = repository

    def get_all_itineraries(self):
        return self.repository.get_all()

    def get_itinerary(self, itinerary_id: int):
        return self.repository.get(itinerary_id)

    def create_itinerary(self, itinerary_data: ItineraryCreate):
        itinerary = Itinerary(**itinerary_data.model_dump())
        return self.repository.create(itinerary)

    def get_trip_itinerary(self, trip_id: int):
        return self.repository.get_by_trip(trip_id)

    def get_destination_itineraries(self, destination_id: int):
        return self.repository.get_by_destination(destination_id)

    def update_itinerary(self, itinerary_id: int, itinerary_data):
        itinerary = self.repository.get(itinerary_id)

        if itinerary is None:
            return None

        update_data = itinerary_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(itinerary, key, value)

        return self.repository.update(itinerary)

    def delete_itinerary(self, itinerary_id: int):
        itinerary = self.repository.get(itinerary_id)

        if itinerary is None:
            return None

        self.repository.delete(itinerary)
        return itinerary