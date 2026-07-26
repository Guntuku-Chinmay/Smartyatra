import json
import urllib.request
import urllib.error
import logging
import time
from typing import Dict, Any, Optional

logger = logging.getLogger("app.weather")

# Map WMO weather codes to readable statuses and icons
def map_weather_code(code: int) -> Dict[str, str]:
    if code == 0:
        return {"status": "Sunny", "icon": "☀️"}
    elif code in [1, 2, 3]:
        return {"status": "Partly Cloudy", "icon": "⛅"}
    elif code in [45, 48]:
        return {"status": "Foggy", "icon": "🌫️"}
    elif code in [51, 53, 55, 61, 63, 65]:
        return {"status": "Rainy", "icon": "🌧️"}
    elif code in [80, 81, 82]:
        return {"status": "Showers", "icon": "🌦️"}
    elif code in [95, 96, 99]:
        return {"status": "Thunderstorm", "icon": "⛈️"}
    return {"status": "Clear", "icon": "☀️"}

def get_weather_forecast(latitude: float, longitude: float) -> Dict[str, Any]:
    """
    Fetches actual real-time weather from Open-Meteo API using standard library urllib.
    Integrates a robust retry wrapper with exponential backoff.
    Gracefully falls back to mock coordinates weather if request fails or offline.
    """
    url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto"
    
    def _fetch_data():
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "SmartyatraWeatherService/1.0"}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            return json.loads(response.read().decode("utf-8"))
            
    # Retry loop (3 attempts, backoff delay)
    data = None
    last_err = None
    for attempt in range(3):
        try:
            data = _fetch_data()
            break
        except Exception as e:
            last_err = e
            if attempt < 2:
                time.sleep(0.5 * (2 ** attempt))
                
    if data:
        try:
            current = data.get("current_weather", {})
            temp = current.get("temperature", 27.5)
            wcode = current.get("weathercode", 0)
            mapped = map_weather_code(wcode)
            
            # Extract daily forecast high/low
            daily = data.get("daily", {})
            max_temp = daily.get("temperature_2m_max", [temp])[0]
            min_temp = daily.get("temperature_2m_min", [temp])[0]
            
            return {
                "temperature": f"{temp}°C",
                "status": mapped["status"],
                "icon": mapped["icon"],
                "forecast": f"High {max_temp}°C / Low {min_temp}°C",
                "source": "Open-Meteo API"
            }
        except Exception as e:
            logger.warning(f"Error parsing weather data: {str(e)}")
            
    logger.warning(f"Weather API request failed (last error: {str(last_err)}). Falling back to localized mock data.")
    # Localized mock fallback based on coordinates
    if latitude > 30: # Northern/Hilly region (e.g. Manali coordinates)
        return {
            "temperature": "18°C",
            "status": "Mist/Cool",
            "icon": "🌫️",
            "forecast": "High 22°C / Low 14°C",
            "source": "Fallback Mock Engine"
        }
    elif latitude < 12: # Southern/Coastal region
        return {
            "temperature": "29°C",
            "status": "Sunny",
            "icon": "☀️",
            "forecast": "High 33°C / Low 26°C",
            "source": "Fallback Mock Engine"
        }
    return {
        "temperature": "25°C",
        "status": "Partly Cloudy",
        "icon": "⛅",
        "forecast": "High 28°C / Low 21°C",
        "source": "Fallback Mock Engine"
    }
