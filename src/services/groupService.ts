import apiClient from "@/config/axiosConfig";

// ----------- GET USER GROUPS -------------------
export const getUserGroups = async () => {
  const res = await apiClient.get('/groups/me');
  return res.data.data; // array of groups + role
};