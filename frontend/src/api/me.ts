import api from "../utils";
import { UserRead, UserUpdate } from "../types/User";

export const meApi = {
  getMe: async (): Promise<UserRead> => {
    const response = await api.get<UserRead>("/me");
    return response.data;
  },
  updateMe: async (userUpdate: Partial<UserUpdate>): Promise<UserRead> => {
    const response = await api.patch<UserRead>("/me", userUpdate, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },
  deleleMe: async (): Promise<UserRead> => {
    const response = await api.delete<UserRead>("/me")
    return response.data;
  }
};
