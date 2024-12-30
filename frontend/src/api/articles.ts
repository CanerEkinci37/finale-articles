import api from '../utils'
import { Article, CreateArticleDto, UpdateArticleDto } from '../types/Article';


export const articlesApi = {
  getAll: async (): Promise<Article[]> => {
    const response = await api.get<Article[]>('/articles');
    return response.data;
  },

  getById: async (id: number): Promise<Article> => {
    const response = await api.get<Article>(`/articles/${id}`);
    return response.data;
  },

  create: async (data: CreateArticleDto): Promise<Article> => {
    const response = await api.post<Article>('/articles', data);
    return response.data;
  },

  update: async (id: number, data: UpdateArticleDto): Promise<Article> => {
    const response = await api.put<Article>(`/articles/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/articles/${id}`);
  },
}; 