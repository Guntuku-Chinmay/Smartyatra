from app.models.category import Category
from app.repositories.category import CategoryRepository
from app.schemas.category import CategoryCreate


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