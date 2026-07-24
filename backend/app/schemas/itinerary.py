from datetime import time
from pydantic import BaseModel, ConfigDict
from app.schemas.common import ORMBaseSchema

class ItineraryBase(BaseModel):
    day_number: int
    start_time: time | None = None
    end_time: time | None = None
    notes: str | None = None
    trip_id: int
    destination_id: int

class ItineraryCreate(ItineraryBase):
    pass

class ItineraryUpdate(BaseModel):
    day_number: int | None = None
    start_time: time | None = None
    end_time: time | None = None
    notes: str | None = None

class ItineraryResponse(ORMBaseSchema):
    id: int
    trip_id: int
    destination_id: int
    day_number: int
    start_time: time | None
    end_time: time | None
    notes: str | None