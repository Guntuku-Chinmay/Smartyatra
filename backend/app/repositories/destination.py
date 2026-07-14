from app.models.destination import Destination
from app.repositories.crud import CRUDRepository


class DestinationRepository(CRUDRepository[Destination]):

    def __init__(self, db):
        super().__init__(db, Destination)

    def get_by_city(self, city_id: int):
        return (
            self.db.query(Destination)
            .filter(Destination.city_id == city_id)
            .all()
        )

    def get_by_category(self, category_id: int):
        return (
            self.db.query(Destination)
            .filter(Destination.category_id == category_id)
            .all()
        )