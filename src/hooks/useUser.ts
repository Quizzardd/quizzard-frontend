import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { IUser } from '@/types';
import { getMe, updateProfile, changePassword, uploadProfilePhoto, getUserStats, getMyGroups } from '@/services/userService';
import { getApiErrorMessage } from '@/lib/apiError';

// -------------------- GET USER --------------------
export const useGetMe = () =>
  useQuery<IUser>({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
  });

// -------------------- GET USER STATS -------------------
export const useUserStats = () => {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: getUserStats,
  });
};

// -------------------- GET USER GROUPS -------------------
export const useMyGroups = () => {
  return useQuery({
    queryKey: ['my-groups'],
    queryFn: getMyGroups,
  });
};

// -------------------- UPDATE PROFILE --------------------
export const useUpdateProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      qc.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Failed to update profile'));
    },
  });
};

// -------------------- CHANGE PASSWORD --------------------
export const useChangePassword = () =>
  useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password updated successfully');
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Failed to change password'));
    },
  });

// -------------------- UPLOAD PROFILE PHOTO --------------------
export const useUploadPhoto = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: uploadProfilePhoto,
    onMutate: async (file: File) => {
      await qc.cancelQueries({ queryKey: ['me'] });

      const previousUser = qc.getQueryData<IUser>(['me']);

      const previewURL = URL.createObjectURL(file);

      qc.setQueryData<IUser | undefined>(['me'], (old) =>
        old ? { ...old, photoURL: previewURL } : old,
      );

      return { previousUser };
    },
    onError: (err: unknown, _file, ctx) => {
      toast.error(getApiErrorMessage(err, 'Failed to upload photo'));

      if (ctx?.previousUser) {
        qc.setQueryData(['me'], ctx.previousUser);
      }
    },
    onSuccess: () => {
      toast.success('Photo updated');
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
};
