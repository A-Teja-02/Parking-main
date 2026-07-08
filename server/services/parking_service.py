from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from models.schemas import Floor as FloorSchema, Slot as SlotSchema, ManagerRelease as ManagerReleaseSchema
from db.models import Floor, ParkingSlot, ManagerRelease, Employee

def get_all_floors(db: Session) -> List[FloorSchema]:
    floors = db.query(Floor).order_by(Floor.order).all()
    return [FloorSchema(id=f.id, name=f.name, label=f.label, order=f.order) for f in floors]

def get_slots_by_floor(db: Session, floor_id: Optional[str] = None) -> List[SlotSchema]:
    query = db.query(ParkingSlot).order_by(ParkingSlot.position)
    if floor_id:
        query = query.filter(ParkingSlot.floor_id == floor_id)
    slots = query.all()
    return [
        SlotSchema(
            id=s.id,
            label=s.label,
            floor_id=s.floor_id,
            position=s.position,
            status=s.status,
            reserved_for_manager_id=s.reserved_for_manager_id
        ) for s in slots
    ]

def create_slot(db: Session, data: dict) -> SlotSchema:
    new_slot = ParkingSlot(
        id=data["id"],
        label=data["label"],
        floor_id=data["floor_id"],
        position=data["position"],
        status=data.get("status", "active"),
        reserved_for_manager_id=data.get("reserved_for_manager_id")
    )
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return SlotSchema(
        id=new_slot.id,
        label=new_slot.label,
        floor_id=new_slot.floor_id,
        position=new_slot.position,
        status=new_slot.status,
        reserved_for_manager_id=new_slot.reserved_for_manager_id
    )

def update_slot(db: Session, slot_id: str, data: dict) -> Optional[SlotSchema]:
    slot = db.query(ParkingSlot).filter(ParkingSlot.id == slot_id).first()
    if not slot:
        return None
    for k, v in data.items():
        if k != "id" and hasattr(slot, k):
            setattr(slot, k, v)
    db.commit()
    db.refresh(slot)
    return SlotSchema(
        id=slot.id,
        label=slot.label,
        floor_id=slot.floor_id,
        position=slot.position,
        status=slot.status,
        reserved_for_manager_id=slot.reserved_for_manager_id
    )

def delete_slot(db: Session, slot_id: str) -> bool:
    slot = db.query(ParkingSlot).filter(ParkingSlot.id == slot_id).first()
    if slot:
        db.delete(slot)
        db.commit()
        return True
    return False

def set_slot_status(db: Session, slot_id: str, status: str) -> bool:
    slot = db.query(ParkingSlot).filter(ParkingSlot.id == slot_id).first()
    if slot:
        slot.status = status
        db.commit()
        return True
    return False

def assign_manager(db: Session, slot_id: str, manager_id: str) -> bool:
    # Check if manager already has a slot
    existing = db.query(ParkingSlot).filter(ParkingSlot.reserved_for_manager_id == manager_id).first()
    if existing:
        return False
        
    slot = db.query(ParkingSlot).filter(ParkingSlot.id == slot_id).first()
    if slot:
        slot.reserved_for_manager_id = manager_id
        db.commit()
        return True
    return False

def remove_manager(db: Session, slot_id: str) -> bool:
    slot = db.query(ParkingSlot).filter(ParkingSlot.id == slot_id).first()
    if slot:
        slot.reserved_for_manager_id = None
        db.commit()
        return True
    return False

def release_manager_slot(db: Session, manager_id: str, slot_id: str, release_date: str) -> ManagerReleaseSchema:
    # verify manager owns slot
    slot = db.query(ParkingSlot).filter(
        ParkingSlot.id == slot_id, 
        ParkingSlot.reserved_for_manager_id == manager_id
    ).first()
    
    if not slot:
        raise ValueError("Manager does not own this slot")

    release = ManagerRelease(
        manager_id=manager_id,
        slot_id=slot_id,
        release_date=release_date
    )
    db.add(release)
    db.commit()
    db.refresh(release)
    
    return ManagerReleaseSchema(
        manager_id=release.manager_id,
        slot_id=release.slot_id,
        release_date=release.release_date
    )

def get_reserved_slots(db: Session) -> List[Dict[str, Any]]:
    # Get all slots that have a reserved_for_manager_id
    slots = db.query(ParkingSlot, Employee.name).join(
        Employee, ParkingSlot.reserved_for_manager_id == Employee.id
    ).all()
    
    reserved = []
    for slot, manager_name in slots:
        reserved.append({
            "slot": {
                "id": slot.id,
                "label": slot.label,
                "floor_id": slot.floor_id,
                "position": slot.position,
                "status": slot.status,
                "reserved_for_manager_id": slot.reserved_for_manager_id
            },
            "manager_id": slot.reserved_for_manager_id,
            "manager_name": manager_name,
        })
    return reserved

def get_manager_releases(db: Session, date: str) -> List[ManagerReleaseSchema]:
    releases = db.query(ManagerRelease).filter(ManagerRelease.release_date == date).all()
    return [
        ManagerReleaseSchema(
            manager_id=r.manager_id,
            slot_id=r.slot_id,
            release_date=r.release_date
        ) for r in releases
    ]
