from math import radians, sin, cos, sqrt, atan2

from .models import Destination, UserPreferences


def budget_score(user_budget: float, destination_budget: float) -> float:
    """
    Returns a normalized score between 0 and 1.
    """
    if user_budget <= 0:
        return 0.0

    if destination_budget <= user_budget:
        return 1.0

    overflow = (destination_budget - user_budget) / user_budget

    return max(0.0, 1.0 - overflow)
    

def interest_score(
    user_interests: list[str],
    destination_categories: list[str],
) -> float:
    """
    Jaccard similarity between interests and destination categories.
    """
    if not user_interests:
        return 0.0

    user = {i.lower() for i in user_interests}
    destination = {c.lower() for c in destination_categories}

    intersection = len(user & destination)
    union = len(user | destination)

    return intersection / union if union else 0.0


def duration_score(
    user_days: int,
    recommended_days: int,
) -> float:
    """
    Higher score when recommended duration matches user trip length.
    """
    difference = abs(user_days - recommended_days)

    return max(0.0, 1 - (difference / max(user_days, 1)))


def popularity_score(popularity: float) -> float:
    """
    Popularity is already normalized.
    """
    return max(0.0, min(popularity, 1.0))


def distance_score(
    start_lat: float | None,
    start_lon: float | None,
    dest_lat: float,
    dest_lon: float,
) -> float:
    """
    Uses Haversine formula.
    """

    if start_lat is None or start_lon is None:
        return 1.0

    radius = 6371

    dlat = radians(dest_lat - start_lat)
    dlon = radians(dest_lon - start_lon)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(start_lat))
        * cos(radians(dest_lat))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = radius * c

    return max(0.0, 1 - (distance / 1000))