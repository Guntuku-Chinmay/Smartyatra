import math
from app.ai.utils.logging import log_ai_function

@log_ai_function
def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance in kilometers between two points 
    on the Earth's surface specified by decimal degrees (latitude/longitude).
    """
    # Radius of the Earth in kilometers
    R = 6371.0
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat / 2.0) ** 2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(dlon / 2.0) ** 2)
         
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    
    return R * c

@log_ai_function
def estimate_travel_time(distance_km: float, travel_mode: str) -> int:
    """
    Estimate travel time in minutes based on distance (km) and travel mode.
    Speed assumptions:
    - DRIVING: 50 km/h
    - WALKING: 5 km/h
    - BICYCLING: 15 km/h
    - PUBLIC TRANSIT (TRANSIT): 30 km/h
    """
    speeds = {
        "DRIVING": 50.0,
        "WALKING": 5.0,
        "BICYCLING": 15.0,
        "TRANSIT": 30.0
    }
    
    mode_upper = travel_mode.upper()
    speed = speeds.get(mode_upper, 40.0) # Default to 40 km/h fallback
    
    # Time in minutes = (Distance / Speed) * 60
    duration_minutes = (distance_km / speed) * 60.0
    
    return int(math.ceil(duration_minutes))
