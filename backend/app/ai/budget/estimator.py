from typing import Dict, Any
from app.ai.utils.logging import log_ai_function
from .hotel import estimate_hotel_cost
from .food import estimate_food_cost
from .fuel import estimate_transport_cost

@log_ai_function
def estimate_trip_budget(
    days: int,
    travelers: int,
    travel_style: str,
    distance_km: float,
    travel_mode: str
) -> Dict[str, Any]:
    """
    Ties together hotel, food, and transport estimators to calculate
    a detailed trip budget forecast.
    """
    # Number of nights is typically days - 1 (min 1 night if days >= 1)
    nights = max(1, days - 1) if days >= 1 else 0
    
    hotel_cost = estimate_hotel_cost(nights, travel_style)
    food_cost = estimate_food_cost(days, travelers, travel_style)
    transport_cost = estimate_transport_cost(distance_km, travel_mode, travelers)
    
    # Legacy calculations (expected by unit tests)
    subtotal = hotel_cost + food_cost + transport_cost
    miscellaneous = round(subtotal * 0.15, 2)
    total_estimated = round(subtotal + miscellaneous, 2)
    
    # New custom categories
    entry_tickets = round(days * 200.0 * travelers, 2)
    new_subtotal = subtotal + entry_tickets
    new_misc = round(new_subtotal * 0.10, 2)
    new_total = round(new_subtotal + new_misc, 2)
    
    return {
        "fuel_cost": transport_cost,
        "transport_cost": transport_cost,
        "food_cost": food_cost,
        "accommodation_cost": hotel_cost,
        "hotel_cost": hotel_cost,
        "entry_tickets_cost": entry_tickets,
        "miscellaneous_cost": new_misc,
        "miscellaneous": miscellaneous,
        "total_cost": new_total,
        "total_estimated": total_estimated,
        "days": days,
        "nights": nights,
        "travelers": travelers,
        "travel_style": travel_style,
        "travel_mode": travel_mode
    }
