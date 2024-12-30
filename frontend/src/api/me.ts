import api from '../utils';
import { UserRead } from '../types/User';

export const meApi = {
  getMe: async (): Promise<UserRead> => {
    const response = await api.get<UserRead>('/me');
    return response.data;
  },
};