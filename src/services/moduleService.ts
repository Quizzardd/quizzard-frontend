import apiClient from '@/config/axiosConfig';
import type { IModule } from '@/types/modules';

// ----------- GET MODULES BY GROUP -------------------
export const getModulesByGroup = async (groupId: string): Promise<IModule[]> => {
  const res = await apiClient.get(`/modules/group/${groupId}`);
  return res.data.data;
};

// ----------- GET MODULE BY ID -------------------
export const getModuleById = async (moduleId: string): Promise<IModule> => {
  const res = await apiClient.get(`/modules/${moduleId}`);
  return res.data.data;
};

// ----------- CREATE MODULE -------------------
export interface CreateModulePayload {
  title: string;
}

export const createModule = async (
  groupId: string,
  payload: CreateModulePayload,
): Promise<IModule> => {
  const res = await apiClient.post(`/modules/${groupId}`, payload);
  return res.data.data;
};

// ----------- UPDATE MODULE -------------------
export interface UpdateModulePayload {
  title?: string;
}

export const updateModule = async (
  moduleId: string,
  payload: UpdateModulePayload,
): Promise<IModule> => {
  const res = await apiClient.patch(`/modules/${moduleId}`, payload);
  return res.data.data;
};

// ----------- DELETE MODULE -------------------
export const deleteModule = async (moduleId: string): Promise<void> => {
  const res = await apiClient.delete(`/modules/${moduleId}`);
  return res.data;
};
