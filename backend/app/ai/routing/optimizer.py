from typing import List, Dict, Tuple, Any
import itertools
from app.ai.utils.logging import log_ai_function
from .distance import haversine_distance, estimate_travel_time

@log_ai_function
def optimize_route(
    start_latitude: float,
    start_longitude: float,
    locations: List[Dict[str, Any]],
    travel_mode: str = "DRIVING"
) -> Tuple[List[Dict[str, Any]], float, int]:
    """
    Optimizes the route sequence starting from the initial coordinates.
    Returns:
        - Ordered locations list (each augmented with distance_from_prev and duration_from_prev)
        - Total distance in km
        - Total travel time in minutes
    """
    if not locations:
        return [], 0.0, 0

    n = len(locations)
    
    # Heuristic switch: permutation search for small size, greedy nearest neighbor for large size
    if n <= 9:
        best_order = _solve_tsp_permutations(start_latitude, start_longitude, locations)
    else:
        best_order = _solve_tsp_greedy(start_latitude, start_longitude, locations)

    ordered_locs = []
    total_dist = 0.0
    total_time = 0
    
    curr_lat = start_latitude
    curr_lon = start_longitude

    for loc in best_order:
        dist = haversine_distance(curr_lat, curr_lon, loc["latitude"], loc["longitude"])
        time_mins = estimate_travel_time(dist, travel_mode)
        
        # Augment location with step metrics
        augmented_loc = {
            **loc,
            "distance_from_prev": round(dist, 2),
            "duration_from_prev_mins": time_mins
        }
        
        ordered_locs.append(augmented_loc)
        total_dist += dist
        total_time += time_mins
        
        curr_lat = loc["latitude"]
        curr_lon = loc["longitude"]

    return ordered_locs, round(total_dist, 2), total_time

def _solve_tsp_permutations(
    start_lat: float,
    start_lon: float,
    locations: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Finds the exact shortest path through brute-force permutation.
    """
    best_dist = float("inf")
    best_perm = []

    # Calculate exact total distance of each path permutation
    for perm in itertools.permutations(locations):
        curr_lat = start_lat
        curr_lon = start_lon
        total_dist = 0.0
        
        for loc in perm:
            dist = haversine_distance(curr_lat, curr_lon, loc["latitude"], loc["longitude"])
            total_dist += dist
            curr_lat = loc["latitude"]
            curr_lon = loc["longitude"]
            
        if total_dist < best_dist:
            best_dist = total_dist
            best_perm = perm

    return list(best_perm)

def _solve_tsp_greedy(
    start_lat: float,
    start_lon: float,
    locations: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Finds a near-optimal path using a greedy nearest-neighbor algorithm.
    """
    unvisited = list(locations)
    path = []
    
    curr_lat = start_lat
    curr_lon = start_lon
    
    while unvisited:
        nearest_index = 0
        min_dist = float("inf")
        
        for idx, loc in enumerate(unvisited):
            dist = haversine_distance(curr_lat, curr_lon, loc["latitude"], loc["longitude"])
            if dist < min_dist:
                min_dist = dist
                nearest_index = idx
                
        nearest_loc = unvisited.pop(nearest_index)
        path.append(nearest_loc)
        curr_lat = nearest_loc["latitude"]
        curr_lon = nearest_loc["longitude"]
        
    return path
