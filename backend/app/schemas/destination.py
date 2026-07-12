from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import TimestampSchema


class DestinationCreate(BaseModel):
    name: str = Field(..., max_length=150)
    description: str
    city_id: int
    category_id: int
    latitude: float
    longitude: float
    rating: float = 0.0
    estimated_cost: int = 0
    image_url: str | None = None


class DestinationUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    city_id: int | None = None
    category_id: int | None = None
    latitude: float | None = None
    longitude: float | None = None
    rating: float | None = None
    estimated_cost: int | None = None
    image_url: str | None = None


class DestinationResponse(TimestampSchema):
    id: int
    name: str
    description: str
    city_id: int
    category_id: int
    latitude: float
    longitude: float
    rating: float
    estimated_cost: int
    image_url: str | None

    model_config = ConfigDict(from_attributes=True)