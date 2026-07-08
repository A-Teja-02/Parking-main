from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from models.schemas import Floor, Slot, ManagerRelease, User
from services import parking_service
from routers.auth import get_current_user, get_hr_user
from services.reservation_service import get_tomorrow_date, is_weekend
from db import get_db

router = APIRouter(prefix="/api", tags=["slots"])

@router.get("/floors", response_model=List[Floor])
def get_floors(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return parking_service.get_all_floors(db)

@router.get("/slots", response_model=List[Slot])
def get_slots(floor_id: Optional[str] = None, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return parking_service.get_slots_by_floor(db, floor_id)

@router.get("/slots/status")
def get_slot_status():
    return {
        "tomorrow": get_tomorrow_date(),
        "is_weekend": is_weekend(),
    }

@router.post("/slots", response_model=Slot, status_code=201)
def create_slot(data: dict, hr: User = Depends(get_hr_user), db: Session = Depends(get_db)):
    return parking_service.create_slot(db, data)

@router.put("/slots/{slot_id}", response_model=Slot)
def update_slot(slot_id: str, data: dict, hr: User = Depends(get_hr_user), db: Session = Depends(get_db)):
    slot = parking_service.update_slot(db, slot_id, data)
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    return slot

@router.delete("/slots/{slot_id}", status_code=204)
def delete_slot(slot_id: str, hr: User = Depends(get_hr_user), db: Session = Depends(get_db)):
    if not parking_service.delete_slot(db, slot_id):
        raise HTTPException(status_code=404, detail="Slot not found")

@router.patch("/slots/{slot_id}/status")
def set_slot_status(slot_id: str, data: dict, hr: User = Depends(get_hr_user), db: Session = Depends(get_db)):
    if not parking_service.set_slot_status(db, slot_id, data.get("status", "active")):
        raise HTTPException(status_code=404, detail="Slot not found")
    return {"status": "success"}

@router.post("/slots/{slot_id}/assign-manager")
def assign_manager(slot_id: str, data: dict, hr: User = Depends(get_hr_user), db: Session = Depends(get_db)):
    if not parking_service.assign_manager(db, slot_id, data.get("manager_id")):
        raise HTTPException(status_code=400, detail="Assignment failed. Manager may already have a slot.")
    return {"status": "success"}

@router.delete("/slots/{slot_id}/assign-manager")
def remove_manager(slot_id: str, hr: User = Depends(get_hr_user), db: Session = Depends(get_db)):
    if not parking_service.remove_manager(db, slot_id):
        raise HTTPException(status_code=404, detail="Slot not found")
    return {"status": "success"}

@router.post("/slots/{slot_id}/release")
def release_slot(slot_id: str, data: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "manager" and user.role != "hr":
        raise HTTPException(status_code=403, detail="Not authorized")
    try:
        manager_id = data.get("manager_id", user.id)
        if user.role != "hr" and manager_id != user.id:
            raise HTTPException(status_code=403, detail="Cannot release another manager's slot")
            
        release = parking_service.release_manager_slot(db, manager_id, slot_id, data.get("date"))
        return release
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/slots/reserved")
def get_reserved_slots(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "hr":
        raise HTTPException(status_code=403, detail="HR access required")
    return parking_service.get_reserved_slots(db)

@router.get("/manager-releases")
def get_manager_releases(date: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return parking_service.get_manager_releases(db, date)
