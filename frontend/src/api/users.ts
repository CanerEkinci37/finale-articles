import api from "../utils";
import { UserRead } from "../types/User";

export const usersApi = {
  getUserById: async (userId: string): Promise<UserRead> => {
    const response = await api.get<UserRead>(`/users/?user_id=${userId}`);
    return response.data;
  },
};
