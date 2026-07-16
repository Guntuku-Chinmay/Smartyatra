from app.models.trip import Trip
from app.repositories.crud import CRUDRepository


class TripRepository(CRUDRepository[Trip]):

    def __init__(self, db):
        super().__init__(db, Trip)

    def get_by_status(self, status):
        return (
            self.db.query(Trip)
            .filter(Trip.status == status)
            .all()
        )

    def get_by_city(self, city_id: int):
        return (
            self.db.query(Trip)
            .filter(Trip.city_id == city_id)
            .all()
        )