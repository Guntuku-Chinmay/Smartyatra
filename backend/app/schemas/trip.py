from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.trip import TripStatus
from app.schemas.common import TimestampSchema


class TripCreate(BaseModel):
    name: str = Field(..., max_length=150)
    start_date: date
    end_date: date
    total_budget: int = 0


class TripUpdate(BaseModel):
    name: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    total_budget: int | None = None
    status: TripStatus | None = None


class TripResponse(TimestampSchema):
    id: int
    name: str
    start_date: date
    end_date: date
    total_budget: int
    status: TripStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True) 