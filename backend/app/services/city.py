from app.models.city import City
from app.repositories.city import CityRepository
from app.schemas.city import CityCreate


class CityService:
    """
    Business logic for City operations.
    """

    def __init__(self, repository: CityRepository):
        self.repository = repository

    def get_all_cities(self):
        return self.repository.get_all()

    def get_city(self, city_id: int):
        return self.repository.get(city_id)

    def create_city(self, city_data: CityCreate):
        city = City(**city_data.model_dump())
        return self.repository.create(city)

    def get_cities_by_state(self, state: str):
        return self.repository.get_by_state(state)