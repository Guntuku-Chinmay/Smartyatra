import os
import json
import urllib.request
import urllib.error
import logging
from typing import List, Dict, Any

from app.ai.utils.logging import log_ai_function
from .prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE
from .parser import parse_itinerary_json
from .validator import validate_itinerary

logger = logging.getLogger("app.ai")

# Activity templates by destination for local fallback generator
fallback_activities: Dict[str, List[Dict[str, str]]] = {
    "goa": [
        {"activity": "Calangute Beach", "notes": "Enjoy water sports, beach shacks, and sunbathing."},
        {"activity": "Fort Aguada", "notes": "Explore the 17th-century Portuguese fort and lighthouse."},
        {"activity": "Basilica of Bom Jesus", "notes": "Visit the historic church holding the remains of St. Francis Xavier."},
        {"activity": "Anjuna Flea Market", "notes": "Shop for souvenirs, local crafts, and street food."},
        {"activity": "Dudhsagar Falls", "notes": "Take a jeep safari to the majestic four-tiered waterfall."},
        {"activity": "Spice Plantation Tour", "notes": "Learn about local spices and enjoy a traditional Goan buffet lunch."},
    ],
    "manali": [
        {"activity": "Solang Valley", "notes": "Try paragliding, quad biking, and zorbing in the valley."},
        {"activity": "Hadimba Temple", "notes": "Visit the ancient cave temple dedicated to Hidimbi Devi, set in deodar forests."},
        {"activity": "Jogini Waterfalls", "notes": "Scenic pine forest trek leading to the beautiful waterfalls."},
        {"activity": "Vashisht Hot Springs", "notes": "Bathe in therapeutic natural sulfur springs and tour nearby temples."},
        {"activity": "Mall Road shopping", "notes": "Browse wooden crafts, carpets, and local Himachali shawls."},
        {"activity": "Old Manali Cafes", "notes": "Relax in local music cafes and enjoy wood-fired pizza."},
    ],
    "hampi": [
        {"activity": "Virupaksha Temple", "notes": "Admire the towering gopuram and explore the active 7th-century temple complex."},
        {"activity": "Vittala Temple & Stone Chariot", "notes": "See the iconic carved stone chariot and play the musical pillars."},
        {"activity": "Hemakuta Hill", "notes": "Walk past ancient pre-Islamic temples and enjoy views of the ruins landscape."},
        {"activity": "Lotus Mahal & Elephant Stables", "notes": "Explore the Indo-Islamic design of the royal palace ruins."},
        {"activity": "Tungabhadra Coracle Ride", "notes": "Cross the river in a traditional circular wicker boat."},
        {"activity": "Matanga Hill Sunrise", "notes": "Trek up the central hill for a panoramic view of Hampi's ruins."},
    ]
}

default_fallback_activities = [
    {"activity": "City Center Exploration", "notes": "Stroll down major historical streets and capture pictures of architectural icons."},
    {"activity": "Local Museum Tour", "notes": "Browse collections, regional art, and learn historical milestones."},
    {"activity": "Scenic Viewpoint Hike", "notes": "Trek to the highest viewpoint in the city for panoramic photography."},
    {"activity": "Food Walk", "notes": "Visit traditional markets, taste local cuisines, and street desserts."},
    {"activity": "Botanical Garden Walk", "notes": "Relax in scenic green spaces and admire flora structures."},
    {"activity": "Souvenir Shopping", "notes": "Find local handmade gifts, textiles, and spices at regional markets."}
]

@log_ai_function
def generate_itinerary(
    destination_name: str,
    days: int,
    travel_style: str,
    travel_mode: str,
    travelers: int,
    interests: List[str]
) -> List[Dict[str, Any]]:
    """
    Generates a day-by-day travel itinerary using the Gemini API.
    If the API key is missing or the call fails, it automatically
    runs a customized local rule-based fallback itinerary generator.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    interests_str = ", ".join(interests) if interests else "Sightseeing"
    
    if not api_key:
        logger.warning("AI: GEMINI_API_KEY is not set. Generating local fallback itinerary.")
        return _generate_local_fallback(destination_name, days, travel_style, travel_mode, travelers, interests_str)

    # Construct LLM prompt
    prompt = (
        SYSTEM_PROMPT + 
        "\n\n" + 
        USER_PROMPT_TEMPLATE.format(
            days=days,
            destination_name=destination_name,
            travel_style=travel_style,
            travel_mode=travel_mode,
            travelers=travelers,
            interests_list=interests_str
        )
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        # Timeout after 15 seconds
        with urllib.request.urlopen(req, timeout=15) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            
            # Extract content from response structure
            parts = res_data["candidates"][0]["content"]["parts"]
            raw_text = parts[0]["text"]
            
            # Parse and validate JSON list
            itinerary = parse_itinerary_json(raw_text)
            validate_itinerary(itinerary)
            return itinerary

    except Exception as e:
        logger.error(f"AI: Gemini API call failed - {str(e)}. Generating local fallback itinerary.")
        return _generate_local_fallback(destination_name, days, travel_style, travel_mode, travelers, interests_str)

def _generate_local_fallback(
    dest_name: str,
    days: int,
    style: str,
    mode: str,
    travelers: int,
    interests_str: str
) -> List[Dict[str, Any]]:
    """
    Rule-based local itinerary generator fallback.
    """
    dest_lower = dest_name.lower()
    templates = default_fallback_activities
    
    for key, val in fallback_activities.items():
        if key in dest_lower:
            templates = val
            break
            
    itinerary = []
    
    for d in range(1, days + 1):
        # Morning Slot (09:30:00)
        morning_tmpl = templates[((d - 1) * 2) % len(templates)]
        itinerary.append({
            "day_number": d,
            "start_time": "09:30:00",
            "activity": f"{morning_tmpl['activity']}",
            "notes": f"{morning_tmpl['notes']} Customized for {style} style using {mode} mode."
        })
        
        # Afternoon Slot (15:00:00)
        afternoon_tmpl = templates[((d - 1) * 2 + 1) % len(templates)]
        itinerary.append({
            "day_number": d,
            "start_time": "15:00:00",
            "activity": f"{afternoon_tmpl['activity']}",
            "notes": f"{afternoon_tmpl['notes']} Tailored interest match: {interests_str}."
        })
        
    return itinerary
