from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import Student, FeeStructure, Payment
from app.routes import students, fees, payments

app = FastAPI(title="School Fee Management System")

# ✅ CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:80", "http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "School Fee API is running successfully"}

# include routers
app.include_router(students.router)
app.include_router(fees.router)
app.include_router(payments.router)
