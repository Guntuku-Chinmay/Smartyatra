from pydantic import BaseModel, ConfigDict, Field
from app.schemas.common import ORMBaseSchema


class CategoryCreate(BaseModel):
    name: str = Field(..., max_length=100)
    description: str = Field(..., max_length=255)
    icon: str | None = Field(default=None, max_length=100)


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=100)
    description: str | None = Field(default=None, max_length=255)
    icon: str | None = Field(default=None, max_length=100)


class CategoryResponse(ORMBaseSchema):
    id: int
    name: str
    description: str
    icon: str | None