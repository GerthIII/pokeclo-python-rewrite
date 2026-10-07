from fastapi import APIRouter, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import CurrentUserId
from app.database import SessionDep
from app.models import Item
from app.schemas import ItemCreate, ItemRead, ItemUpdate

router = APIRouter(prefix="/api/items", tags=["items"])


def _get_or_404(session: Session, user_id: int, item_id: int) -> Item:
    item = session.get(Item, item_id)

    if item is None or user_id != item.user_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Item not found")
    return item


@router.get("", response_model=list[ItemRead])
def list_items(session: SessionDep, user_id: CurrentUserId):
    return session.scalars(select(Item).where(Item.user_id == user_id).order_by(Item.name)).all()


@router.post("", response_model=ItemRead, status_code=201)
def create_item(payload: ItemCreate, session: SessionDep, user_id: CurrentUserId):
    item = Item(user_id=user_id, **payload.model_dump())
    session.add(item)
    session.commit()

    return item


@router.patch("/{item_id}", response_model=ItemRead)
def update_item(item_id: int, payload: ItemUpdate, session: SessionDep, user_id: CurrentUserId):
    item = _get_or_404(session, user_id, item_id)
    for field, value in payload.model_dump(exclude_unset=True, exclude_none=True).items():
        setattr(item, field, value)
    session.commit()
    return item


@router.delete("/{item_id}", status_code=204)
def delete_item(item_id: int, user_id: CurrentUserId, session: SessionDep):
    item = _get_or_404(session, user_id, item_id)
    session.delete(item)
    session.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
