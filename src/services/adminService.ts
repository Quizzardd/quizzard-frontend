import apiClient from '@/config/axiosConfig';

// ----------- GET ALL GROUPS (ADMIN) -------------------
export const getAllGroups = async () => {
  const res = await apiClient.get('/groups');
  return res.data.data;
};

// ----------- GET ALL USERS / SEARCH USERS (ADMIN) -------------------
export const searchUsers = async (query?: string) => {
  const res = await apiClient.get('/users/search', {
    params: query ? { q: query } : undefined,
  });
  return res.data.data;
};

// ----------- GET USER BY ID (ADMIN) -------------------
export const getUserById = async (userId: string) => {
  const res = await apiClient.get(`/users/${userId}`);
  return res.data.data;
};

// ----------- DELETE USER (ADMIN) -------------------
export const deleteUser = async (userId: string) => {
  const res = await apiClient.delete(`/users/${userId}`);
  return res.data;
};

// ----------- DELETE GROUP PERMANENTLY (ADMIN) -------------------
export const deleteGroupPermanently = async (groupId: string) => {
  const res = await apiClient.delete(`/groups/${groupId}/hard`);
  return res.data;
};

// ----------- GET DAILY LOGIN STATISTICS (ADMIN) -------------------
export interface DailyLoginStats {
  date: string;
  uniqueUsers: number;
  totalLogins: number;
}

export interface LoginAnalytics {
  stats: DailyLoginStats[];
  summary: {
    totalLogins: number;
    totalUniqueUsers: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
}

export const getDailyLoginStats = async (params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<LoginAnalytics> => {
  const res = await apiClient.get('/analytics/logins/daily', { params });
  return res.data.data;
};

// ----------- GET PLATFORM OVERVIEW STATISTICS (ADMIN) -------------------
export interface PlatformOverview {
  totalUsers: number;
  activeUsers: number;
  todayLogins: number;
  last7Days: {
    totalLogins: number;
    uniqueUsers: number;
    averageLoginsPerDay: number;
  };
  last30Days: {
    totalLogins: number;
    uniqueUsers: number;
    averageLoginsPerDay: number;
  };
}

export const getPlatformOverview = async (): Promise<PlatformOverview> => {
  const res = await apiClient.get('/analytics/overview');
  return res.data.data;
};
