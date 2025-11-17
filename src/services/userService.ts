// src/services/userService.ts
import apiClient from '@/config/axiosConfig';
import type { IUser } from '@/types';

// ---------- GET ME ----------
export const getMe = async (): Promise<IUser> => {
  const res = await apiClient.get('/users');
  return res.data.data;
};

//------------- GET USER STATS ---------------
export const getUserStats = async () => {
  const res = await apiClient.get('/users/stats');
  return res.data.data;
};
// ----------- GET USER GROUPS -------------------
export const getMyGroups = async () => {
  const res = await apiClient.get('/users/my-groups');
  return res.data.data; // array of groups + role
};
// ---------- UPDATE PROFILE ----------
export const updateProfile = async (data: Partial<IUser>) => {
  const res = await apiClient.put('/users', data);
  return res.data.data;
};

// ---------- CHANGE PASSWORD ----------
export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
  const res = await apiClient.put('/users/password', data);
  return res.data;
};

// ---------- UPLOAD PROFILE PHOTO ----------
export const uploadProfilePhoto = async (file: File) => {
  const formData = new FormData();
  formData.append('photo', file);

  const res = await apiClient.put('/users/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.data; // returns updated user with new photoURL
};
