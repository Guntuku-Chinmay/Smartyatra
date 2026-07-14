from app.models.category import Category
from app.repositories.crud import CRUDRepository


class CategoryRepository(CRUDRepository[Category]):

    def __init__(self, db):
        super().__init__(db, Category)

    def get_by_name(self, name: str):
        return (
            self.db.query(Category)
            .filter(Category.name == name)
            .first()
        )