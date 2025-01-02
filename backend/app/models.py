import uuid
from datetime import datetime
from typing import List

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


class TimeStampedModel(SQLModel):
    """Base model that includes created_at and updated_at fields."""

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserBase(SQLModel):
    """Base model for user."""

    email: EmailStr = Field(index=True, unique=True)
    username: str = Field(index=True, unique=True, min_length=5, max_length=20)


class UserCreate(UserBase):
    """Model for creating a new user."""

    password: str = Field(min_length=8, max_length=40)


class UserRead(UserBase):
    id: uuid.UUID | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class UserUpdate(SQLModel):
    email: EmailStr | None = None
    username: str | None = None
    password: str | None = None


class User(TimeStampedModel, UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    # Relationships
    articles: List["Article"] = Relationship(back_populates="author")


# Article Models


class ArticleBase(SQLModel):
    title: str = Field(index=True)
    content: str = Field(index=True)


class ArticleCreate(ArticleBase):
    pass


class ArticleRead(ArticleBase):
    id: uuid.UUID | None = None
    author: UserRead | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class ArticleUpdate(SQLModel):
    title: str | None = None
    content: str | None = None


class Article(TimeStampedModel, ArticleBase, table=True):
    """Article model for blog posts."""

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    author_id: uuid.UUID = Field(foreign_key="user.id")

    # Relationships
    author: User = Relationship(back_populates="articles")


# Token Models


class Token(SQLModel):
    access_token: str
    token_type: str


class TokenPayload(SQLModel):
    sub: uuid.UUID
