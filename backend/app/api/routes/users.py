import uuid

from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from ... import crud
from ...models import User, UserRead, UserUpdate
from ..deps import CurrentUser, SessionDep

router = APIRouter()


@router.get("/", response_model=list[UserRead] | UserRead)
def get_users(
    *, session: SessionDep, current_user: CurrentUser, user_id: uuid.UUID | None = None
):
    if user_id:
        user = crud.get_user_by_id(session=session, user_id=user_id)
        if user:
            return user
        raise HTTPException(status_code=404, detail="User not found")
    elif current_user.is_superuser:
        return crud.get_users(session=session)
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN, detail="You are not a admin"
    )
