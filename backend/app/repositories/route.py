from app.models.route import Route
from app.repositories.crud import CRUDRepository


class RouteRepository(CRUDRepository[Route]):

    def __init__(self, db):
        super().__init__(db, Route)