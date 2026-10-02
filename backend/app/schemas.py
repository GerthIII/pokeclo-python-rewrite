from enum import StrEnum
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, field_validator


class Category(StrEnum):
    sports = "sports"
    casual = "casual"
    formal = "formal"
    outdoor = "outdoor"


class Slot(StrEnum):
    outer = "outer"
    top = "top"
    bottom = "bottom"
    footwear = "footwear"


class ItemStatus(StrEnum):
    owned = "owned"
    wanted = "wanted"


def _clean(value: str | None) -> str | None:
    if value is None:
        return None
    collapsed = " ".join(value.split())
    if not collapsed:
        raise ValueError("Cannot be blank")
    return collapsed


class ItemCreate(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=100)]
    description: Annotated[str, Field(min_length=1)]
    category: Category
    slot: Slot
    status: ItemStatus = ItemStatus.wanted
    _normalise = field_validator("name")(_clean)


class ItemUpdate(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=100)] | None = None
    description: Annotated[str, Field(min_length=1)] | None = None
    category: Category | None = None
    slot: Slot | None = None
    status: ItemStatus | None = None
    _normalize = field_validator("name")(_clean)


class ItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    # No user_id because we'll only ever be looking at the logged in user's items
    name: str
    description: str
    category: Category
    slot: Slot
    status: ItemStatus
    photo_public_id: str | None


class OutfitStatus(StrEnum):
    draft = "draft"
    created = "created"


class OutfitCreate(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=120)] = "Add a name to your outfit"
    description: str | None = None
    _normalise = field_validator("name")(_clean)


class OutfitUpdate(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=120)] | None = None
    description: Annotated[str, Field(min_length=1)] | None = None
    status: OutfitStatus | None = None
    _normalize = field_validator("name")(_clean)


class OutfitRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    status: OutfitStatus
    photo_public_id: str | None
