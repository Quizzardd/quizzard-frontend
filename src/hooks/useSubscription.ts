import { useQuery } from '@tanstack/react-query';
import { getMySubscription } from '@/services/subscriptionService';

// -------------------- GET MY SUBSCRIPTION -------------------
export const useMySubscription = () => {
  return useQuery({
    queryKey: ['my-subscription'],
    queryFn: getMySubscription,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
