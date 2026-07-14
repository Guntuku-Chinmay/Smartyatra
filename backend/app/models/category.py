from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base


class Category(Base):
    """
    Represents a destination category.
    Example:
    Beach, Temple, Hill Station, Adventure...
    """

    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    description: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    icon: Mapped[str] = mapped_column(
        String(100),
        nullable=True,
    )

    destinations = relationship(
        "Destination",
        back_populates="category",
        cascade="all, delete-orphan",
    )
