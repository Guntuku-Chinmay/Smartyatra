from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Create the SQLAlchemy engine
engine = create_engine(
    settings.database_url,
    echo=settings.debug,
)

# Create a configured session class
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)