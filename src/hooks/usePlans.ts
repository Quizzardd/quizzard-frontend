import { getPlans, updatePlan, deletePlan } from '@/services/planService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getApiErrorMessage } from '@/lib/apiError';
import type { IPlan } from '@/types';

// -------------------- GET ALL PLANS -------------------
export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
    staleTime: 5 * 60 * 1000, // Cache plans for 5 minutes
  });
};

// -------------------- UPDATE PLAN (ADMIN) -------------------
export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlan,
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['plans'] });

      // Snapshot previous value
      const previousPlans = queryClient.getQueryData<IPlan[]>(['plans']);

      // Optimistically update
      queryClient.setQueryData<IPlan[]>(['plans'], (old) =>
        old?.map((plan) => (plan._id === id ? { ...plan, ...data } : plan)),
      );

      return { previousPlans };
    },
    onError: (err: unknown, _variables, context) => {
      // Rollback on error
      if (context?.previousPlans) {
        queryClient.setQueryData(['plans'], context.previousPlans);
      }
      toast.error(getApiErrorMessage(err, 'Failed to update plan'));
    },
    onSuccess: () => {
      toast.success('Plan updated successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

// -------------------- DELETE PLAN (ADMIN) -------------------
export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlan,
    onMutate: async (planId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['plans'] });

      // Snapshot previous value
      const previousPlans = queryClient.getQueryData<IPlan[]>(['plans']);

      // Optimistically remove the plan
      queryClient.setQueryData<IPlan[]>(['plans'], (old) =>
        old?.filter((plan) => plan._id !== planId),
      );

      return { previousPlans };
    },
    onError: (err: unknown, _variables, context) => {
      // Rollback on error
      if (context?.previousPlans) {
        queryClient.setQueryData(['plans'], context.previousPlans);
      }
      toast.error(getApiErrorMessage(err, 'Failed to delete plan'));
    },
    onSuccess: () => {
      toast.success('Plan deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};
