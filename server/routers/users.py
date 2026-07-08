"""
User management router — HR-only endpoints.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session

from models.schemas import User, HRCreateEmployeeSchema
from services import user_service
from routers.auth import get_hr_user
from db import get_db

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=List[User])
def get_users(hr: User = Depends(get_hr_user), db: Session = Depends(get_db)):
    """List all employees (HR only)."""
    return user_service.get_all_users(db)


@router.post("", response_model=User, status_code=201)
def create_user(data: HRCreateEmployeeSchema, hr: User = Depends(get_hr_user), db: Session = Depends(get_db)):
    """Register a new employee (HR only). Account starts as inactive."""
    try:
        return user_service.create_user(db, data.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{user_id}", response_model=User)
def update_user(user_id: str, data: dict, hr: User = Depends(get_hr_user), db: Session = Depends(get_db)):
    """Update an employee's profile (HR only)."""
    user = user_service.update_user(db, user_id, data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}/status")
def toggle_status(user_id: str, data: dict, hr: User = Depends(get_hr_user), db: Session = Depends(get_db)):
    """Activate or deactivate an employee (HR only)."""
    is_active = data.get("is_active", True)
    success = user_service.toggle_user_status(db, user_id, is_active)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success", "is_active": is_active}


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: str, hr: User = Depends(get_hr_user), db: Session = Depends(get_db)):
    """Delete an employee (HR only)."""
    success = user_service.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
