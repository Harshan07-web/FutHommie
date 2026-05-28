from sqlalchemy.engine import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

from database.fixture_models import OverallStanding,HomeStanding,AwayStanding
from database.base import base

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")

engine = create_engine(DB_URL)

session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

base.metadata.create_all(bind=engine)