from datetime import time

from sqlalchemy import ForeignKey, Integer, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base
from app.db.mixins import TimestampMixin

class Itinerary(Base):
    """
    Day-wise travel itinerary.
    """

    __tablename__ = "itineraries"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    trip_id: Mapped[int] = mapped_column(
        ForeignKey("trips.id", ondelete="CASCADE"),
        nullable=False,
    )

    destination_id: Mapped[int] = mapped_column(
        ForeignKey("destinations.id"),
        nullable=False,
    )

    day_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    start_time: Mapped[time | None] = mapped_column(
        Time,
        nullable=True,
    )

    end_time: Mapped[time | None] = mapped_column(
        Time,
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    trip = relationship(
        "Trip",
        back_populates="itineraries",
    )

    destination = relationship("Destination")