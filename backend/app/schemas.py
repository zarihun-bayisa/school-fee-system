from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class StudentBase(BaseModel):
    name: str
    grade: str
    section: str
    student_code: str


class StudentCreate(StudentBase):
    pass


class StudentRead(StudentBase):
    id: int

    class Config:
        orm_mode = True


class FeeBase(BaseModel):
    grade: str
    semester: str
    amount: float


class FeeCreate(FeeBase):
    pass


class FeeRead(FeeBase):
    id: int

    class Config:
        orm_mode = True


class PaymentBase(BaseModel):
    student_id: int
    amount: float
    month: str
    method: str
    status: Optional[str] = "PAID"


class PaymentCreate(PaymentBase):
    pass


class PaymentRead(PaymentBase):
    id: int
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
