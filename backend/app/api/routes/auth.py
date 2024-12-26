from datetime import timedelta

from fastapi import APIRouter, HTTPException, status

from ... import crud
from ...core import security
from ...core.config import settings
from ...models import Token, UserCreate, UserRead
from ..deps import LoginFormDep, SessionDep

router = APIRouter()


@router.post("/signup", response_model=UserRead)
async def signup(*, session: SessionDep, user_in: UserCreate):
    user_email = crud.get_user_by_email(session=session, email=user_in.email)
    user_username = crud.get_user_by_username(
        session=session, username=user_in.username
    )
    if user_email or user_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered",
        )
    return crud.create_user(session=session, user_create=user_in)


@router.post("/login")
async def login(*, session: SessionDep, form_data: LoginFormDep) -> Token:
    user = crud.authenticate(
        session=session, username=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="User is not active")
    expire = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(user.id, expires_delta=expire)
    return Token(access_token=access_token, token_type="bearer")
