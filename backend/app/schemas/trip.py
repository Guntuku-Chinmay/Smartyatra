from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.trip import TripStatus
from app.schemas.common import TimestampSchema


class TripBase(BaseModel):
    name: str
    start_date: date
    end_date: date
    total_budget: int = 0
    city_id: int
    status: TripStatus = TripStatus.PLANNED


class TripCreate(TripBase):
    pass


class TripUpdate(BaseModel):
    name: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    total_budget: int | None = None
    city_id: int | None = None
    status: TripStatus | None = None


class TripResponse(TripBase):
    id: int

    model_config = ConfigDict(from_attributes=True) 