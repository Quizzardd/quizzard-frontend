import apiClient from '@/config/axiosConfig';

// ----------- GET USER GROUPS -------------------
export const getUserGroups = async () => {
  const res = await apiClient.get('/users/me');
  console.log(res.data);
  return res.data.data; // array of groups + role
};

export const getGroupById = async (groupId: string) => {
  console.log('groub id: ', groupId);
  const res = await apiClient.get(`/groups/${groupId}`);
  return res.data.data;
};
