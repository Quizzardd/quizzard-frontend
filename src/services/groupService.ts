import apiClient from '@/config/axiosConfig';

// ----------- GET USER GROUPS -------------------
export const getUserGroups = async () => {
  const res = await apiClient.get('/groups/me');
  return res.data.data; // array of groups + role
};

// ----------- CREATE GROUP -------------------
export interface CreateGroupPayload {
  title: string;
  coverUrl?: string;
}

export const createGroup = async (payload: CreateGroupPayload) => {
  const res = await apiClient.post('/groups', payload);
  return res.data.data;
};
