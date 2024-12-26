from fastapi import APIRouter, HTTPException

from ... import crud
from ...models import UserRead, UserUpdate
from ..deps import CurrentUser, SessionDep

router = APIRouter()


@router.get("/", response_model=UserRead)
def get_me(*, session: SessionDep, current_user: CurrentUser):
    return current_user


@router.patch("/", response_model=UserRead)
def edit_me(*, session: SessionDep, current_user: CurrentUser, user_update: UserUpdate):
    if user_update.email:
        existing_user = crud.get_user_by_email(session=session, email=user_update.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=400, detail="User with this email already exists"
            )

    if user_update.username:
        existing_user = crud.get_user_by_username(
            session=session, username=user_update.username
        )
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=400, detail="User with this username already exists"
            )

    return crud.update_user(
        session=session, db_user=current_user, user_update=user_update
    )


@router.delete("/", response_model=UserRead)
def delete_me(*, session: SessionDep, current_user: CurrentUser):
    return crud.delete_user(session=session, db_user=current_user)
