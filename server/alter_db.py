import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text('ALTER TABLE floors ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;'))
        conn.commit()
        print('Success!')
    except Exception as e:
        print(f'Error: {e}')
