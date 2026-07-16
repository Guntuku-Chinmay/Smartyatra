from pydantic import BaseModel, ConfigDict


class BudgetBase(BaseModel):
    estimated_cost: float
    actual_cost: float = 0.0
    remaining_budget: float = 0.0
    trip_id: int


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    estimated_cost: float | None = None
    actual_cost: float | None = None
    remaining_budget: float | None = None


class BudgetResponse(BudgetBase):
    id: int

    model_config = ConfigDict(from_attributes=True)