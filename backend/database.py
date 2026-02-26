import os
from sqlmodel import create_engine, SQLModel, Session
from dotenv import load_dotenv

load_dotenv()

SYNC_DATABASE_URL = os.getenv(
    "SYNC_DATABASE_URL",
    "postgresql+psycopg2://postgres:postgres@localhost:5432/aquaguardian"
)

engine = create_engine(SYNC_DATABASE_URL, echo=False)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
