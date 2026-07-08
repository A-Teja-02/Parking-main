import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "db.json"

def read_db() -> dict:
    with open(DB_PATH, "r") as f:
        data = json.load(f)
    # Ensure new collections exist (backward-compatible migration)
    data.setdefault("password_reset_tokens", [])
    data.setdefault("schema_version", "1.0")
    return data

def write_db(data: dict) -> None:
    with open(DB_PATH, "w") as f:
        json.dump(data, f, indent=2)
