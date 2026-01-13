from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class FeeStructure(Base):
    __tablename__ = "fee_structure"

    id = Column(Integer, primary_key=True, index=True)
    grade = Column(String, nullable=False)
    semester = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
