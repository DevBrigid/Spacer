from sqlalchemy import Boolean, CheckConstraint, Column, Float, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Space(Base):
    __tablename__ = "spaces"
    __table_args__ = (
        CheckConstraint("capacity > 0", name="ck_spaces_capacity_positive"),
        CheckConstraint("price_per_hour >= 0", name="ck_spaces_price_nonnegative"),
    )

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False)
    price_per_hour = Column(Numeric(12, 2), nullable=False)
    image_url = Column(String, nullable=True)
    
    # Geolocation coordinates for Map view filter
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    is_available = Column(Boolean, default=True, nullable=False)

    # Relationships
    bookings = relationship(
        "Booking",
        back_populates="space",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
