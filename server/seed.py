"""
Seed script for the JSON-based parking database (db.json).
User IDs match the PostgreSQL employees table so parking references work correctly.
"""
import json
import bcrypt
import uuid
from datetime import datetime, timedelta

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

pw_hash = hash_password("password")
now = datetime.utcnow().isoformat()

floors = [
    {"id": "floor-b1", "name": "Basement 1", "label": "B1", "order": 1},
    {"id": "floor-b2", "name": "Basement 2", "label": "B2", "order": 2},
    {"id": "floor-b3", "name": "Basement 3", "label": "B3", "order": 3}
]

# User IDs must match the PostgreSQL seed (db/seed_supabase.py)
users = [
    {"id": "a1000000-0000-0000-0000-000000000001", "name": "Admin User", "email": "admin@quadrantitservices.com", "department": "HR", "vehicle_number": "MH 14 AB 1111", "avatar_initials": "AD", "role": "hr", "is_active": True, "password_hash": pw_hash, "account_status": "active", "created_at": now, "updated_at": now},
    {"id": "a2000000-0000-0000-0000-000000000001", "name": "Rahul Verma", "email": "rahul.verma@quadrantitservices.com", "department": "Management", "vehicle_number": "MH 12 AB 1234", "avatar_initials": "RV", "role": "manager", "is_active": True, "password_hash": pw_hash, "account_status": "active", "created_at": now, "updated_at": now},
    {"id": "a2000000-0000-0000-0000-000000000002", "name": "Anita Desai", "email": "anita.desai@quadrantitservices.com", "department": "Management", "vehicle_number": "MH 12 AB 5678", "avatar_initials": "AD", "role": "manager", "is_active": True, "password_hash": pw_hash, "account_status": "active", "created_at": now, "updated_at": now},
    {"id": "a2000000-0000-0000-0000-000000000003", "name": "Vikram Shah", "email": "vikram.shah@quadrantitservices.com", "department": "Management", "vehicle_number": "MH 12 AB 9012", "avatar_initials": "VS", "role": "manager", "is_active": True, "password_hash": pw_hash, "account_status": "active", "created_at": now, "updated_at": now},
    {"id": "a3000000-0000-0000-0000-000000000001", "name": "Priya Sharma", "email": "priya.sharma@quadrantitservices.com", "department": "Engineering", "vehicle_number": "MH 12 AB 3456", "avatar_initials": "PS", "role": "employee", "is_active": True, "password_hash": pw_hash, "account_status": "active", "created_at": now, "updated_at": now},
    {"id": "a3000000-0000-0000-0000-000000000002", "name": "Amit Kumar", "email": "amit.kumar@quadrantitservices.com", "department": "Engineering", "vehicle_number": "MH 12 CD 1234", "avatar_initials": "AK", "role": "employee", "is_active": True, "password_hash": pw_hash, "account_status": "active", "created_at": now, "updated_at": now},
    {"id": "a3000000-0000-0000-0000-000000000003", "name": "Sneha Patel", "email": "sneha.patel@quadrantitservices.com", "department": "Design", "vehicle_number": "MH 12 EF 5678", "avatar_initials": "SP", "role": "employee", "is_active": True, "password_hash": pw_hash, "account_status": "active", "created_at": now, "updated_at": now},
    {"id": "a3000000-0000-0000-0000-000000000004", "name": "Rohan Gupta", "email": "rohan.gupta@quadrantitservices.com", "department": "Marketing", "vehicle_number": "MH 12 GH 9012", "avatar_initials": "RG", "role": "employee", "is_active": True, "password_hash": pw_hash, "account_status": "active", "created_at": now, "updated_at": now},
    {"id": "a3000000-0000-0000-0000-000000000005", "name": "Neha Singh", "email": "neha.singh@quadrantitservices.com", "department": "Engineering", "vehicle_number": "MH 12 IJ 3456", "avatar_initials": "NS", "role": "employee", "is_active": True, "password_hash": pw_hash, "account_status": "active", "created_at": now, "updated_at": now},
    {"id": "a3000000-0000-0000-0000-000000000006", "name": "Karan Malhotra", "email": "karan.malhotra@quadrantitservices.com", "department": "Sales", "vehicle_number": "MH 12 KL 7890", "avatar_initials": "KM", "role": "employee", "is_active": True, "password_hash": pw_hash, "account_status": "active", "created_at": now, "updated_at": now},
    {"id": "a3000000-0000-0000-0000-000000000007", "name": "Pooja Joshi", "email": "pooja.joshi@quadrantitservices.com", "department": "Finance", "vehicle_number": "MH 12 MN 1234", "avatar_initials": "PJ", "role": "employee", "is_active": True, "password_hash": pw_hash, "account_status": "active", "created_at": now, "updated_at": now},
    {"id": "a3000000-0000-0000-0000-000000000008", "name": "Siddharth Rao", "email": "siddharth.rao@quadrantitservices.com", "department": "Engineering", "vehicle_number": "MH 12 OP 5678", "avatar_initials": "SR", "role": "employee", "is_active": True, "password_hash": pw_hash, "account_status": "active", "created_at": now, "updated_at": now},
    # Inactive test user — to test the activation flow removed
]

# Manager IDs for slot assignment (must match user IDs above)
managers = [
    "a2000000-0000-0000-0000-000000000001",
    "a2000000-0000-0000-0000-000000000002",
    "a2000000-0000-0000-0000-000000000003",
]

slots = []
for floor_idx, floor in enumerate(floors):
    floor_num = floor_idx + 1
    for i in range(1, 9):
        slot_id = f"P{floor_num}0{i}"
        reserved = None
        if i == 1 and floor_idx < 3:
            reserved = managers[floor_idx]

        slots.append({
            "id": slot_id,
            "label": slot_id,
            "floor_id": floor["id"],
            "position": i,
            "status": "active",
            "reserved_for_manager_id": reserved
        })

today_weekday = datetime.now().weekday()
if today_weekday == 4:
    tomorrow = (datetime.utcnow() + timedelta(days=3)).strftime("%Y-%m-%d")
elif today_weekday == 5:
    tomorrow = (datetime.utcnow() + timedelta(days=2)).strftime("%Y-%m-%d")
elif today_weekday == 6:
    tomorrow = (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%d")
else:
    tomorrow = (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%d")

reservations = [
    {
        "id": str(uuid.uuid4()),
        "user_id": "a3000000-0000-0000-0000-000000000001",
        "user_name": "Priya Sharma",
        "slot_id": "P102",
        "vehicle_number": "MH 12 AB 3456",
        "date": tomorrow,
        "created_at": now,
        "reserved_by": "a3000000-0000-0000-0000-000000000001",
        "status": "active"
    },
    {
        "id": str(uuid.uuid4()),
        "user_id": "a3000000-0000-0000-0000-000000000002",
        "user_name": "Amit Kumar",
        "slot_id": "P103",
        "vehicle_number": "MH 12 CD 1234",
        "date": tomorrow,
        "created_at": now,
        "reserved_by": "a3000000-0000-0000-0000-000000000002",
        "status": "active"
    }
]

manager_releases = [
    {
        "manager_id": "a2000000-0000-0000-0000-000000000001",
        "slot_id": "P101",
        "release_date": tomorrow
    }
]

db = {
    "schema_version": "3.0",
    "users": users,
    "floors": floors,
    "slots": slots,
    "reservations": reservations,
    "manager_releases": manager_releases,
    "password_reset_tokens": []
}

with open("data/db.json", "w") as f:
    json.dump(db, f, indent=2)

print("Seed data generated successfully.")
print(f"  - {len(users)} users (password: 'password')")
print(f"  - {len(floors)} floors")
print(f"  - {len(slots)} slots")
print(f"  - {len(reservations)} reservations")
