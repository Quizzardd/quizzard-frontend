import GroupCard from './GroupCard';
import { GroupsListSkeleton } from './GroupsSkeleton';
import { useUserGroups } from '@/hooks/UseGroup';
import type { IGroupMember } from '@/types/groups';

export default function StudentGroups() {
  const { data, isLoading } = useUserGroups();

  if (isLoading) {
    return <GroupsListSkeleton />;
  }

  const student = data?.filter((item: IGroupMember) => item.role === 'student') || [];

  if (student.length === 0) {
    return <p className="text-muted-foreground text-sm">No enrolled groups yet.</p>;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Enrolled Groups</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {student.map((item: IGroupMember) => (
          <GroupCard
            key={item.group._id}
            groupId={item.group._id}
            title={item.group.title}
            owner={item.group.owner}
            coverUrl={item.group.coverUrl}
            membersCount={item.group.membersCount}
            modulesCount={item.group.modulesCount}
            joinedAt={item.joinedAt}
            role={item.role}
          />
        ))}
      </div>
    </div>
  );
}
