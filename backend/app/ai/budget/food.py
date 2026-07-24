from app.ai.utils.logging import log_ai_function

@log_ai_function
def estimate_food_cost(days: int, travelers: int, travel_style: str) -> float:
    """
    Estimate food/dining cost based on travelers, days, and travel style.
    - Budget: ₹400/day/person
    - Standard: ₹1,000/day/person
    - Luxury: ₹3,000/day/person
    """
    if days <= 0 or travelers <= 0:
        return 0.0
        
    prices = {
        "BUDGET": 400.0,
        "STANDARD": 1000.0,
        "LUXURY": 3000.0
    }
    
    style_upper = travel_style.upper()
    rate = prices.get(style_upper, 1000.0) # Default standard fallback
    
    return float(days * travelers * rate)
