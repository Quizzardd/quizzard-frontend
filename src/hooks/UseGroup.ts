import {
  archiveGroup,
  createGroup,
  deleteGroup,
  getUserGroups,
  updateGroup,
  joinGroup,
  leaveGroup,
} from '@/services/groupService';
import type { CreateGroupPayload, UpdateGroupPayload } from '@/services/groupService';
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
            owner: { _id: 'current-user', firstName: 'You', lastName: '' },
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

// -------------------- UPDATE GROUP -------------------
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, payload }: { groupId: string; payload: UpdateGroupPayload }) =>
      updateGroup(groupId, payload),
    onMutate: async ({ groupId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['my-groups'] });

      const previousGroups = queryClient.getQueryData(['my-groups']);

      // Optimistically update the group
      queryClient.setQueryData<IGroupMember[]>(['my-groups'], (old) => {
        if (!old) return old;
        return old.map((item) =>
          item.group._id === groupId
            ? {
                ...item,
                group: {
                  ...item.group,
                  ...payload,
                },
              }
            : item,
        );
      });

      return { previousGroups };
    },
    onError: (err: unknown, _variables, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to update group'));

      if (context?.previousGroups) {
        queryClient.setQueryData(['my-groups'], context.previousGroups);
      }
    },
    onSuccess: () => {
      toast.success('Group updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-groups'] });
    },
  });
};

// -------------------- DELETE GROUP (HARD DELETE) -------------------
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroup,
    onMutate: async (groupId: string) => {
      await queryClient.cancelQueries({ queryKey: ['my-groups'] });

      const previousGroups = queryClient.getQueryData(['my-groups']);

      // Optimistically remove the group
      queryClient.setQueryData<IGroupMember[]>(['my-groups'], (old) => {
        if (!old) return old;
        return old.filter((item) => item.group._id !== groupId);
      });

      return { previousGroups };
    },
    onError: (err: unknown, _groupId, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to delete group'));

      if (context?.previousGroups) {
        queryClient.setQueryData(['my-groups'], context.previousGroups);
      }
    },
    onSuccess: () => {
      toast.success('Group deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-groups'] });
    },
  });
};

// -------------------- ARCHIVE GROUP (SOFT DELETE) -------------------
export const useArchiveGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveGroup,
    onMutate: async (groupId: string) => {
      await queryClient.cancelQueries({ queryKey: ['my-groups'] });

      const previousGroups = queryClient.getQueryData(['my-groups']);

      // Optimistically remove the group (archived groups are filtered out)
      queryClient.setQueryData<IGroupMember[]>(['my-groups'], (old) => {
        if (!old) return old;
        return old.filter((item) => item.group._id !== groupId);
      });

      return { previousGroups };
    },
    onError: (err: unknown, _groupId, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to archive group'));

      if (context?.previousGroups) {
        queryClient.setQueryData(['my-groups'], context.previousGroups);
      }
    },
    onSuccess: () => {
      toast.success('Group archived successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-groups'] });
    },
  });
};

// -------------------- JOIN GROUP -------------------
export const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinGroup,
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Failed to join group'));
    },
    onSuccess: () => {
      toast.success('Successfully joined the group!');
      queryClient.invalidateQueries({ queryKey: ['my-groups'] });
    },
  });
};

// -------------------- LEAVE GROUP -------------------
export const useLeaveGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveGroup,
    onMutate: async (groupId: string) => {
      await queryClient.cancelQueries({ queryKey: ['my-groups'] });

      const previousGroups = queryClient.getQueryData(['my-groups']);

      // Optimistically remove the group
      queryClient.setQueryData<IGroupMember[]>(['my-groups'], (old) => {
        if (!old) return old;
        return old.filter((item) => item.group._id !== groupId);
      });

      return { previousGroups };
    },
    onError: (err: unknown, _groupId, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to leave group'));

      if (context?.previousGroups) {
        queryClient.setQueryData(['my-groups'], context.previousGroups);
      }
    },
    onSuccess: () => {
      toast.success('You have left the group');
      queryClient.invalidateQueries({ queryKey: ['my-groups'] });
    },
  });
};
