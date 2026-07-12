from datetime import time

from pydantic import BaseModel, ConfigDict

from app.schemas.common import TimestampSchema


class ItineraryCreate(BaseModel):
    trip_id: int
    destination_id: int
    day_number: int
    start_time: time | None = None
    end_time: time | None = None
    notes: str | None = None


class ItineraryResponse(TimestampSchema):
    id: int
    trip_id: int
    destination_id: int
    day_number: int
    start_time: time | None
    end_time: time | None
    notes: str | None

    model_config = ConfigDict(from_attributes=True)