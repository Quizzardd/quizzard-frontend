import apiClient from '@/config/axiosConfig';
import type { IAICredits } from '@/types/aiCredits';

// ----------- GET REMAINING AI CREDITS -------------------
export const getRemainingCredits = async (): Promise<IAICredits> => {
  const res = await apiClient.get('/ai-credits/remaining');
  return res.data.data;
};
