from datetime import date, datetime
from enum import Enum

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Date, DateTime, Enum as SQLEnum, ForeignKey, Integer, String

from app.db.base_class import Base
from app.db.mixins import TimestampMixin


class TripStatus(str, Enum):
    PLANNED = "PLANNED"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"


class Trip(Base, TimestampMixin):
    """
    Represents a travel plan created by the user.
    """

    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    total_budget: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    status: Mapped[TripStatus] = mapped_column(
        SQLEnum(TripStatus),
        default=TripStatus.PLANNED,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    itineraries = relationship(
        "Itinerary",
        back_populates="trip",
        cascade="all, delete-orphan",
    )

    routes = relationship(
        "Route",
        back_populates="trip",
        cascade="all, delete-orphan",
    )

    destinations = relationship(
        "TripDestination",
        back_populates="trip",
        cascade="all, delete-orphan",
    )

    city_id: Mapped[int] = mapped_column(
        ForeignKey("cities.id"),
        nullable=False,
    )

    city = relationship(
        "City",
        back_populates="trips",
    )

    budget = relationship(
        "Budget",
        back_populates="trip",
        uselist=False,
        cascade="all, delete-orphan",
    )
