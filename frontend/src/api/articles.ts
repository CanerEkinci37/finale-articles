import api from '../utils'
import { ArticleRead} from '../types/Article';

export const articlesApi = {
  getAll: async (): Promise<ArticleRead[]> => {
    const response = await api.get<ArticleRead[]>('/articles');
    return response.data;
  },
}; 