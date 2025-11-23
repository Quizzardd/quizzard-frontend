import apiClient from '@/config/axiosConfig';
import type { IRegisterPayload } from '@/types/registerPayload';

export const authService = {
  register: async (payload: IRegisterPayload) => {
    const res = await apiClient.post('/users/register', payload);
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await apiClient.post('/users/login', { email, password });
    return { accessToken: res.data.accessToken, role: res.data.role };
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
    const res = await apiClient.post('/users/refresh-token');
    return res.data.accessToken;
  },

  loginWithGoogle: async (token: string) => {
    const res = await apiClient.post('/users/google', { token });
    console.log('Raw Google login response:', res.data);
    return {
      accessToken: res.data.accessToken, // Changed from res.data.token to res.data.accessToken
      user: res.data.user,
      isNewUser: res.data.isNewUser,
    };
  },
};
