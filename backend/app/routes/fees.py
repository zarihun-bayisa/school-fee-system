from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/fees", tags=["fees"])


@router.post("/", response_model=schemas.FeeRead)
def create_fee(fee: schemas.FeeCreate, db: Session = Depends(get_db)):
    db_fee = models.FeeStructure(grade=fee.grade, semester=fee.semester, amount=fee.amount)
    db.add(db_fee)
    db.commit()
    db.refresh(db_fee)
    return db_fee


@router.get("/", response_model=List[schemas.FeeRead])
def list_fees(db: Session = Depends(get_db)):
    return db.query(models.FeeStructure).all()


@router.get("/{fee_id}", response_model=schemas.FeeRead)
def get_fee(fee_id: int, db: Session = Depends(get_db)):
    fee = db.query(models.FeeStructure).filter(models.FeeStructure.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee not found")
    return fee


@router.delete("/{fee_id}")
def delete_fee(fee_id: int, db: Session = Depends(get_db)):
    fee = db.query(models.FeeStructure).filter(models.FeeStructure.id == fee_id).first()
    if not fee:
        raise HTTPException(status_code=404, detail="Fee not found")
    db.delete(fee)
    db.commit()
    return {"detail": "Fee deleted"}
