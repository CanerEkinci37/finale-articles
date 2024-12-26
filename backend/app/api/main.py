from fastapi import APIRouter

from .routes import articles, auth, me, users

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(me.router, prefix="/me", tags=["me"])
api_router.include_router(articles.router, prefix="/articles", tags=["articles"])
