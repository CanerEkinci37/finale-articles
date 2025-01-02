import api from "../utils";
import { ArticleCreate, ArticleRead, ArticleUpdate } from "../types/Article";

export const articlesApi = {
  createArticle: async (articleCreate: ArticleCreate): Promise<ArticleRead> => {
    const response = await api.post<ArticleRead>("/articles", articleCreate, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
  getArticles: async (): Promise<ArticleRead[]> => {
    const response = await api.get<ArticleRead[]>("/articles");
    return response.data;
  },
  getArticlesByAuthorId: async (authorId: string): Promise<ArticleRead[]> => {
    const response = await api.get<ArticleRead[]>(
      "/articles/?author_id=" + authorId
    );
    return response.data;
  },
  getArticleById: async (articleId: string): Promise<ArticleRead> => {
    const response = await api.get<ArticleRead>(
      "/articles/?article_id=" + articleId
    );
    return response.data;
  },
  updateArticle: async (
    articleId: string,
    articleUpdate: ArticleUpdate
  ): Promise<ArticleRead> => {
    const response = await api.put<ArticleRead>(
      `/articles/?article_id=${articleId}`,
      articleUpdate,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },
  deleteArticle: async (articleId: string): Promise<void> => {
    const response = await api.delete(`/articles/?article_id=${articleId}`);
    return response.data;
  },
};
