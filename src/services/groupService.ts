import apiClient from '@/config/axiosConfig';

// ----------- GET USER GROUPS -------------------
export const getUserGroups = async () => {
  const res = await apiClient.get('/groups/me');
  return res.data.data; // array of groups + role
};

export const getGroupById = async (groupId: string) => {
  console.log('group id: ', groupId);
  const res = await apiClient.get(`/groups/${groupId}`);
  return res.data.data;
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

// ----------- UPDATE GROUP -------------------
export interface UpdateGroupPayload {
  title?: string;
  coverUrl?: string;
}

export const updateGroup = async (groupId: string, payload: UpdateGroupPayload) => {
  const res = await apiClient.patch(`/groups/${groupId}`, payload);
  return res.data.data;
};

// ----------- DELETE GROUP (HARD DELETE) -------------------
export const deleteGroup = async (groupId: string) => {
  const res = await apiClient.delete(`/groups/${groupId}/hard`);
  return res.data;
};

// ----------- ARCHIVE GROUP (SOFT DELETE) -------------------
export const archiveGroup = async (groupId: string) => {
  const res = await apiClient.delete(`/groups/${groupId}`);
  return res.data;
};

// ----------- JOIN GROUP WITH INVITE CODE -------------------
export const joinGroup = async (inviteCode: string) => {
  const res = await apiClient.post('/groups/join', { inviteCode });
  return res.data.data;
};

// ----------- LEAVE GROUP -------------------
export const leaveGroup = async (groupId: string) => {
  const res = await apiClient.delete(`/groups/${groupId}/leave`);
  return res.data;
};
