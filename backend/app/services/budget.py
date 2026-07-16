from app.models.budget import Budget
from app.repositories.budget import BudgetRepository
from app.schemas.budget import BudgetCreate


class BudgetService:

    def __init__(self, repository: BudgetRepository):
        self.repository = repository

    def get_all_budgets(self):
        return self.repository.get_all()

    def get_budget(self, budget_id: int):
        return self.repository.get(budget_id)

    def create_budget(self, budget_data: BudgetCreate):
        budget = Budget(**budget_data.model_dump())
        return self.repository.create(budget)

    def get_budget_by_trip(self, trip_id: int):
        return self.repository.get_by_trip(trip_id)