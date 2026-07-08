import sys
import os

# Ensure the server directory is in the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import engine, Base
from db.seed_supabase import seed

def reset_and_seed():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("All tables dropped.")
    
    # The seed() function calls Base.metadata.create_all(bind=engine)
    print("Running seed...")
    seed()

if __name__ == "__main__":
    reset_and_seed()
