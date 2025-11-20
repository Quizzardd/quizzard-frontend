import apiClient from '@/config/axiosConfig';
import type { IPlan } from '@/types';

// ----------- GET ALL PLANS -------------------
export const getPlans = async () => {
  const res = await apiClient.get('/plans');
  return res.data.data;
};

// ----------- UPDATE PLAN (ADMIN) -------------------
export const updatePlan = async ({ id, data }: { id: string; data: Partial<IPlan> }) => {
  const res = await apiClient.patch(`/plans/${id}`, data);
  return res.data.data;
};

// ----------- DELETE PLAN (ADMIN) -------------------
export const deletePlan = async (planId: string) => {
  const res = await apiClient.delete(`/plans/${planId}`);
  return res.data;
};
