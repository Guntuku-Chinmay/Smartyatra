from sqlalchemy import Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base


class Destination(Base):
    """
    Represents a tourist destination.
    """

    __tablename__ = "destinations"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    city_id: Mapped[int] = mapped_column(
        ForeignKey("cities.id", ondelete="CASCADE"),
        nullable=False,
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id", ondelete="CASCADE"),
        nullable=False,
    )

    latitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    longitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    rating: Mapped[float] = mapped_column(
        Float,
        default=0.0,
    )

    estimated_cost: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    city = relationship(
        "City",
        back_populates="destinations",
    )

    category = relationship(
        "Category",
        back_populates="destinations",
    )

    trips = relationship(
        "TripDestination",
        back_populates="destination",
        cascade="all, delete-orphan",
    )
