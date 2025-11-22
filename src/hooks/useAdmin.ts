import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllGroups,
  searchUsers,
  getUserById,
  deleteUser,
  deleteGroupPermanently,
  getDailyLoginStats,
  getPlatformOverview,
} from '@/services/adminService';
import { toast } from 'react-hot-toast';
import { getApiErrorMessage } from '@/lib/apiError';

// -------------------- GET ALL GROUPS (ADMIN) -------------------
export const useAdminGroups = () => {
  return useQuery({
    queryKey: ['admin-groups'],
    queryFn: getAllGroups,
  });
};

// -------------------- SEARCH USERS (ADMIN) -------------------
// Fetch all users without query parameter - filtering will be done on frontend
export const useSearchUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => searchUsers(),
  });
};

// -------------------- GET USER BY ID (ADMIN) -------------------
export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: ['admin-user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

// -------------------- DELETE USER (ADMIN) -------------------
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onMutate: async (userId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admin-users'] });

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData(['admin-users']);

      // Optimistically remove the user
      queryClient.setQueryData(['admin-users'], (old: any) =>
        old?.filter((user: any) => user._id !== userId),
      );

      return { previousUsers };
    },
    onError: (err: unknown, _variables, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(['admin-users'], context.previousUsers);
      }
      toast.error(getApiErrorMessage(err, 'Failed to delete user'));
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
};

// -------------------- DELETE GROUP PERMANENTLY (ADMIN) -------------------
export const useDeleteGroupPermanently = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroupPermanently,
    onMutate: async (groupId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admin-groups'] });

      // Snapshot previous value
      const previousGroups = queryClient.getQueryData(['admin-groups']);

      // Optimistically remove the group
      queryClient.setQueryData(['admin-groups'], (old: any) =>
        old?.filter((group: any) => group._id !== groupId),
      );

      return { previousGroups };
    },
    onError: (err: unknown, _variables, context) => {
      // Rollback on error
      if (context?.previousGroups) {
        queryClient.setQueryData(['admin-groups'], context.previousGroups);
      }
      toast.error(getApiErrorMessage(err, 'Failed to delete group'));
    },
    onSuccess: () => {
      toast.success('Group deleted permanently');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-groups'] });
    },
  });
};

// -------------------- GET DAILY LOGIN STATISTICS (ADMIN) -------------------
export const useDailyLoginStats = (params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['admin-login-stats', params],
    queryFn: () => getDailyLoginStats(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// -------------------- GET PLATFORM OVERVIEW (ADMIN) -------------------
export const usePlatformOverview = () => {
  return useQuery({
    queryKey: ['admin-overview'],
    queryFn: getPlatformOverview,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
