from app.models.city import City
from app.repositories.crud import CRUDRepository


class CityRepository(CRUDRepository[City]):

    def __init__(self, db):
        super().__init__(db, City)

    def get_by_state(self, state: str):
        return (
            self.db.query(City)
            .filter(City.state == state)
            .all()
        )