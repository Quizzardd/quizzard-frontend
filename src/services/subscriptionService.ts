import apiClient from '@/config/axiosConfig';

// ----------- GET MY SUBSCRIPTION -------------------
export const getMySubscription = async () => {
  const res = await apiClient.get('/subscriptions/my-subscription');
  return res.data.subscription;
};
