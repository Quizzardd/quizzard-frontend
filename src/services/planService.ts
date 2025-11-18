import apiClient from '@/config/axiosConfig';

// ----------- GET ALL PLANS -------------------
export const getPlans = async () => {
  const res = await apiClient.get('/plans');
  return res.data.data;
};
