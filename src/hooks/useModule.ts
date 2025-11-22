import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '@/lib/apiError';
import type { IModule } from '@/types/modules';
import {
  createModule,
  deleteModule,
  getModuleById,
  getModulesByGroup,
  updateModule,
  type CreateModulePayload,
  type UpdateModulePayload,
} from '@/services/moduleService';

// -------------------- GET MODULES BY GROUP -------------------
export const useModulesByGroup = (groupId: string) => {
  return useQuery({
    queryKey: ['modules', groupId],
    queryFn: () => getModulesByGroup(groupId),
    enabled: !!groupId,
  });
};

// -------------------- GET MODULE BY ID -------------------
export const useModuleById = (moduleId: string) => {
  return useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => getModuleById(moduleId),
    enabled: !!moduleId,
  });
};

// -------------------- CREATE MODULE -------------------
export const useCreateModule = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateModulePayload) => createModule(groupId, payload),
    onMutate: async (newModule: CreateModulePayload) => {
      await queryClient.cancelQueries({ queryKey: ['modules', groupId] });

      const previousModules = queryClient.getQueryData<IModule[]>(['modules', groupId]);

      queryClient.setQueryData<IModule[]>(['modules', groupId], (old) => {
        const optimisticModule: IModule = {
          _id: `temp-${Date.now()}`,
          title: newModule.title,
          group: groupId,
          createdAt: new Date(),
        };
        return old ? [...old, optimisticModule] : [optimisticModule];
      });

      return { previousModules };
    },
    onError: (err: unknown, _newModule, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to create module'));

      if (context?.previousModules) {
        queryClient.setQueryData(['modules', groupId], context.previousModules);
      }
    },
    onSuccess: () => {
      toast.success('Module created successfully!');
      queryClient.invalidateQueries({ queryKey: ['modules', groupId] });
    },
  });
};

// -------------------- UPDATE MODULE -------------------
export const useUpdateModule = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, payload }: { moduleId: string; payload: UpdateModulePayload }) =>
      updateModule(moduleId, payload),
    onMutate: async ({ moduleId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['modules', groupId] });

      const previousModules = queryClient.getQueryData<IModule[]>(['modules', groupId]);

      queryClient.setQueryData<IModule[]>(['modules', groupId], (old) => {
        if (!old) return old;
        return old.map((module) =>
          module._id === moduleId
            ? {
                ...module,
                ...payload,
              }
            : module,
        );
      });

      return { previousModules };
    },
    onError: (err: unknown, _variables, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to update module'));

      if (context?.previousModules) {
        queryClient.setQueryData(['modules', groupId], context.previousModules);
      }
    },
    onSuccess: () => {
      toast.success('Module updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['modules', groupId] });
    },
  });
};

// -------------------- DELETE MODULE -------------------
export const useDeleteModule = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteModule,
    onMutate: async (moduleId: string) => {
      await queryClient.cancelQueries({ queryKey: ['modules', groupId] });

      const previousModules = queryClient.getQueryData<IModule[]>(['modules', groupId]);

      queryClient.setQueryData<IModule[]>(['modules', groupId], (old) => {
        if (!old) return old;
        return old.filter((module) => module._id !== moduleId);
      });

      return { previousModules };
    },
    onError: (err: unknown, _moduleId, context) => {
      toast.error(getApiErrorMessage(err, 'Failed to delete module'));

      if (context?.previousModules) {
        queryClient.setQueryData(['modules', groupId], context.previousModules);
      }
    },
    onSuccess: () => {
      toast.success('Module deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['modules', groupId] });
    },
  });
};
