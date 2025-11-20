import apiClient from '@/config/axiosConfig';
import type { IRegisterPayload } from '@/types/registerPayload';

export const authService = {
  register: async (payload: IRegisterPayload) => {
    const res = await apiClient.post('/users/register', payload);
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await apiClient.post('/users/login', { email, password });
    return res.data.accessToken;
  },

  logout: async () => {
    await apiClient.post('/users/logout');
  },
  getUser: async (token: string) => {
    const res = await apiClient.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
  getProfile: async (token: string | null) => {
    const res = await apiClient.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  },
  refresh: async () => {
    const res = await apiClient.post('/users/refresh');
    return res.data.accessToken;
  },
};
