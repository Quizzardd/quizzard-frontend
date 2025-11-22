import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '@/lib/apiError';
import type { IMaterial } from '@/types/materials';
import {
  createMaterial,
  createMaterialByLink,
  createMaterialByUrl,
  deleteMaterial,
  getMaterialById,
  getMaterialsByModule,
  updateMaterial,
  type CreateMaterialPayload,
  type CreateMaterialByLinkPayload,
  type CreateMaterialByUrlPayload,
  type UpdateMaterialPayload,
} from '@/services/materialService';

// -------------------- GET MATERIALS BY MODULE -------------------
export const useMaterialsByModule = (moduleId: string) => {
  return useQuery({
    queryKey: ['materials', moduleId],
    queryFn: () => getMaterialsByModule(moduleId),
    enabled: !!moduleId,
  });
};

// -------------------- GET MATERIAL BY ID -------------------
export const useMaterialById = (materialId: string) => {
  return useQuery({
    queryKey: ['material', materialId],
    queryFn: () => getMaterialById(materialId),
    enabled: !!materialId,
  });
};

// -------------------- CREATE MATERIAL -------------------
export const useCreateMaterial = (moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMaterialPayload) => createMaterial(moduleId, payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['materials', moduleId] });
      const previousMaterials = queryClient.getQueryData<IMaterial[]>(['materials', moduleId]);
      return { previousMaterials };
    },
    onError: (err: unknown, _newMaterial, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to upload material(s)'));
      if (context?.previousMaterials) {
        queryClient.setQueryData(['materials', moduleId], context.previousMaterials);
      }
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success('Material(s) uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['materials', moduleId] });
    },
  });
};

// -------------------- CREATE MATERIAL BY LINK -------------------
export const useCreateMaterialByLink = (moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMaterialByLinkPayload) => createMaterialByLink(moduleId, payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['materials', moduleId] });
      const previousMaterials = queryClient.getQueryData<IMaterial[]>(['materials', moduleId]);
      return { previousMaterials };
    },
    onError: (err: unknown, _newMaterial, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to add link'));

      if (context?.previousMaterials) {
        queryClient.setQueryData(['materials', moduleId], context.previousMaterials);
      }
    },
    onSuccess: () => {
      toast.success('Link added successfully!');
      queryClient.invalidateQueries({ queryKey: ['materials', moduleId] });
    },
  });
};

// -------------------- CREATE MATERIAL BY URL -------------------
export const useCreateMaterialByUrl = (moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMaterialByUrlPayload) => createMaterialByUrl(moduleId, payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['materials', moduleId] });
      const previousMaterials = queryClient.getQueryData<IMaterial[]>(['materials', moduleId]);
      return { previousMaterials };
    },
    onError: (err: unknown, _newMaterial, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to add material'));

      if (context?.previousMaterials) {
        queryClient.setQueryData(['materials', moduleId], context.previousMaterials);
      }
    },
    onSuccess: () => {
      toast.success('Material added successfully!');
      queryClient.invalidateQueries({ queryKey: ['materials', moduleId] });
    },
  });
};

// -------------------- UPDATE MATERIAL -------------------
export const useUpdateMaterial = (moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ materialId, payload }: { materialId: string; payload: UpdateMaterialPayload }) =>
      updateMaterial(materialId, payload),
    onMutate: async ({ materialId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['materials', moduleId] });

      const previousMaterials = queryClient.getQueryData<IMaterial[]>(['materials', moduleId]);

      queryClient.setQueryData<IMaterial[]>(['materials', moduleId], (old) => {
        if (!old) return old;
        return old.map((material) =>
          material._id === materialId
            ? {
                ...material,
                ...payload,
              }
            : material,
        );
      });

      return { previousMaterials };
    },
    onError: (err: unknown, _variables, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to update material'));

      if (context?.previousMaterials) {
        queryClient.setQueryData(['materials', moduleId], context.previousMaterials);
      }
    },
    onSuccess: () => {
      toast.success('Material updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['materials', moduleId] });
    },
  });
};

// -------------------- DELETE MATERIAL -------------------
export const useDeleteMaterial = (moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (materialId: string) => deleteMaterial(moduleId, materialId),
    onMutate: async (materialId: string) => {
      await queryClient.cancelQueries({ queryKey: ['materials', moduleId] });

      const previousMaterials = queryClient.getQueryData<IMaterial[]>(['materials', moduleId]);

      queryClient.setQueryData<IMaterial[]>(['materials', moduleId], (old) => {
        if (!old) return old;
        return old.filter((material) => material._id !== materialId);
      });

      return { previousMaterials };
    },
    onError: (err: unknown, _materialId, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to delete material'));

      if (context?.previousMaterials) {
        queryClient.setQueryData(['materials', moduleId], context.previousMaterials);
      }
    },
    onSuccess: () => {
      toast.success('Material deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['materials', moduleId] });
    },
  });
};
