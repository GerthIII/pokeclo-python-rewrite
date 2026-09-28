from collections.abc import Generator
from typing import Annotated

from fastapi  import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from app.config import settings

