from typing import Annotated

from fastapi import Depends


def get_current_user_id():
    return 1


CurrentUserId = Annotated[int, Depends(get_current_user_id)]
