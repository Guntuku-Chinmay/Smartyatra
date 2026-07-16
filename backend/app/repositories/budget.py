from app.models.budget import Budget
from app.repositories.crud import CRUDRepository


class BudgetRepository(CRUDRepository[Budget]):

    def __init__(self, db):
        super().__init__(db, Budget)

    def get_by_trip(self, trip_id: int):
        return (
            self.db.query(Budget)
            .filter(Budget.trip_id == trip_id)
            .first()
        )