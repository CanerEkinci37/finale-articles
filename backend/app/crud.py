import uuid
from datetime import datetime

from sqlalchemy.orm import joinedload
from sqlmodel import Session, select

from .core import security
from .core.security import get_password_hash
from .models import Article, ArticleCreate, ArticleUpdate, User, UserCreate, UserUpdate


def create_user(*, session: Session, user_create: UserCreate):
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def create_superuser(*, session: Session, user_create: UserCreate):
    db_obj = User.model_validate(
        user_create,
        update={
            "hashed_password": get_password_hash(user_create.password),
            "is_superuser": True,
        },
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_users(*, session: Session):
    db_obj = session.exec(select(User)).all()
    return db_obj


def get_user_by_id(*, session: Session, user_id: uuid.UUID):
    db_obj = session.exec(select(User).where(User.id == user_id)).first()
    return db_obj


def get_user_by_email(*, session: Session, email: str):
    db_obj = session.exec(select(User).where(User.email == email)).first()
    return db_obj


def get_user_by_username(*, session: Session, username: str):
    db_obj = session.exec(select(User).where(User.username == username)).first()
    return db_obj


def update_user(*, session: Session, db_user: User, user_update: UserUpdate):
    user_data = user_update.model_dump(exclude_unset=True)
    extra_data = {"updated_at": datetime.utcnow()}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def delete_user(*, session: Session, db_user: User):
    session.delete(db_user)
    session.commit()
    return db_user


def authenticate(*, session: Session, username: str, password: str):
    db_user = get_user_by_username(session=session, username=username)
    if not db_user:
        return None
    elif not security.verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_article(*, session: Session, article_create: ArticleCreate, user: User):
    db_obj = Article.model_validate(article_create, update={"author_id": user.id})
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_articles(
    *,
    session: Session,
):
    db_obj = session.exec(select(Article).order_by(Article.created_at.desc())).all()
    return db_obj


def get_articles_by_author_id(*, session: Session, author_id: uuid.UUID):
    db_obj = session.exec(select(Article).where(Article.author_id == author_id)).all()
    return db_obj


def get_article_by_id(*, session: Session, article_id: uuid.UUID):
    db_obj = (
        session.query(Article)
        .options(joinedload(Article.author))
        .filter(Article.id == article_id)
        .first()
    )
    return db_obj


def update_article(
    *,
    session: Session,
    db_article: Article,
    article_update: ArticleUpdate,
):
    article_data = article_update.model_dump(exclude_unset=True)
    extra_data = {"updated_at": datetime.utcnow()}
    db_article.sqlmodel_update(article_data, update=extra_data)
    session.add(db_article)
    session.commit()
    session.refresh(db_article)
    return db_article


def delete_article(*, session: Session, db_article: Article):
    session.delete(db_article)
    session.commit()
    return db_article
