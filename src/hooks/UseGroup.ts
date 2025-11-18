import { getGroupById, getUserGroups } from '@/services/groupService';
import { useQuery } from '@tanstack/react-query';

// -------------------- GET USER GROUPS -------------------
export const useUserGroups = () => {
  return useQuery({
    queryKey: ['my-groups'],
    queryFn: getUserGroups,
  });
};

export const useGroupById = (groupId: string) => {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: () => getGroupById(groupId),
    enabled: !!groupId,
  });
};
