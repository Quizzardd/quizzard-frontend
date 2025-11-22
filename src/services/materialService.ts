import apiClient from '@/config/axiosConfig';
import type { IMaterial } from '@/types/materials';

// ----------- GET MATERIALS BY MODULE -------------------
export const getMaterialsByModule = async (moduleId: string): Promise<IMaterial[]> => {
  const res = await apiClient.get(`/materials/module/${moduleId}`);
  return res.data.data;
};

// ----------- GET MATERIAL BY ID -------------------
export const getMaterialById = async (materialId: string): Promise<IMaterial> => {
  const res = await apiClient.get(`/materials/${materialId}`);
  return res.data.data;
};

// ----------- CREATE MATERIAL (FILE UPLOAD) -------------------
export interface CreateMaterialPayload {
  files: File[];
}

export interface CreateMaterialResponse {
  message: string;
  data: IMaterial[];
}

export const createMaterial = async (
  moduleId: string,
  payload: CreateMaterialPayload,
): Promise<CreateMaterialResponse> => {
  const formData = new FormData();
  payload.files.forEach((file) => {
    formData.append('files', file);
  });

  const res = await apiClient.post(`/materials/${moduleId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// ----------- CREATE MATERIAL BY LINK -------------------
export interface CreateMaterialByLinkPayload {
  title?: string;
  url: string;
}

export const createMaterialByLink = async (
  moduleId: string,
  payload: CreateMaterialByLinkPayload,
): Promise<IMaterial[]> => {
  const res = await apiClient.post(`/materials/${moduleId}`, {
    ...payload,
    type: 'link',
  });
  return res.data.data;
};

// ----------- CREATE MATERIAL BY URL (PDF/VIDEO) -------------------
export interface CreateMaterialByUrlPayload {
  title?: string;
  type: 'pdf' | 'video';
  url: string;
}

export const createMaterialByUrl = async (
  moduleId: string,
  payload: CreateMaterialByUrlPayload,
): Promise<IMaterial[]> => {
  const res = await apiClient.post(`/materials/${moduleId}`, payload);
  return res.data.data;
};

// ----------- UPDATE MATERIAL -------------------
export interface UpdateMaterialPayload {
  title?: string;
  url?: string;
}

export const updateMaterial = async (
  materialId: string,
  payload: UpdateMaterialPayload,
): Promise<IMaterial> => {
  const res = await apiClient.put(`/materials/${materialId}`, payload);
  return res.data.data;
};

// ----------- DELETE MATERIAL -------------------
export const deleteMaterial = async (moduleId: string, materialId: string): Promise<void> => {
  const res = await apiClient.delete(`/materials/${moduleId}/${materialId}`);
  return res.data;
};
