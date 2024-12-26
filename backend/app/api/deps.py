from typing import Annotated, Generator

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session

from ..core import security
from ..core.config import settings
from ..core.db import engine
from ..models import TokenPayload, User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


def get_db() -> Generator[Session, None, None]:
    """Dependency for database session."""
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]


def get_current_user(
    session: SessionDep,
    token: TokenDep,
) -> User:
    """Get current authenticated user."""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, detail="Could not validate credentials"
        )
    user = session.get(User, token_data.sub)
    if not User:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_active_superuser(current_user: CurrentUser) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user


LoginFormDep = Annotated[OAuth2PasswordRequestForm, Depends()]
