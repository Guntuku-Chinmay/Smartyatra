from typing import List, Dict
from .distance import haversine_distance

class LocationNode:
    def __init__(self, node_id: int, name: str, latitude: float, longitude: float):
        self.id = node_id
        self.name = name
        self.latitude = latitude
        self.longitude = longitude

    def distance_to(self, other: "LocationNode") -> float:
        return haversine_distance(self.latitude, self.longitude, other.latitude, other.longitude)

    def __repr__(self) -> str:
        return f"LocationNode(id={self.id}, name='{self.name}', lat={self.latitude}, lon={self.longitude})"


class RouteGraph:
    def __init__(self):
        self.nodes: Dict[int, LocationNode] = {}

    def add_node(self, node_id: int, name: str, latitude: float, longitude: float) -> LocationNode:
        node = LocationNode(node_id, name, latitude, longitude)
        self.nodes[node_id] = node
        return node

    def get_distance_matrix(self) -> Dict[int, Dict[int, float]]:
        matrix = {}
        for id1, node1 in self.nodes.items():
            matrix[id1] = {}
            for id2, node2 in self.nodes.items():
                matrix[id1][id2] = node1.distance_to(node2)
        return matrix
