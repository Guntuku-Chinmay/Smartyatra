from app.ai.utils.logging import log_ai_function

@log_ai_function
def estimate_hotel_cost(nights: int, travel_style: str) -> float:
    """
    Estimate hotel/accommodation cost based on the travel style and nights.
    - Budget: ₹1,500/night
    - Standard: ₹4,000/night
    - Luxury: ₹12,000/night
    """
    if nights <= 0:
        return 0.0
        
    prices = {
        "BUDGET": 1500.0,
        "STANDARD": 4000.0,
        "LUXURY": 12000.0
    }
    
    style_upper = travel_style.upper()
    rate = prices.get(style_upper, 4000.0) # Default standard fallback
    
    return float(nights * rate)
