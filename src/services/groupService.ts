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

// ----------- GET GROUP MEMBERS -------------------
export interface IGroupMemberDetailed {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    photoURL?: string;
  };
  role: 'teacher' | 'student';
  joinedAt: string;
}

export interface IGroupMembersResponse {
  members: IGroupMemberDetailed[];
  pagination: {
    totalMembers: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export const getGroupMembers = async (
  groupId: string,
  page: number = 1,
  limit: number = 20,
): Promise<IGroupMembersResponse> => {
  const res = await apiClient.get(`/groups/${groupId}/members`, {
    params: { page, limit },
  });
  return {
    members: res.data.data,
    pagination: res.data.pagination,
  };
};

// ----------- REMOVE GROUP MEMBER -------------------
// Note: This endpoint needs to be implemented in the backend
export const removeGroupMember = async (groupId: string, userId: string) => {
  try {
    const res = await apiClient.delete(`/groups/${groupId}/members/${userId}`);
    return res.data;
  } catch (error: unknown) {
    // If endpoint doesn't exist yet, throw a user-friendly error
    const axiosError = error as { response?: { status?: number } };
    if (axiosError.response?.status === 404) {
      throw new Error('Remove member functionality not yet implemented in backend');
    }
    throw error;
  }
};
