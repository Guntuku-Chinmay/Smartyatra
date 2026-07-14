from app.models.destination import Destination
from app.repositories.destination import DestinationRepository
from app.schemas.destination import DestinationCreate


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