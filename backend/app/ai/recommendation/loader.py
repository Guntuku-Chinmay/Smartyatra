from sqlalchemy.orm import Session
from app.models.destination import Destination as DBDestination
from .models import Destination as AIDestination

class DestinationLoader:
    def __init__(self, db: Session):
        self.db = db

    def load(self) -> list[AIDestination]:
        db_dests = self.db.query(DBDestination).all()
        ai_dests = []
        
        # Budget lookup mapping to match our seed values
        budget_map = {
            "goa": 15000.0,
            "manali": 18000.0,
            "hampi": 10000.0,
            "munnar": 14000.0,
            "jaipur": 16000.0,
            "andaman": 28000.0,
        }

        for d in db_dests:
            categories = [d.category.name] if d.category else []
            pop = min(1.0, max(0.1, (d.rating or 4.0) / 5.0))
            
            # Map budget based on destination name or category fallback
            name_lower = d.name.lower()
            avg_budget = 15000.0
            for key, val in budget_map.items():
                if key in name_lower:
                    avg_budget = val
                    break
            
            ai_dests.append(
                AIDestination(
                    id=d.id,
                    name=d.name,
                    latitude=d.latitude,
                    longitude=d.longitude,
                    average_budget=avg_budget,
                    recommended_days=3,
                    categories=categories,
                    popularity_score=pop
                )
            )
        return ai_dests
