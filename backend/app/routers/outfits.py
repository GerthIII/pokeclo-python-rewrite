from fastapi import APIRouter, HTTPException, Response, status
from sqlalchemy import select

from app.auth import CurrentUserId
from app.database import SessionDep
from app.models import Outfit
from app.schemas import OutfitCreate, OutfitRead, OutfitUpdate
from app.services.fill_slot import ItemNotFound, fill_slot

router = APIRouter(prefix="/api/outfits", tags=["outfits"])


@router.get("", response_model=list[OutfitRead])
def list_outfits(session: SessionDep, user_id: CurrentUserId):
    return session.scalars(
        select(Outfit).where(Outfit.user_id == user_id).order_by(Outfit.name)
    ).all()


@router.get("/{outfit_id}", response_model=OutfitRead)
def show_outfit(session: SessionDep, user_id: CurrentUserId, outfit_id: int):
    outfit = session.get(Outfit, outfit_id)
    if outfit is None or outfit.user_id != user_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Outfit not found")

    return outfit


@router.post("", response_model=OutfitRead, status_code=201)
def create_outfit(payload: OutfitCreate, session: SessionDep, user_id: CurrentUserId):
    outfit = Outfit(user_id=user_id, **payload.model_dump(exclude={"items"}))
    session.add(outfit)
    session.flush()
    outfit_id = outfit.id
    try:
        for entry in payload.items:
            item_id = entry.item_id
            fill_slot(session, item_id, outfit_id, user_id)
    except ItemNotFound as err:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Item not found") from err

    session.commit()
    return outfit


@router.patch("/{outfit_id}", response_model=OutfitRead)
def update_outfit(
    payload: OutfitUpdate, session: SessionDep, user_id: CurrentUserId, outfit_id: int
):
    outfit = session.get(Outfit, outfit_id)
    if outfit is None or outfit.user_id != user_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Outfit not found")
    for field, value in payload.model_dump(
        exclude_unset=True, exclude_none=True, exclude={"items"}
    ).items():
        setattr(outfit, field, value)

    try:
        if payload.items:
            for entry in payload.items:
                item_id = entry.item_id
                fill_slot(session, item_id, outfit_id, user_id)
    except ItemNotFound as err:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Item not found") from err

    session.commit()
    return outfit


@router.delete("/{outfit_id}", status_code=204)
def delete_outfit(session: SessionDep, user_id: CurrentUserId, outfit_id: int):
    outfit = session.get(Outfit, outfit_id)
    if outfit is None or outfit.user_id != user_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Outfit not found")
    session.delete(outfit)
    session.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
