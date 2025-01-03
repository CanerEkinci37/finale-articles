import time

from sqlmodel import Session, SQLModel, create_engine, select

from .. import crud
from ..models import User, UserCreate
from .config import settings


def get_engine(retries=5, delay=2):
    for i in range(retries):
        try:
            engine = create_engine(settings.DATABASE_URL)
            # Test the connection
            with engine.connect() as conn:
                conn.execute(select(1))
            return engine
        except Exception as e:
            if i == retries - 1:  # Last retry
                raise e
            time.sleep(delay)  # Wait before retrying


engine = get_engine()


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
