from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from fastapi.responses import Response

from app.ai.routing import optimize_route
from app.ai.routing.distance import haversine_distance, estimate_travel_time
from app.ai.budget import estimate_trip_budget
from app.ai.llm import generate_itinerary
from app.ai.recommendation import RecommendationEngine
from app.ai.recommendation.models import UserPreferences, RecommendationResult
from app.api.deps import get_db
from app.services.weather import get_weather_forecast
from app.services.pdf_generator import generate_itinerary_pdf

router = APIRouter(
    prefix="/ai",
    tags=["AI Services"],
)

# Coordinates Map
coordinates_map = {
    "goa": {"latitude": 15.2993, "longitude": 74.1240},
    "manali": {"latitude": 32.2396, "longitude": 77.1887},
    "hampi": {"latitude": 15.3350, "longitude": 76.4600},
    "munnar": {"latitude": 10.0889, "longitude": 77.0595},
    "jaipur": {"latitude": 26.9124, "longitude": 75.7873},
    "andaman": {"latitude": 11.7401, "longitude": 92.6586},
    "visakhapatnam": {"latitude": 17.6868, "longitude": 83.2185},
    "tirupati": {"latitude": 13.6288, "longitude": 79.4192},
    "vijayawada": {"latitude": 16.5062, "longitude": 80.6480},
    "araku": {"latitude": 18.3273, "longitude": 82.8775},
}

# Image Map
image_map = {
    "goa": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    "manali": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    "hampi": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80",
    "munnar": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
    "jaipur": "https://images.unsplash.com/photo-1477584305590-3a55010cbc39?auto=format&fit=crop&w=600&q=80",
    "andaman": "https://images.unsplash.com/photo-1608958416738-98e3bcfb7fc2?auto=format&fit=crop&w=600&q=80",
}

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

class ExportPDFInput(BaseModel):
    destination_name: str
    days: int
    travel_style: str
    travel_mode: str
    travelers: int
    interests: List[str]
    budget_breakdown: Dict[str, Any]
    day_wise_schedule: List[Dict[str, Any]]

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
    Generates a complete structured day-wise travel itinerary.
    Includes coordinates, Open-Meteo weather details, hotel options, and routing times.
    """
    try:
        # Generate raw activities using gemini-pro (or fallback)
        raw_activities = generate_itinerary(
            data.destination_name,
            data.days,
            data.travel_style,
            data.travel_mode,
            data.travelers,
            data.interests
        )
        
        # Base coordinates resolving
        dest_key = data.destination_name.lower()
        base_coords = {"latitude": 15.2993, "longitude": 74.1240}
        for key, val in coordinates_map.items():
            if key in dest_key:
                base_coords = val
                break
                
        base_lat = base_coords["latitude"]
        base_lon = base_coords["longitude"]
        
        image_url = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80"
        for key, val in image_map.items():
            if key in dest_key:
                image_url = val
                break
                
        day_wise_schedule = []
        total_trip_distance = 0.0
        
        # Group activities by day
        day_activities = {}
        for act in raw_activities:
            day = act.get("day_number", 1)
            if day not in day_activities:
                day_activities[day] = []
            day_activities[day].append(act)
            
        for d in range(1, data.days + 1):
            acts = day_activities.get(d, [])
            if len(acts) == 0:
                acts = [
                    {"activity": "Sightseeing Exploration", "notes": "Explore local scenic areas."},
                    {"activity": "Regional Market Walk", "notes": "Browse shops and taste street food."}
                ]
            elif len(acts) == 1:
                acts.append({"activity": "Evening Leisure", "notes": "Relax at local scenic point."})
                
            a1 = acts[0]
            a2 = acts[1]
            
            s1_lat = base_lat + 0.015
            s1_lon = base_lon - 0.015
            s1_weather = get_weather_forecast(s1_lat, s1_lon)
            
            s2_lat = base_lat - 0.01
            s2_lon = base_lon + 0.02
            s2_weather = get_weather_forecast(s2_lat, s2_lon)
            
            dist_s1_s2 = haversine_distance(s1_lat, s1_lon, s2_lat, s2_lon)
            total_trip_distance += dist_s1_s2
            
            day_wise_schedule.append({
                "day_number": d,
                "meals": {
                    "breakfast": "Traditional local cafe dining (idli/dosa or regional snacks) - ₹150",
                    "lunch": f"Authentic regional lunch menu near {a1.get('activity', 'Sight')} - ₹250",
                    "dinner": "Comfort dining options at hotel or nearby family restaurant - ₹350"
                },
                "stops": [
                    {
                        "slot": "morning",
                        "time": "09:00 AM",
                        "name": a1.get("activity", "Stop 1"),
                        "notes": a1.get("notes", ""),
                        "latitude": s1_lat,
                        "longitude": s1_lon,
                        "weather": s1_weather,
                        "image": image_url,
                        "google_maps_link": f"https://www.google.com/maps/dir/?api=1&destination={s1_lat},{s1_lon}"
                    },
                    {
                        "slot": "afternoon",
                        "time": "02:00 PM",
                        "name": a2.get("activity", "Stop 2"),
                        "notes": a2.get("notes", ""),
                        "latitude": s2_lat,
                        "longitude": s2_lon,
                        "weather": s2_weather,
                        "image": image_url,
                        "google_maps_link": f"https://www.google.com/maps/dir/?api=1&destination={s2_lat},{s2_lon}"
                    }
                ],
                "transit_segment": {
                    "distance_km": dist_s1_s2,
                    "duration_minutes": estimate_travel_time(dist_s1_s2, data.travel_mode),
                    "mode": data.travel_mode
                }
            })
            
        budget_breakdown = estimate_trip_budget(
            days=data.days,
            travelers=data.travelers,
            travel_style=data.travel_style,
            distance_km=total_trip_distance,
            travel_mode=data.travel_mode
        )
        
        hotel_suggestions = [
            {
                "name": f"{data.destination_name} Heritage Valley Resort",
                "rating": 4.6,
                "cost_per_night": "₹4,800",
                "coords": {"latitude": base_lat + 0.015, "longitude": base_lon - 0.015}
            },
            {
                "name": "The Gateway residency Complex",
                "rating": 4.2,
                "cost_per_night": "₹2,900",
                "coords": {"latitude": base_lat - 0.02, "longitude": base_lon + 0.02}
            }
        ]
        
        return {
            "destination_name": data.destination_name,
            "days": data.days,
            "travel_style": data.travel_style,
            "travel_mode": data.travel_mode,
            "travelers": data.travelers,
            "interests": data.interests,
            "total_distance_km": round(total_trip_distance, 1),
            "total_duration_minutes": estimate_travel_time(total_trip_distance, data.travel_mode),
            "budget_breakdown": budget_breakdown,
            "hotel_suggestions": hotel_suggestions,
            "day_wise_schedule": day_wise_schedule
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Itinerary generation failed: {str(e)}"
        )

@router.post("/export-pdf")
def api_export_pdf(data: ExportPDFInput):
    """
    Accepts full itinerary JSON and returns a downloadable PDF stream.
    """
    try:
        pdf_bytes = generate_itinerary_pdf(data.model_dump())
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=smartyatra_itinerary.pdf"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF export failed: {str(e)}"
        )

@router.get("/export-pdf/{trip_id}")
def api_export_pdf_by_id(trip_id: int, db: Session = Depends(get_db)):
    """
    Queries trip database tables, reconstructs itinerary schedule, and returns downloadable PDF.
    """
    from app.models import Trip, Itinerary, Budget, Destination
    
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip record not found")
        
    db_itineraries = db.query(Itinerary).filter(Itinerary.trip_id == trip_id).all()
    db_budgets = db.query(Budget).filter(Budget.trip_id == trip_id).all()
    destinations = db.query(Destination).all()
    
    trip_budget = db_budgets[0] if db_budgets else None
    
    # Reconstruct day-wise timeline stops
    day_wise = []
    days_set = sorted(list(set([it.day_number for it in db_itineraries])))
    
    for day in days_set:
        stops = []
        day_it = [it for it in db_itineraries if it.day_number == day]
        for idx, it in enumerate(day_it):
            dest = next((d for d in destinations if d.id == it.destination_id), None)
            dest_name = dest.name if dest else "Sightseeing Stop"
            stops.append({
                "name": dest_name,
                "notes": it.notes or "Explore points of interest",
                "weather": {"icon": "⛅", "temperature": "26°C", "status": "Partly Cloudy"}
            })
            
        day_wise.append({
            "day_number": day,
            "meals": {
                "breakfast": "Traditional local cafe dining - ₹150",
                "lunch": "Authentic regional lunch menu - ₹250",
                "dinner": "Comfort dining options at hotel - ₹350"
            },
            "stops": stops,
            "transit_segment": {"distance_km": 10.0, "duration_minutes": 20}
        })
        
    budget_breakdown = {
        "accommodation_cost": trip_budget.estimated_cost * 0.4 if trip_budget else 1500,
        "food_cost": trip_budget.estimated_cost * 0.3 if trip_budget else 1000,
        "fuel_cost": trip_budget.estimated_cost * 0.15 if trip_budget else 500,
        "entry_tickets_cost": trip_budget.estimated_cost * 0.05 if trip_budget else 200,
        "miscellaneous_cost": trip_budget.estimated_cost * 0.1 if trip_budget else 300,
        "total_cost": trip_budget.estimated_cost if trip_budget else 3500
    }
    
    payload = {
        "destination_name": trip.name.replace("Trip to ", ""),
        "days": len(days_set) or 1,
        "travel_style": "Standard",
        "travel_mode": "DRIVING",
        "travelers": 1,
        "budget_breakdown": budget_breakdown,
        "day_wise_schedule": day_wise
    }
    
    try:
        pdf_bytes = generate_itinerary_pdf(payload)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=smartyatra_trip_{trip_id}.pdf"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF export failed: {str(e)}"
        )
