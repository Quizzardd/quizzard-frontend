import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  getAuthorAnnouncements,
  getGroupAnnouncements,
  searchAnnouncements,
  updateAnnouncement,
} from '@/services/announcementService';
import type {
  CreateAnnouncementPayload,
  PaginationParams,
  SearchAnnouncementsParams,
  UpdateAnnouncementPayload,
} from '@/services/announcementService';
import type { IAnnouncement } from '@/types/announcements';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getApiErrorMessage } from '@/lib/apiError';

// -------------------- GET ANNOUNCEMENT BY ID -------------------
export const useAnnouncementById = (id: string) => {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: () => getAnnouncementById(id),
    enabled: !!id,
  });
};

// -------------------- GET GROUP ANNOUNCEMENTS -------------------
export const useGroupAnnouncements = (groupId: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: ['announcements', 'group', groupId, params],
    queryFn: () => getGroupAnnouncements(groupId, params),
    enabled: !!groupId,
  });
};

// -------------------- GET AUTHOR ANNOUNCEMENTS -------------------
export const useAuthorAnnouncements = (userId: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: ['announcements', 'author', userId, params],
    queryFn: () => getAuthorAnnouncements(userId, params),
    enabled: !!userId,
  });
};

// -------------------- SEARCH ANNOUNCEMENTS -------------------
export const useSearchAnnouncements = (groupId: string, params: SearchAnnouncementsParams) => {
  return useQuery({
    queryKey: ['announcements', 'search', groupId, params],
    queryFn: () => searchAnnouncements(groupId, params),
    enabled: !!groupId && !!params.q,
  });
};

// -------------------- CREATE ANNOUNCEMENT -------------------
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnnouncement,
    onMutate: async (newAnnouncement: CreateAnnouncementPayload) => {
      // Cancel outgoing refetches for the group announcements
      await queryClient.cancelQueries({
        queryKey: ['announcements', 'group', newAnnouncement.group],
      });

      // Snapshot previous value
      const previousAnnouncements = queryClient.getQueryData([
        'announcements',
        'group',
        newAnnouncement.group,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<{
        announcements: IAnnouncement[];
        totalPages: number;
        currentPage: number;
        totalAnnouncements: number;
      }>(['announcements', 'group', newAnnouncement.group], (old) => {
        const optimisticAnnouncement: IAnnouncement = {
          _id: `temp-${Date.now()}`,
          text: newAnnouncement.text,
          group: newAnnouncement.group,
          author: 'current-user',
          quiz: newAnnouncement.quiz,
          createdAt: new Date(),
        };

        return old
          ? {
              ...old,
              announcements: [optimisticAnnouncement, ...old.announcements],
              totalAnnouncements: old.totalAnnouncements + 1,
            }
          : {
              announcements: [optimisticAnnouncement],
              totalPages: 1,
              currentPage: 1,
              totalAnnouncements: 1,
            };
      });

      return { previousAnnouncements };
    },
    onError: (err: unknown, newAnnouncement, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to create announcement'));

      // Rollback on error
      if (context?.previousAnnouncements) {
        queryClient.setQueryData(
          ['announcements', 'group', newAnnouncement.group],
          context.previousAnnouncements,
        );
      }
    },
    onSuccess: (_data, variables) => {
      toast.success('Announcement created successfully!');
      queryClient.invalidateQueries({ queryKey: ['announcements', 'group', variables.group] });
    },
  });
};

// -------------------- UPDATE ANNOUNCEMENT -------------------
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAnnouncementPayload }) =>
      updateAnnouncement(id, payload),
    onMutate: async ({ id, payload }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['announcement', id] });

      const previousAnnouncement = queryClient.getQueryData(['announcement', id]);

      // Optimistically update the announcement
      queryClient.setQueryData<IAnnouncement>(['announcement', id], (old) => {
        if (!old) return old;
        return {
          ...old,
          ...payload,
        };
      });

      return { previousAnnouncement, announcementId: id };
    },
    onError: (err: unknown, _variables, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to update announcement'));

      if (context?.previousAnnouncement) {
        queryClient.setQueryData(
          ['announcement', context.announcementId],
          context.previousAnnouncement,
        );
      }
    },
    onSuccess: (_data, variables) => {
      toast.success('Announcement updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['announcement', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

// -------------------- DELETE ANNOUNCEMENT -------------------
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnnouncement,
    onMutate: async (id: string) => {
      // Get the announcement to find its group
      const announcement = queryClient.getQueryData<IAnnouncement>(['announcement', id]);

      if (announcement) {
        const groupId =
          typeof announcement.group === 'string' ? announcement.group : announcement.group._id;

        await queryClient.cancelQueries({ queryKey: ['announcements', 'group', groupId] });

        const previousAnnouncements = queryClient.getQueryData(['announcements', 'group', groupId]);

        // Optimistically remove the announcement
        queryClient.setQueryData<{
          announcements: IAnnouncement[];
          totalPages: number;
          currentPage: number;
          totalAnnouncements: number;
        }>(['announcements', 'group', groupId], (old) => {
          if (!old) return old;
          return {
            ...old,
            announcements: old.announcements.filter((a) => a._id !== id),
            totalAnnouncements: old.totalAnnouncements - 1,
          };
        });

        return { previousAnnouncements, groupId };
      }

      return {};
    },
    onError: (err: unknown, _id, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to delete announcement'));

      if (context?.previousAnnouncements && context?.groupId) {
        queryClient.setQueryData(
          ['announcements', 'group', context.groupId],
          context.previousAnnouncements,
        );
      }
    },
    onSuccess: (_data, _id, context) => {
      toast.success('Announcement deleted successfully!');
      if (context?.groupId) {
        queryClient.invalidateQueries({ queryKey: ['announcements', 'group', context.groupId] });
      }
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};
