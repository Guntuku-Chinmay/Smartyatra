from app.models.route import Route
from app.repositories.route import RouteRepository
from app.schemas.route import RouteCreate


class RouteService:
    """
    Business logic for Route operations.
    """

    def __init__(self, repository: RouteRepository):
        self.repository = repository

    def get_all_routes(self):
        return self.repository.get_all()

    def get_route(self, route_id: int):
        return self.repository.get(route_id)

    def create_route(self, route_data: RouteCreate):
        route = Route(**route_data.model_dump())
        return self.repository.create(route)

    def update_route(self, route_id: int, route_data: dict):
        route = self.repository.get(route_id)

        if route is None:
            return None

        for key, value in route_data.items():
            setattr(route, key, value)

        return self.repository.update(route)

    def delete_route(self, route_id: int):
        route = self.repository.get(route_id)

        if route is None:
            return None

        self.repository.delete(route)
        return route