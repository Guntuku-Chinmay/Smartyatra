import unittest
from app.db.session import SessionLocal
from app.api.v1.cities import get_cities
from app.api.v1.ai import (
    recommend_destinations,
    api_optimize_route,
    api_estimate_budget,
    api_generate_itinerary,
    UserPreferences,
    OptimizeRouteInput,
    LocationInput,
    EstimateBudgetInput,
    GenerateItineraryInput
)

class TestSmartyatraDirectE2E(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.db = SessionLocal()

    @classmethod
    def tearDownClass(cls):
        cls.db.close()

    def test_get_cities_direct(self):
        cities = get_cities(db=self.db)
        self.assertIsInstance(cities, list)

    def test_ai_recommend_direct(self):
        prefs = UserPreferences(
            budget=20000.0,
            trip_days=3,
            interests=["Beach", "Adventure"],
            start_latitude=17.6868,
            start_longitude=83.2185,
            travel_mode="DRIVING"
        )
        recommendations = recommend_destinations(preferences=prefs, db=self.db)
        self.assertIsInstance(recommendations, list)

    def test_ai_optimize_route_direct(self):
        loc_a = LocationInput(id=1, name="Location A", latitude=17.7200, longitude=83.3300)
        loc_b = LocationInput(id=2, name="Location B", latitude=17.6500, longitude=83.1500)
        
        data = OptimizeRouteInput(
            start_latitude=17.6868,
            start_longitude=83.2185,
            locations=[loc_a, loc_b],
            travel_mode="DRIVING"
        )
        response = api_optimize_route(data=data)
        self.assertIn("ordered_locations", response)
        self.assertIn("total_distance_km", response)
        self.assertIn("total_duration_minutes", response)
        self.assertEqual(len(response["ordered_locations"]), 2)

    def test_ai_estimate_budget_direct(self):
        data = EstimateBudgetInput(
            days=3,
            travelers=2,
            travel_style="Standard",
            distance_km=150.0,
            travel_mode="DRIVING"
        )
        response = api_estimate_budget(data=data)
        self.assertEqual(response["hotel_cost"], 8000.0)
        self.assertEqual(response["food_cost"], 6000.0)
        self.assertEqual(response["transport_cost"], 1000.0)
        self.assertEqual(response["total_estimated"], 17250.0)

    def test_ai_generate_itinerary_direct(self):
        data = GenerateItineraryInput(
            destination_name="Goa",
            days=2,
            travel_style="Standard",
            travel_mode="DRIVING",
            travelers=1,
            interests=["Beach", "Historical"]
        )
        response = api_generate_itinerary(data=data)
        self.assertIsInstance(response, list)
        self.assertEqual(len(response), 4) # 2 days * 2 activities = 4
        self.assertEqual(response[0]["day_number"], 1)

if __name__ == "__main__":
    unittest.main()
