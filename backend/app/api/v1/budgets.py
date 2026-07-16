from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.repositories.budget import BudgetRepository
from app.schemas.budget import BudgetCreate, BudgetResponse
from app.services.budget import BudgetService

router = APIRouter(
    prefix="/budgets",
    tags=["Budgets"],
)


@router.get("/", response_model=list[BudgetResponse])
def get_budgets(db: Session = Depends(get_db)):
    service = BudgetService(BudgetRepository(db))
    return service.get_all_budgets()


@router.get("/{budget_id}", response_model=BudgetResponse)
def get_budget(budget_id: int, db: Session = Depends(get_db)):
    service = BudgetService(BudgetRepository(db))

    budget = service.get_budget(budget_id)

    if budget is None:
        raise HTTPException(status_code=404, detail="Budget not found")

    return budget


@router.post("/", response_model=BudgetResponse, status_code=201)
def create_budget(
    budget: BudgetCreate,
    db: Session = Depends(get_db),
):
    service = BudgetService(BudgetRepository(db))
    return service.create_budget(budget)