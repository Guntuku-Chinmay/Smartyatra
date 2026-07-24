from .loader import DestinationLoader
from .models import (
    RecommendationResult,
    ScoreBreakdown,
    UserPreferences,
)
from .scorer import (
    budget_score,
    distance_score,
    duration_score,
    interest_score,
    popularity_score,
)
from .weights import DEFAULT_WEIGHTS


from sqlalchemy.orm import Session

class RecommendationEngine:

    def __init__(self, db: Session):
        self.loader = DestinationLoader(db)

    def recommend(
        self,
        preferences: UserPreferences,
    ) -> list[RecommendationResult]:

        destinations = self.loader.load()

        results = []

        for destination in destinations:

            budget = budget_score(
                preferences.budget,
                destination.average_budget,
            )

            interest = interest_score(
                preferences.interests,
                destination.categories,
            )

            distance = distance_score(
                preferences.start_latitude,
                preferences.start_longitude,
                destination.latitude,
                destination.longitude,
            )

            popularity = popularity_score(
                destination.popularity_score,
            )

            duration = duration_score(
                preferences.trip_days,
                destination.recommended_days,
            )

            final_score = (
                budget * DEFAULT_WEIGHTS.budget
                + interest * DEFAULT_WEIGHTS.interest
                + distance * DEFAULT_WEIGHTS.distance
                + popularity * DEFAULT_WEIGHTS.popularity
                + duration * DEFAULT_WEIGHTS.duration
            )

            results.append(
                RecommendationResult(
                    destination=destination,
                    total_score=round(final_score, 3),
                    breakdown=ScoreBreakdown(
                        budget=budget,
                        interest=interest,
                        distance=distance,
                        popularity=popularity,
                        duration=duration,
                    ),
                )
            )

        results.sort(
            key=lambda result: result.total_score,
            reverse=True,
        )

        return results