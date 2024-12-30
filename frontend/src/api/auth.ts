import api from '../utils';
import { LoginCredentials, RegisterCredentials, AuthResponse, UserResponse } from '../types/Auth';
import qs from 'qs';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = qs.stringify({
      username: credentials.username,
      password: credentials.password,
    });

    const response = await api.post<AuthResponse>('auth/login', formData);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/me');
    return response.data;
  },
}; 