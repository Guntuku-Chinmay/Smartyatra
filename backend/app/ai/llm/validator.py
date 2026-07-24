import re
from typing import List, Dict, Any
from app.ai.utils.logging import log_ai_function

@log_ai_function
def validate_itinerary(itinerary: List[Dict[str, Any]]) -> bool:
    """
    Validates the structure and data of the generated itinerary list.
    Returns True if valid, raises ValueError if issues are found.
    """
    if not isinstance(itinerary, list):
        raise ValueError("Itinerary must be a list of activities.")
        
    time_pattern = re.compile(r"^\d{2}:\d{2}:\d{2}$")
    
    for idx, item in enumerate(itinerary):
        # 1. Check required fields
        required_fields = ["day_number", "start_time", "activity", "notes"]
        for field in required_fields:
            if field not in item:
                raise ValueError(f"Activity at index {idx} is missing required field '{field}'.")
                
        # 2. Type validation
        if not isinstance(item["day_number"], int) or item["day_number"] <= 0:
            raise ValueError(f"Activity at index {idx} has invalid day_number (must be positive integer).")
            
        if not isinstance(item["start_time"], str) or not time_pattern.match(item["start_time"]):
            raise ValueError(f"Activity at index {idx} has invalid start_time '{item['start_time']}' (must match HH:MM:SS).")
            
        if not isinstance(item["activity"], str) or len(item["activity"].strip()) == 0:
            raise ValueError(f"Activity at index {idx} must have a non-empty name string.")
            
        if not isinstance(item["notes"], str):
            raise ValueError(f"Activity at index {idx} must have notes string.")
            
    return True
