from sqlalchemy import Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base
from app.db.mixins import TimestampMixin


class Budget(Base, TimestampMixin):
    __tablename__ = "budgets"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    estimated_cost: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    actual_cost: Mapped[float] = mapped_column(
        Float,
        default=0.0,
    )

    remaining_budget: Mapped[float] = mapped_column(
        Float,
        default=0.0,
    )

    trip_id: Mapped[int] = mapped_column(
        ForeignKey("trips.id"),
        nullable=False,
        unique=True,
    )

    trip = relationship(
        "Trip",
        back_populates="budget",
    )