from sqlalchemy import String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base


class City(Base):
    """
    Represents a city in the SmartYatra database.
    """

    __tablename__ = "cities"

    __table_args__ = (
        UniqueConstraint(
            "name",
            "state",
            "country",
            name="uq_city",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    state: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    country: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    destinations = relationship(
        "Destination",
        back_populates="city",
        cascade="all, delete-orphan",
    )
