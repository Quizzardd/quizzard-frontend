import { useQuery } from '@tanstack/react-query';
import { getRemainingCredits } from '@/services/aiCreditsService';

// -------------------- GET REMAINING AI CREDITS -------------------
export const useRemainingCredits = () => {
  return useQuery({
    queryKey: ['ai-credits-remaining'],
    queryFn: getRemainingCredits,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
