from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from app.ai.routing import optimize_route
from app.ai.budget import estimate_trip_budget
from app.ai.llm import generate_itinerary
from app.ai.recommendation import RecommendationEngine
from app.ai.recommendation.models import UserPreferences, RecommendationResult
from app.api.deps import get_db
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/ai",
    tags=["AI Services"],
)

# ----------------- Schemas -----------------
class LocationInput(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float

class OptimizeRouteInput(BaseModel):
    start_latitude: float
    start_longitude: float
    locations: List[LocationInput]
    travel_mode: str = "DRIVING"

class OptimizeRouteResponse(BaseModel):
    ordered_locations: List[Dict[str, Any]]
    total_distance_km: float
    total_duration_minutes: int

class EstimateBudgetInput(BaseModel):
    days: int
    travelers: int
    travel_style: str
    distance_km: float
    travel_mode: str

class GenerateItineraryInput(BaseModel):
    destination_name: str
    days: int
    travel_style: str
    travel_mode: str = "DRIVING"
    travelers: int = 1
    interests: List[str]

# ----------------- Endpoints -----------------
@router.post("/recommend", response_model=list[RecommendationResult])
def recommend_destinations(
    preferences: UserPreferences,
    db: Session = Depends(get_db),
):
    """
    Exposes travel recommendations scoring based on user profile preferences.
    """
    engine = RecommendationEngine(db)
    return engine.recommend(preferences)

@router.post("/optimize-route", response_model=OptimizeRouteResponse)
def api_optimize_route(data: OptimizeRouteInput):
    """
    Solves Traveling Salesperson Problem (TSP) on coordinate nodes to order visits efficiently.
    """
    locs = [item.model_dump() for item in data.locations]
    ordered, distance, duration = optimize_route(
        data.start_latitude,
        data.start_longitude,
        locs,
        data.travel_mode
    )
    return {
        "ordered_locations": ordered,
        "total_distance_km": distance,
        "total_duration_minutes": duration
    }

@router.post("/estimate-budget")
def api_estimate_budget(data: EstimateBudgetInput):
    """
    Estimates hotel, dining, and transit expenses.
    """
    return estimate_trip_budget(
        data.days,
        data.travelers,
        data.travel_style,
        data.distance_km,
        data.travel_mode
    )

@router.post("/generate-itinerary")
def api_generate_itinerary(data: GenerateItineraryInput):
    """
    Generates structured day-wise travel itineraries using Google Gemini (with rule-based fallback).
    """
    try:
        return generate_itinerary(
            data.destination_name,
            data.days,
            data.travel_style,
            data.travel_mode,
            data.travelers,
            data.interests
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Itinerary generation failed: {str(e)}"
        )
