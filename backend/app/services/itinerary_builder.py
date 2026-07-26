import math
from typing import List, Dict, Any
from app.ai.routing.distance import haversine_distance, estimate_travel_time
from app.ai.budget.estimator import estimate_trip_budget
from app.services.weather import get_weather_forecast

# Seed coordinates map for Andhra Pradesh / tourist cities
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

# Image maps
image_map = {
    "goa": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    "manali": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    "hampi": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80",
    "munnar": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
    "jaipur": "https://images.unsplash.com/photo-1477584305590-3a55010cbc39?auto=format&fit=crop&w=600&q=80",
    "andaman": "https://images.unsplash.com/photo-1608958416738-98e3bcfb7fc2?auto=format&fit=crop&w=600&q=80",
}

# Day-wise activities database for local compilation
itinerary_activities = {
    "goa": [
        {"name": "Calangute Beach", "notes": "Enjoy water sports, beach shacks, and sunbathing.", "lat_offset": 0.02, "lon_offset": -0.01},
        {"name": "Fort Aguada", "notes": "Explore the 17th-century Portuguese fort and lighthouse.", "lat_offset": -0.01, "lon_offset": 0.03},
        {"name": "Basilica of Bom Jesus", "notes": "Historic church holding the remains of St. Francis Xavier.", "lat_offset": 0.04, "lon_offset": 0.05},
        {"name": "Anjuna Flea Market", "notes": "Shop for souvenirs, local crafts, and street food.", "lat_offset": 0.05, "lon_offset": -0.02},
        {"name": "Dudhsagar Falls", "notes": "Majestic four-tiered waterfall trek.", "lat_offset": 0.01, "lon_offset": 0.08},
    ],
    "hampi": [
        {"name": "Virupaksha Temple", "notes": "Active 7th-century temple complex and monument towers.", "lat_offset": 0.01, "lon_offset": -0.01},
        {"name": "Vittala Temple & Stone Chariot", "notes": "Explore carved stone chariot and musical pillars.", "lat_offset": -0.01, "lon_offset": 0.02},
        {"name": "Hemakuta Hill", "notes": "Walk past ancient pre-Islamic temples and ruins vistas.", "lat_offset": 0.02, "lon_offset": 0.01},
        {"name": "Lotus Mahal & Royal Enclosure", "notes": "Indo-Islamic architectural ruins of royal palace halls.", "lat_offset": -0.03, "lon_offset": -0.01},
        {"name": "Tungabhadra Coracle Ride", "notes": "Cross the river in a traditional circular wicker boat.", "lat_offset": 0.04, "lon_offset": 0.03},
    ],
    "manali": [
        {"name": "Solang Valley", "notes": "Try paragliding, quad biking, and zorbing in the valley.", "lat_offset": 0.04, "lon_offset": -0.03},
        {"name": "Hadimba Temple", "notes": "Ancient cave temple dedicated to Hidimbi Devi.", "lat_offset": -0.01, "lon_offset": 0.01},
        {"name": "Jogini Waterfalls", "notes": "Scenic pine forest trek leading to the beautiful waterfalls.", "lat_offset": 0.02, "lon_offset": 0.03},
        {"name": "Vashisht Hot Springs", "notes": "Bathe in therapeutic natural sulfur springs.", "lat_offset": 0.01, "lon_offset": 0.04},
        {"name": "Mall Road Shopping", "notes": "Browse wooden crafts and local Himachali shawls.", "lat_offset": -0.02, "lon_offset": -0.01},
    ]
}

default_activities = [
    {"name": "City Center Exploration", "notes": "Stroll down major historical streets and capture pictures.", "lat_offset": 0.01, "lon_offset": -0.01},
    {"name": "Local Museum Tour", "notes": "Browse collections and learn historical milestones.", "lat_offset": -0.01, "lon_offset": 0.02},
    {"name": "Scenic Viewpoint Hike", "notes": "Trek to the highest viewpoint in the city for photos.", "lat_offset": 0.02, "lon_offset": 0.01},
    {"name": "Local Food Walk", "notes": "Visit traditional markets and taste local dishes.", "lat_offset": -0.02, "lon_offset": -0.01},
    {"name": "Botanical Garden Walk", "notes": "Relax in scenic green spaces and admire flora.", "lat_offset": 0.03, "lon_offset": 0.03},
]

def build_enhanced_itinerary(
    destination_name: str,
    days: int,
    travel_style: str,
    travel_mode: str,
    travelers: int,
    interests: List[str]
) -> Dict[str, Any]:
    """
    Assembles a complete enhanced itinerary including coordinates, weather, maps, budget,
    and a day-wise schedule satisfying all front-end rendering needs.
    """
    dest_key = destination_name.lower()
    
    # Resolve Base Coordinates
    base_coords = {"latitude": 15.2993, "longitude": 74.1240}
    for key, val in coordinates_map.items():
        if key in dest_key:
            base_coords = val
            break
            
    base_lat = base_coords["latitude"]
    base_lon = base_coords["longitude"]
    
    # Resolve Image
    image_url = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80"
    for key, val in image_map.items():
        if key in dest_key:
            image_url = val
            break

    # Resolve activities list
    activities_pool = default_activities
    for key, val in itinerary_activities.items():
        if key in dest_key:
            activities_pool = val
            break

    day_wise_schedule = []
    total_trip_distance = 0.0
    
    # Generate schedule days
    for d in range(1, days + 1):
        # Stop 1
        a1_data = activities_pool[((d - 1) * 2) % len(activities_pool)]
        s1_lat = base_lat + a1_data["lat_offset"]
        s1_lon = base_lon + a1_data["lon_offset"]
        s1_weather = get_weather_forecast(s1_lat, s1_lon)
        
        # Stop 2
        a2_data = activities_pool[((d - 1) * 2 + 1) % len(activities_pool)]
        s2_lat = base_lat + a2_data["lat_offset"]
        s2_lon = base_lon + a2_data["lon_offset"]
        s2_weather = get_weather_forecast(s2_lat, s2_lon)
        
        # Route distance calculations
        dist_s1_s2 = haversine_distance(s1_lat, s1_lon, s2_lat, s2_lon)
        total_trip_distance += dist_s1_s2
        
        day_wise_schedule.append({
            "day_number": d,
            "meals": {
                "breakfast": "Traditional local cafe dining (idli/dosa or regional snacks) - ₹150",
                "lunch": f"Authentic regional lunch menu near {a1_data['name']} - ₹250",
                "dinner": "Comfort dining options at hotel or nearby family restaurant - ₹350"
            },
            "stops": [
                {
                    "slot": "morning",
                    "time": "09:00 AM",
                    "name": a1_data["name"],
                    "notes": a1_data["notes"],
                    "latitude": s1_lat,
                    "longitude": s1_lon,
                    "weather": s1_weather,
                    "image": image_url,
                    "google_maps_link": f"https://www.google.com/maps/dir/?api=1&destination={s1_lat},{s1_lon}"
                },
                {
                    "slot": "afternoon",
                    "time": "02:00 PM",
                    "name": a2_data["name"],
                    "notes": a2_data["notes"],
                    "latitude": s2_lat,
                    "longitude": s2_lon,
                    "weather": s2_weather,
                    "image": image_url,
                    "google_maps_link": f"https://www.google.com/maps/dir/?api=1&destination={s2_lat},{s2_lon}"
                }
            ],
            "transit_segment": {
                "distance_km": dist_s1_s2,
                "duration_minutes": estimate_travel_time(dist_s1_s2, travel_mode),
                "mode": travel_mode
            }
        })

    # Call budget engine
    budget_breakdown = estimate_trip_budget(
        days=days,
        travelers=travelers,
        travel_style=travel_style,
        distance_km=total_trip_distance,
        travel_mode=travel_mode
    )

    # Hotel recommendations
    hotel_suggestions = [
        {
            "name": f"{destination_name} Heritage Valley Resort",
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
        "destination_name": destination_name,
        "days": days,
        "travel_style": travel_style,
        "travel_mode": travel_mode,
        "travelers": travelers,
        "interests": interests,
        "total_distance_km": round(total_trip_distance, 1),
        "total_duration_minutes": estimate_travel_time(total_trip_distance, travel_mode),
        "budget_breakdown": budget_breakdown,
        "hotel_suggestions": hotel_suggestions,
        "day_wise_schedule": day_wise_schedule
    }
