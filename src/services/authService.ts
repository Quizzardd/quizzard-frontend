import apiClient from '@/config/axiosConfig';
import type { IRegisterPayload } from '@/types/registerPayload';

export const authService = {
  register: async (payload: IRegisterPayload) => {
    const res = await apiClient.post('/user/register', payload);
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await apiClient.post('/user/login', { email, password });
    return res.data.userToken;
  },

  logout: async () => {
    await apiClient.post('/user/logout');
  },
  getProfile: async () => {
    const res = await apiClient.get('/user/profile');
    return res.data;
  },
  refresh: async () => {
    const res = await apiClient.post('/user/refresh');
    return res.data.userToken;
  },
};
