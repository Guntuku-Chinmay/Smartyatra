from pydantic import BaseModel, ConfigDict, Field
from app.schemas.common import ORMBaseSchema


class CityCreate(BaseModel):
    name: str = Field(..., max_length=100)
    state: str = Field(..., max_length=100)
    country: str = Field(..., max_length=100)


class CityUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=100)
    state: str | None = Field(default=None, max_length=100)
    country: str | None = Field(default=None, max_length=100)


class CityResponse(ORMBaseSchema):
    id: int
    name: str
    state: str
    country: str