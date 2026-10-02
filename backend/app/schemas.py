from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, field_validator

from enum import StrEnum

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





