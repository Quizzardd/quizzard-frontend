import { getPlans } from '@/services/planService';
import { useQuery } from '@tanstack/react-query';

// -------------------- GET ALL PLANS -------------------
export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: 5 * 60 * 1000, // Cache plans for 5 minutes
  });
};
