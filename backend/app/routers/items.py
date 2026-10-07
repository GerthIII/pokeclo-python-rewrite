from fastapi import APIRouter
from sqlalchemy import select

from app.auth import CurrentUserId
from app.database import SessionDep
from app.models import Item
from app.schemas import ItemCreate, ItemRead

router = APIRouter(prefix="/api/items", tags=["items"])


@router.get("", response_model=list[ItemRead])
def list_items(session: SessionDep, user_id: CurrentUserId):
    return session.scalars(select(Item).where(Item.user_id == user_id).order_by(Item.name)).all()


@router.post("", response_model=ItemRead, status_code=201)
def create_item(payload: ItemCreate, session: SessionDep, user_id: CurrentUserId):
    item = Item(user_id=user_id, **payload.model_dump())
    session.add(item)
    session.commit()

    return item
