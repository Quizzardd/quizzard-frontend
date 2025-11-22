import apiClient from '@/config/axiosConfig';
import type { IAnnouncement } from '@/types/announcements';

// ----------- CREATE ANNOUNCEMENT -------------------
export interface CreateAnnouncementPayload {
  text: string;
  group: string;
  quiz?: string;
}

export const createAnnouncement = async (payload: CreateAnnouncementPayload) => {
  const res = await apiClient.post('/announcements', payload);
  return res.data.data;
};

// ----------- GET ANNOUNCEMENT BY ID -------------------
export const getAnnouncementById = async (id: string): Promise<IAnnouncement> => {
  const res = await apiClient.get(`/announcements/${id}`);
  return res.data.data;
};

// ----------- GET GROUP ANNOUNCEMENTS -------------------
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedAnnouncementsResponse {
  announcements: IAnnouncement[];
  pages: number;
  currentPage: number;
  total: number;
}

export const getGroupAnnouncements = async (
  groupId: string,
  params?: PaginationParams,
): Promise<PaginatedAnnouncementsResponse> => {
  const res = await apiClient.get(`/announcements/group/${groupId}`, {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 10,
    },
  });
  return res.data.data;
};

// ----------- GET AUTHOR ANNOUNCEMENTS -------------------
export const getAuthorAnnouncements = async (
  userId: string,
  params?: PaginationParams,
): Promise<PaginatedAnnouncementsResponse> => {
  const res = await apiClient.get(`/announcements/author/${userId}`, {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 10,
    },
  });
  return res.data.data;
};

// ----------- SEARCH ANNOUNCEMENTS -------------------
export interface SearchAnnouncementsParams extends PaginationParams {
  q: string;
}

export const searchAnnouncements = async (
  groupId: string,
  params: SearchAnnouncementsParams,
): Promise<PaginatedAnnouncementsResponse> => {
  const res = await apiClient.get(`/announcements/search/${groupId}`, {
    params: {
      q: params.q,
      page: params.page || 1,
      limit: params.limit || 10,
    },
  });
  return res.data.data;
};

// ----------- UPDATE ANNOUNCEMENT -------------------
export interface UpdateAnnouncementPayload {
  text?: string;
  quiz?: string;
}

export const updateAnnouncement = async (
  id: string,
  payload: UpdateAnnouncementPayload,
): Promise<IAnnouncement> => {
  const res = await apiClient.put(`/announcements/${id}`, payload);
  return res.data.data;
};

// ----------- DELETE ANNOUNCEMENT -------------------
export const deleteAnnouncement = async (id: string) => {
  const res = await apiClient.delete(`/announcements/${id}`);
  return res.data;
};
