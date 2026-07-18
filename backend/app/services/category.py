from app.models.category import Category
from app.repositories.category import CategoryRepository
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
)

class CategoryService:

    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    def get_all_categories(self):
        return self.repository.get_all()

    def get_category(self, category_id: int):
        return self.repository.get(category_id)

    def create_category(self, category_data: CategoryCreate):
        existing = self.repository.get_by_name(category_data.name)

        if existing:
            raise ValueError("Category already exists")

        category = Category(**category_data.model_dump())

        return self.repository.create(category)
    
    def update_category(self, category_id: int, category_data):
        category = self.repository.get(category_id)

        if category is None:
            return None

        update_data = category_data.model_dump(exclude_unset=True)

        if (
            "name" in update_data
            and update_data["name"] != category.name
        ):
            existing = self.repository.get_by_name(update_data["name"])
            if existing:
                raise ValueError("Category already exists")

        for key, value in update_data.items():
            setattr(category, key, value)

        return self.repository.update(category)


    def delete_category(self, category_id: int):
        category = self.repository.get(category_id)

        if category is None:
            return None

        self.repository.delete(category)
        return category