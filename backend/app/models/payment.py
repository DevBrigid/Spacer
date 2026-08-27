from sqlalchemy import CheckConstraint, Column, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"
    __table_args__ = (
        CheckConstraint("amount >= 0", name="ck_payments_amount_nonnegative"),
        CheckConstraint(
            "status IN ('PENDING', 'COMPLETED', 'FAILED')",
            name="ck_payments_status_valid",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), unique=True, nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    phone_number = Column(String, nullable=False)
    
    # Daraja M-Pesa tracking parameters
    checkout_request_id = Column(String, unique=True, index=True, nullable=True)
    merchant_request_id = Column(String, nullable=True)
    mpesa_receipt_number = Column(String, nullable=True)
    status = Column(String(20), default="PENDING", nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    booking = relationship("Booking", back_populates="payment")
