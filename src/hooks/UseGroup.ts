import { getUserGroups } from "@/services/groupService";
import { useQuery } from "@tanstack/react-query";

// -------------------- GET USER GROUPS -------------------
export const useUserGroups = () => {
  return useQuery({
    queryKey: ['my-groups'],
    queryFn: getUserGroups,
  });
};
