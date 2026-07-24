from pydantic import BaseModel

class RecommendationWeights(BaseModel):
    budget: float = 0.25
    interest: float = 0.35
    distance: float = 0.15
    popularity: float = 0.15
    duration: float = 0.10

DEFAULT_WEIGHTS = RecommendationWeights()
