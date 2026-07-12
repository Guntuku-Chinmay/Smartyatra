from typing import Generic, TypeVar

from sqlalchemy.orm import Session

ModelType = TypeVar("ModelType")


class CRUDRepository(Generic[ModelType]):
    """
    Generic CRUD repository.
    """

    def __init__(self, db: Session, model: type[ModelType]):
        self.db = db
        self.model = model

    def get(self, obj_id: int):
        return (
            self.db.query(self.model)
            .filter(self.model.id == obj_id)
            .first()
        )

    def get_all(self):
        return (
            self.db.query(self.model)
            .all()
        )

    def create(self, obj: ModelType):
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def update(self):
        self.db.commit()

    def delete(self, obj: ModelType):
        self.db.delete(obj)
        self.db.commit()