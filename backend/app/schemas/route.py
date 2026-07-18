from pydantic import BaseModel, ConfigDict

from app.schemas.common import TimestampSchema


class RouteCreate(BaseModel):
    trip_id: int
    start_destination_id: int
    end_destination_id: int
    distance_km: float
    estimated_duration_minutes: int
    travel_mode: str = "DRIVING"


class RouteResponse(TimestampSchema):
    id: int
    trip_id: int
    start_destination_id: int
    end_destination_id: int
    distance_km: float
    estimated_duration_minutes: int
    travel_mode: str

    model_config = ConfigDict(from_attributes=True)


class RouteUpdate(BaseModel):
    trip_id: int | None = None
    start_destination_id: int | None = None
    end_destination_id: int | None = None
    distance_km: float | None = None
    estimated_duration_minutes: int | None = None
    travel_mode: str | None = None