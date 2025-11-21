import apiClient from '@/config/axiosConfig';

// ----------- GET MY SUBSCRIPTION -------------------
export const getMySubscription = async () => {
  const res = await apiClient.get('/subscriptions/my-subscription');
  return res.data.subscription;
};

// ----------- CHECKOUT -------------------
export const checkout = async (planId: string) => {
  const res = await apiClient.post('/subscriptions/checkout', { planId });
  return res.data;
};

// ----------- DOWNGRADE TO FREE PLAN -------------------
export const downgradeToFreePlan = async (planId: string) => {
  const res = await apiClient.post('/subscriptions/freeplan', { planId });
  return res.data;
};
