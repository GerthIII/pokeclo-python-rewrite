from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.auth import CurrentUserId
from app.database import SessionDep
from app.models import Outfit
from app.schemas import OutfitRead, OutfitCreate
from app.services.fill_slot import fill_slot, ItemNotFound

router = APIRouter(prefix="/api/outfits", tags=["outfits"])


@router.get("", response_model=list[OutfitRead])
def list_outfits(session: SessionDep, user_id: CurrentUserId):
    return session.scalars(
        select(Outfit).where(Outfit.user_id == user_id).order_by(Outfit.name)
    ).all()


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
