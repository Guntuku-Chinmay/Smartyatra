from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.repositories.category import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryResponse
from app.services.category import CategoryService

router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


@router.get("/", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    service = CategoryService(CategoryRepository(db))
    return service.get_all_categories()


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    service = CategoryService(CategoryRepository(db))

    category = service.get_category(category_id)

    if category is None:
        raise HTTPException(
            status_code=404,
            detail="Category not found",
        )

    return category


@router.post("/", response_model=CategoryResponse, status_code=201)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
):
    service = CategoryService(CategoryRepository(db))

    try:
        return service.create_category(category)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))