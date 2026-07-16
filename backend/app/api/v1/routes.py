from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.repositories.route import RouteRepository
from app.schemas.route import RouteCreate, RouteResponse
from app.services.route import RouteService

router = APIRouter(
    prefix="/routes",
    tags=["Routes"],
)


@router.get("/", response_model=list[RouteResponse])
def get_routes(db: Session = Depends(get_db)):
    service = RouteService(RouteRepository(db))
    return service.get_all_routes()


@router.get("/{route_id}", response_model=RouteResponse)
def get_route(route_id: int, db: Session = Depends(get_db)):
    service = RouteService(RouteRepository(db))

    route = service.get_route(route_id)

    if route is None:
        raise HTTPException(
            status_code=404,
            detail="Route not found",
        )

    return route


@router.post("/", response_model=RouteResponse, status_code=201)
def create_route(
    route: RouteCreate,
    db: Session = Depends(get_db),
):
    service = RouteService(RouteRepository(db))
    return service.create_route(route)