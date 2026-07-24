import unittest
import math
from app.ai.routing.distance import haversine_distance, estimate_travel_time
from app.ai.routing.optimizer import optimize_route
from app.ai.budget.hotel import estimate_hotel_cost
from app.ai.budget.food import estimate_food_cost
from app.ai.budget.fuel import estimate_transport_cost
from app.ai.budget.estimator import estimate_trip_budget
from app.ai.llm.parser import parse_itinerary_json
from app.ai.llm.validator import validate_itinerary
from app.ai.llm.gemini import generate_itinerary

class TestRoutingAndDistance(unittest.TestCase):
    def test_haversine_distance(self):
        # Mumbai to Pune coordinates (~120-130km)
        mum_lat, mum_lon = 19.0760, 72.8777
        pun_lat, pun_lon = 18.5204, 73.8567
        
        dist = haversine_distance(mum_lat, mum_lon, pun_lat, pun_lon)
        self.assertGreaterEqual(dist, 110.0)
        self.assertLessEqual(dist, 140.0)

    def test_travel_time_estimations(self):
        dist = 100.0 # 100 km
        
        # DRIVING: 100 km at 50 km/h = 2 hours = 120 mins
        drive_time = estimate_travel_time(dist, "DRIVING")
        self.assertEqual(drive_time, 120)
        
        # WALKING: 100 km at 5 km/h = 20 hours = 1200 mins
        walk_time = estimate_travel_time(dist, "WALKING")
        self.assertEqual(walk_time, 1200)


class TestRouteOptimizer(unittest.TestCase):
    def test_optimize_route_permutation(self):
        # Coordinates in linear arrangement: Start (0, 0) -> A (0, 1) -> B (0, 2)
        start_lat, start_lon = 0.0, 0.0
        locations = [
            {"id": 1, "name": "B", "latitude": 0.0, "longitude": 2.0},
            {"id": 2, "name": "A", "latitude": 0.0, "longitude": 1.0}
        ]
        
        ordered, total_dist, total_time = optimize_route(start_lat, start_lon, locations, "DRIVING")
        
        # Optimal sequence should visit A then B
        self.assertEqual(ordered[0]["name"], "A")
        self.assertEqual(ordered[1]["name"], "B")
        self.assertAlmostEqual(total_dist, 222.38, delta=20.0) # haversine of 2 degrees


class TestBudgetEstimation(unittest.TestCase):
    def test_hotel_cost(self):
        self.assertEqual(estimate_hotel_cost(3, "Budget"), 4500.0)
        self.assertEqual(estimate_hotel_cost(2, "Standard"), 8000.0)
        self.assertEqual(estimate_hotel_cost(1, "Luxury"), 12000.0)

    def test_food_cost(self):
        # 3 days, 2 travelers, Standard style (1000/day/person) = 3 * 2 * 1000 = 6000
        self.assertEqual(estimate_food_cost(3, 2, "Standard"), 6000.0)

    def test_transport_cost(self):
        # DRIVING 150 km: 150 * (100/15) = 1000.0
        self.assertEqual(estimate_transport_cost(150.0, "DRIVING", 2), 1000.0)
        
        # TRANSIT 150 km: 150 * 2 * 2 = 600.0
        self.assertEqual(estimate_transport_cost(150.0, "TRANSIT", 2), 600.0)

    def test_estimator_aggregation(self):
        summary = estimate_trip_budget(3, 2, "Standard", 150.0, "DRIVING")
        
        self.assertEqual(summary["hotel_cost"], 8000.0) # 2 nights Standard
        self.assertEqual(summary["food_cost"], 6000.0) # 3 days * 2 travelers * 1000
        self.assertEqual(summary["transport_cost"], 1000.0)
        self.assertEqual(summary["total_estimated"], 17250.0) # 15000 + 15% miscellaneous buffer


class TestLLMModule(unittest.TestCase):
    def test_json_parser_clean(self):
        raw = "```json\n[\n  {\"day_number\": 1, \"start_time\": \"09:00:00\", \"activity\": \"Test\", \"notes\": \"None\"}\n]\n```"
        parsed = parse_itinerary_json(raw)
        self.assertEqual(len(parsed), 1)
        self.assertEqual(parsed[0]["activity"], "Test")

    def test_validator_logical_constraints(self):
        valid_itin = [
            {"day_number": 1, "start_time": "09:00:00", "activity": "Sights", "notes": "Sample notes"}
        ]
        self.assertTrue(validate_itinerary(valid_itin))
        
        # Missing notes
        invalid_itin = [
            {"day_number": 1, "start_time": "09:00:00", "activity": "Sights"}
        ]
        with self.assertRaises(ValueError):
            validate_itinerary(invalid_itin)

    def test_fallback_generator(self):
        # Verify fallback generator creates valid structure
        itin = generate_itinerary("Goa", 2, "Standard", "DRIVING", 1, ["Beach"])
        self.assertEqual(len(itin), 4) # 2 days * 2 activities = 4
        self.assertTrue(validate_itinerary(itin))
        self.assertEqual(itin[0]["day_number"], 1)
        self.assertEqual(itin[2]["day_number"], 2)

if __name__ == "__main__":
    unittest.main()
