"""
Seed script for the authentication database.
Creates tables and inserts initial employees.
Works with both SQLite (local dev) and PostgreSQL (Supabase production).
"""
import sys
import os

# Ensure the server directory is in the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import bcrypt
import json
from datetime import datetime, timezone

from db import engine, SessionLocal, Base
from db.models import Employee, Floor, ParkingSlot, Reservation, ManagerRelease


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def seed():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully.")

    db = SessionLocal()
    try:
        pw_hash = hash_password("password")
        now = datetime.now(timezone.utc)
        
        # Check if employees already exist
        existing = db.query(Employee).count()
        if existing > 0:
            print(f"  Database already has {existing} employees. Skipping employee seed.")

        employees = [
            # HR
            Employee(
                id="a1000000-0000-0000-0000-000000000001",
                employee_id="EMP-001",
                name="Admin User",
                email="admin@quadrantitservices.com",
                department="HR",
                vehicle_number="MH 14 AB 1111",
                avatar_initials="AD",
                role="hr",
                is_active=True,
                password_hash=pw_hash,
                account_status="active",
                created_at=now,
                updated_at=now,
            ),
            # Managers
            Employee(
                id="a2000000-0000-0000-0000-000000000001",
                employee_id="EMP-002",
                name="Rahul Verma",
                email="rahul.verma@quadrantitservices.com",
                department="Management",
                vehicle_number="MH 12 AB 1234",
                avatar_initials="RV",
                role="manager",
                is_active=True,
                password_hash=pw_hash,
                account_status="active",
                created_at=now,
                updated_at=now,
            ),
            Employee(
                id="a2000000-0000-0000-0000-000000000002",
                employee_id="EMP-003",
                name="Anita Desai",
                email="anita.desai@quadrantitservices.com",
                department="Management",
                vehicle_number="MH 12 AB 5678",
                avatar_initials="AD",
                role="manager",
                is_active=True,
                password_hash=pw_hash,
                account_status="active",
                created_at=now,
                updated_at=now,
            ),
            Employee(
                id="a2000000-0000-0000-0000-000000000003",
                employee_id="EMP-004",
                name="Vikram Shah",
                email="vikram.shah@quadrantitservices.com",
                department="Management",
                vehicle_number="MH 12 AB 9012",
                avatar_initials="VS",
                role="manager",
                is_active=True,
                password_hash=pw_hash,
                account_status="active",
                created_at=now,
                updated_at=now,
            ),
            # Employees
            Employee(
                id="a3000000-0000-0000-0000-000000000001",
                employee_id="EMP-005",
                name="Priya Sharma",
                email="priya.sharma@quadrantitservices.com",
                department="Engineering",
                vehicle_number="MH 12 AB 3456",
                avatar_initials="PS",
                role="employee",
                is_active=True,
                password_hash=pw_hash,
                account_status="active",
                created_at=now,
                updated_at=now,
            ),
            Employee(
                id="a3000000-0000-0000-0000-000000000002",
                employee_id="EMP-006",
                name="Amit Kumar",
                email="amit.kumar@quadrantitservices.com",
                department="Engineering",
                vehicle_number="MH 12 CD 1234",
                avatar_initials="AK",
                role="employee",
                is_active=True,
                password_hash=pw_hash,
                account_status="active",
                created_at=now,
                updated_at=now,
            ),
            Employee(
                id="a3000000-0000-0000-0000-000000000003",
                employee_id="EMP-007",
                name="Sneha Patel",
                email="sneha.patel@quadrantitservices.com",
                department="Design",
                vehicle_number="MH 12 EF 5678",
                avatar_initials="SP",
                role="employee",
                is_active=True,
                password_hash=pw_hash,
                account_status="active",
                created_at=now,
                updated_at=now,
            ),
            Employee(
                id="a3000000-0000-0000-0000-000000000004",
                employee_id="EMP-008",
                name="Rohan Gupta",
                email="rohan.gupta@quadrantitservices.com",
                department="Marketing",
                vehicle_number="MH 12 GH 9012",
                avatar_initials="RG",
                role="employee",
                is_active=True,
                password_hash=pw_hash,
                account_status="active",
                created_at=now,
                updated_at=now,
            ),
            Employee(
                id="a3000000-0000-0000-0000-000000000005",
                employee_id="EMP-009",
                name="Neha Singh",
                email="neha.singh@quadrantitservices.com",
                department="Engineering",
                vehicle_number="MH 12 IJ 3456",
                avatar_initials="NS",
                role="employee",
                is_active=True,
                password_hash=pw_hash,
                account_status="active",
                created_at=now,
                updated_at=now,
            ),
            Employee(
                id="a3000000-0000-0000-0000-000000000006",
                employee_id="EMP-010",
                name="Karan Malhotra",
                email="karan.malhotra@quadrantitservices.com",
                department="Sales",
                vehicle_number="MH 12 KL 7890",
                avatar_initials="KM",
                role="employee",
                is_active=True,
                password_hash=pw_hash,
                account_status="active",
                created_at=now,
                updated_at=now,
            ),
            Employee(
                id="a3000000-0000-0000-0000-000000000007",
                employee_id="EMP-011",
                name="Pooja Joshi",
                email="pooja.joshi@quadrantitservices.com",
                department="Finance",
                vehicle_number="MH 12 MN 1234",
                avatar_initials="PJ",
                role="employee",
                is_active=True,
                password_hash=pw_hash,
                account_status="active",
                created_at=now,
                updated_at=now,
            ),
            Employee(
                id="a3000000-0000-0000-0000-000000000008",
                employee_id="EMP-012",
                name="Siddharth Rao",
                email="siddharth.rao@quadrantitservices.com",
                department="Engineering",
                vehicle_number="MH 12 OP 5678",
                avatar_initials="SR",
                role="employee",
                is_active=True,
                password_hash=pw_hash,
                account_status="active",
                created_at=now,
                updated_at=now,
            ),
        ]

        if existing == 0:
            db.add_all(employees)
            db.commit()

            print(f"✓ Seeded {len(employees)} employees (password: 'password')")
            print("  - 1 HR admin: admin@quadrantitservices.com")
            print("  - 3 managers")
            print("  - 8 employees (active)")

        # -------------------------------------------------------------
        # Migrate Parking Data from db.json
        # -------------------------------------------------------------
        db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "db.json")
        if os.path.exists(db_path):
            with open(db_path, "r") as f:
                data = json.load(f)
                
            if "floors" in data:
                existing_floors = db.query(Floor).count()
                if existing_floors == 0:
                    for f_data in data["floors"]:
                        db.add(Floor(**f_data))
                    db.commit()
                    print(f"✓ Migrated {len(data['floors'])} floors")
                    
            if "slots" in data:
                existing_slots = db.query(ParkingSlot).count()
                if existing_slots == 0:
                    for s_data in data["slots"]:
                        db.add(ParkingSlot(
                            id=s_data["id"],
                            label=s_data["label"],
                            floor_id=s_data["floor_id"],
                            position=s_data["position"],
                            status=s_data.get("status", "active"),
                            reserved_for_manager_id=s_data.get("reserved_for_manager_id")
                        ))
                    db.commit()
                    print(f"✓ Migrated {len(data['slots'])} parking slots")
                    
            if "reservations" in data:
                existing_res = db.query(Reservation).count()
                if existing_res == 0:
                    for r_data in data["reservations"]:
                        dt = None
                        try:
                            # Handle different iso formats
                            dt = datetime.fromisoformat(r_data["created_at"].replace('Z', '+00:00'))
                        except ValueError:
                            dt = datetime.utcnow()
                            
                        db.add(Reservation(
                            id=r_data["id"],
                            user_id=r_data["user_id"],
                            user_name=r_data["user_name"],
                            slot_id=r_data["slot_id"],
                            vehicle_number=r_data["vehicle_number"],
                            date=r_data["date"],
                            created_at=dt,
                            reserved_by=r_data.get("reserved_by", r_data["user_id"]),
                            status=r_data.get("status", "active")
                        ))
                    db.commit()
                    print(f"✓ Migrated {len(data['reservations'])} reservations")
                    
            if "manager_releases" in data:
                existing_rel = db.query(ManagerRelease).count()
                if existing_rel == 0:
                    for mr_data in data["manager_releases"]:
                        import uuid
                        db.add(ManagerRelease(
                            id=str(uuid.uuid4()),
                            manager_id=mr_data["manager_id"],
                            slot_id=mr_data["slot_id"],
                            release_date=mr_data["release_date"]
                        ))
                    db.commit()
                    print(f"✓ Migrated {len(data['manager_releases'])} manager releases")

    except Exception as e:
        db.rollback()
        print(f"✗ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
