from app.models.destination import Destination
from app.repositories.destination import DestinationRepository
from app.schemas.destination import (
    DestinationCreate,
    DestinationUpdate,
)


class DestinationService:
    def __init__(self, repository: DestinationRepository):
        self.repository = repository

    def get_all_destinations(self):
        return self.repository.get_all()

    def get_destination(self, destination_id: int):
        return self.repository.get(destination_id)

    def create_destination(self, destination_data: DestinationCreate):
        destination = Destination(**destination_data.model_dump())
        return self.repository.create(destination)

    def get_destinations_by_city(self, city_id: int):
        return self.repository.get_by_city(city_id)

    def get_destinations_by_category(self, category_id: int):
        return self.repository.get_by_category(category_id)

    def update_destination(
        self,
        destination_id: int,
        destination_data: DestinationUpdate,
    ):
        destination = self.repository.get(destination_id)

        if destination is None:
            return None

        update_data = destination_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(destination, key, value)

        return self.repository.update(destination)

    def delete_destination(self, destination_id: int):
        destination = self.repository.get(destination_id)

        if destination is None:
            return None

        self.repository.delete(destination)
        return destination