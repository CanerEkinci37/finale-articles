import api from '../utils';
import qs from 'qs';
import { UserCreate, UserLogin, UserRead } from '../types/User';
import { Token } from '../types/Token';

export const authApi = {
  login: async (userLogin: UserLogin): Promise<Token> => {
    const formData = qs.stringify(userLogin);

    const response = await api.post<Token>('auth/login', formData);
    return response.data;
  },

  signup: async (userCreate: UserCreate): Promise<UserRead> => {
    const response = await api.post<UserRead>('/auth/signup', userCreate, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },
};
