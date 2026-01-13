from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    amount = Column(Float, nullable=False)
    month = Column(String, nullable=False)
    method = Column(String, nullable=False)  # cash / bank / mobile
    status = Column(String, default="PAID")  # PAID / PARTIAL / PENDING
    created_at = Column(DateTime(timezone=True), server_default=func.now())
