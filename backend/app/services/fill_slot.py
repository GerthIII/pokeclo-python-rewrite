from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.models import Item, Outfit, OutfitItem


class ItemNotFound(Exception):
    def __init__(self, item_id: int) -> None:
        super().__init__(f"item {item_id} not found")
        self.item_id = item_id


class OutfitNotFound(Exception):
    def __init__(self, outfit_id: int) -> None:
        super().__init__(f"outfit {outfit_id} not found")
        self.outfit_id = outfit_id


def fill_slot(session: Session, item_id: int, outfit_id: int, user_id: int) -> Outfit:
    item = session.get(Item, item_id)
    outfit = session.get(Outfit, outfit_id)

    if item is None or item.user_id != user_id:
        raise ItemNotFound(item_id)

    if outfit is None or outfit.user_id != user_id:
        raise OutfitNotFound(outfit_id)

    # Replaces whatever is already in the slot
    # callers passing several items for one slot get the last one
    # Situations where this might occur:
    # The AI chat flow. PLANNING.md has Gemini "select this item".
    # A model could easily suggest two tops in one reply.
    # A frontend bug. For example, stale state sends both the old and the new pick.
    # Someone scripting the API directly, such as me, testing in /docs.
    session.execute(
        delete(OutfitItem).where(OutfitItem.outfit_id == outfit_id, OutfitItem.slot == item.slot)
    )
    session.add(OutfitItem(item_id=item_id, outfit_id=outfit_id, slot=item.slot))
    
    return outfit
