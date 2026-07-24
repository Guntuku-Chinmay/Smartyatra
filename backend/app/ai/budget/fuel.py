from app.ai.utils.logging import log_ai_function

@log_ai_function
def estimate_transport_cost(distance_km: float, travel_mode: str, travelers: int) -> float:
    """
    Estimate transportation costs based on distance (km), travel mode, and travelers.
    - DRIVING: ₹6.67 per km (assuming ₹100/liter fuel, 15 km/l car mileage)
    - TRANSIT: ₹2.00 per km per traveler
    - WALKING: ₹0.00
    - BICYCLING: ₹0.00
    """
    if distance_km <= 0.0 or travelers <= 0:
        return 0.0
        
    mode_upper = travel_mode.upper()
    
    if mode_upper == "DRIVING":
        # Flat mileage cost for vehicle fuel/rental
        cost = distance_km * (100.0 / 15.0)
    elif mode_upper == "TRANSIT":
        # Ticket rate per traveler
        cost = distance_km * 2.0 * travelers
    else:
        # Walking, bicycling, or unknown eco-friendly options
        cost = 0.0
        
    return round(cost, 2)
