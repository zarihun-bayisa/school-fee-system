from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/", response_model=schemas.PaymentRead)
def create_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    # ensure student exists
    student = db.query(models.Student).filter(models.Student.id == payment.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db_payment = models.Payment(
        student_id=payment.student_id,
        amount=payment.amount,
        month=payment.month,
        method=payment.method,
        status=payment.status,
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment


@router.get("/", response_model=List[schemas.PaymentRead])
def list_payments(db: Session = Depends(get_db)):
    return db.query(models.Payment).all()


@router.get("/{payment_id}", response_model=schemas.PaymentRead)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment
