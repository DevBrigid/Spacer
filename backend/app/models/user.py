import enum

from sqlalchemy import Column, DateTime, Enum as SAEnum, Integer, String, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class UserRole(str, enum.Enum):
    CLIENT = "client"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone_number = Column(String, nullable=True)
    role = Column(
        SAEnum(
            UserRole,
            name="user_role",
            values_callable=lambda roles: [role.value for role in roles],
            create_constraint=True,
            validate_strings=True,
        ),
        default=UserRole.CLIENT,
        nullable=False,
    )
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    bookings = relationship(
        "Booking",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    admin_logs = relationship("AdminLog", back_populates="admin")
