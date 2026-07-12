from typing import List, Optional

from pydantic import BaseModel, Field


class Destination(BaseModel):
    id: int
    name: str

    latitude: float
    longitude: float

    average_budget: float = Field(
        ..., description="Estimated total budget for the destination"
    )

    recommended_days: int

    categories: List[str]

    popularity_score: float = Field(
        ge=0,
        le=1,
        description="Normalized popularity score between 0 and 1"
    )


class UserPreferences(BaseModel):
    budget: float

    trip_days: int

    interests: List[str]

    start_latitude: Optional[float] = None
    start_longitude: Optional[float] = None

    travel_mode: str = "car"


class ScoreBreakdown(BaseModel):
    budget: float

    interest: float

    distance: float

    popularity: float

    duration: float


class RecommendationResult(BaseModel):
    destination: Destination

    total_score: float

    breakdown: ScoreBreakdown