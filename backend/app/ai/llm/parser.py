import json
import re
from typing import List, Dict, Any
from app.ai.utils.logging import log_ai_function

@log_ai_function
def parse_itinerary_json(raw_text: str) -> List[Dict[str, Any]]:
    """
    Cleans markdown formatting and parses raw LLM output into a python list of activities.
    """
    clean_text = raw_text.strip()
    
    # Strip markdown block wrappers if present (e.g., ```json ... ``` or ``` ... ```)
    if clean_text.startswith("```"):
        # Match anything between triple backticks, potentially ignoring a language tag
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", clean_text)
        if match:
            clean_text = match.group(1).strip()
            
    # Remove any leading/trailing non-JSON characters
    start_idx = clean_text.find("[")
    end_idx = clean_text.rfind("]")
    
    if start_idx != -1 and end_idx != -1:
        clean_text = clean_text[start_idx:end_idx + 1]
        
    try:
        data = json.loads(clean_text)
        if isinstance(data, list):
            return data
        return []
    except json.JSONDecodeError as e:
        # Fallback empty list or re-raise
        raise ValueError(f"Failed to parse LLM response as JSON. Cleaned Text: {clean_text}. Error: {str(e)}")
