from sqlalchemy import Column, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from app.db.mixins import TimestampMixin


class Destination(Base, TimestampMixin):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), nullable=False, index=True)
    description = Column(Text, nullable=True)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    rating = Column(Float, default=0.0)

    image_url = Column(String(500), nullable=True)

    city_id = Column(
        Integer,
        ForeignKey("cities.id", ondelete="CASCADE"),
        nullable=False,
    )

    category_id = Column(
        Integer,
        ForeignKey("categories.id", ondelete="CASCADE"),
        nullable=False,
    )

    city = relationship("City", back_populates="destinations")
    category = relationship("Category", back_populates="destinations")

    itineraries = relationship(
        "Itinerary",
        back_populates="destination",
        cascade="all, delete-orphan",
    )
    destination = relationship(
        "Destination",
        back_populates="itineraries",
    )
