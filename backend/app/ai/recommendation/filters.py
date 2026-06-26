from .models import Destination, UserPreferences


def filter_destinations(
    destinations: list[Destination],
    user: UserPreferences,
) -> list[Destination]:
    """
    Future filtering logic.

    Currently returns all destinations.
    """

    return destinations