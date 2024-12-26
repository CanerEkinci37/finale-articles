from sqlmodel import Session, SQLModel, create_engine, select

from .. import crud
from ..models import User, UserCreate
from .config import settings

engine = create_engine(
    str(settings.DATABASE_URL), connect_args={"check_same_thread": False}
)


def init_db(session: Session) -> None:
    SQLModel.metadata.create_all(engine)

    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER_EMAIL)
    ).first()

    if not user:
        user_create = UserCreate(
            username=settings.FIRST_SUPERUSER_USERNAME,
            email=settings.FIRST_SUPERUSER_EMAIL,
            password=settings.FIRST_SUPERUSER_PASSWORD,
        )
        crud.create_superuser(session=session, user_create=user_create)
