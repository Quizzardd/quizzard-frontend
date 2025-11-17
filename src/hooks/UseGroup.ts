import { createGroup, getUserGroups } from '@/services/groupService';
import type { CreateGroupPayload } from '@/services/groupService';
import type { IGroupMember } from '@/types/groups';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getApiErrorMessage } from '@/lib/apiError';

// -------------------- GET USER GROUPS -------------------
export const useUserGroups = () => {
  return useQuery({
    queryKey: ['my-groups'],
    queryFn: getUserGroups,
  });
};

// -------------------- CREATE GROUP -------------------
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onMutate: async (newGroup: CreateGroupPayload) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['my-groups'] });

      // Snapshot previous value
      const previousGroups = queryClient.getQueryData(['my-groups']);

      // Optimistically update to the new value
      queryClient.setQueryData<IGroupMember[]>(['my-groups'], (old) => {
        const optimisticGroup: IGroupMember = {
          _id: `temp-${Date.now()}`,
          group: {
            _id: `temp-${Date.now()}`,
            title: newGroup.title,
            coverUrl: newGroup.coverUrl,
            owner: 'current-user',
            membersCount: 1,
            modulesCount: 0,
          },
          user: 'current-user',
          role: 'teacher',
          joinedAt: new Date().toISOString(),
        };
        return old ? [...old, optimisticGroup] : [optimisticGroup];
      });

      return { previousGroups };
    },
    onError: (err: unknown, _newGroup, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to create group'));

      // Rollback on error
      if (context?.previousGroups) {
        queryClient.setQueryData(['my-groups'], context.previousGroups);
      }
    },
    onSuccess: () => {
      toast.success('Group created successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-groups'] });
    },
  });
};
