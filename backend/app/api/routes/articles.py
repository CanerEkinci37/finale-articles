import uuid

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import joinedload

from ... import crud
from ...models import Article, ArticleCreate, ArticleRead, ArticleUpdate
from ..deps import CurrentUser, SessionDep

router = APIRouter()


@router.post("/", response_model=ArticleRead)
def create_article(
    *, session: SessionDep, article_create: ArticleCreate, current_user: CurrentUser
):
    return crud.create_article(
        session=session, article_create=article_create, user=current_user
    )


@router.get("/", response_model=list[ArticleRead] | ArticleRead)
def get_articles(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    article_id: uuid.UUID | None = None,
    author_id: uuid.UUID | None = None,
):
    if article_id and author_id:
        raise HTTPException(
            status_code=400, detail="Cannot filter by both article and author"
        )
    elif article_id:
        article = crud.get_article_by_id(session=session, article_id=article_id)
        if article:
            return article
        raise HTTPException(status_code=404, detail="Article not found")
    elif author_id:
        return crud.get_articles_by_author_id(session=session, author_id=author_id)
    return crud.get_articles(session=session)


# 47034041-62ea-4ef1-ab83-d83c24a42906
@router.put("/", response_model=ArticleRead)
def edit_article(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    article_id: uuid.UUID,
    article_update: ArticleUpdate,
):
    article = crud.get_article_by_id(session=session, article_id=article_id)
    if article:
        if current_user.is_superuser or current_user.id == article.author_id:
            return crud.update_article(
                session=session, db_article=article, article_update=article_update
            )
        raise HTTPException(status_code=403, detail="You are not the author")
    raise HTTPException(status_code=404, detail="Article not found")


@router.delete("/", response_model=ArticleRead)
def delete_article(
    *, session: SessionDep, current_user: CurrentUser, article_id: uuid.UUID
):
    article = crud.get_article_by_id(session=session, article_id=article_id)
    if article:
        if current_user.is_superuser or current_user.id == article.author_id:
            return crud.delete_article(session=session, db_article=article)
        raise HTTPException(status_code=403, detail="You are not the author")
    raise HTTPException(status_code=404, detail="Article not found")
