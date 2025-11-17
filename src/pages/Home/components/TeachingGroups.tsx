import GroupCard from './GroupCard';
import { GroupsListSkeleton } from './GroupsSkeleton';
import { useUserGroups } from '@/hooks/UseGroup';

export default function TeachingGroups() {
  const { data, isLoading } = useUserGroups();

  if (isLoading) {
    return <GroupsListSkeleton />;
  }

  const teaching = data?.filter((item: any) => item.role === 'teacher') || [];
  console.log(teaching);
  

  if (teaching.length === 0) {
    return <p className="text-muted-foreground text-sm">You are not teaching any groups yet.</p>;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Teaching Groups</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teaching.map((item: any) => (
          <GroupCard
            key={item._id}
            title={item.group.title}
            owner={item.group.owner}
            coverUrl={item.group.image}
            inviteCode={item.group.inviteCode}
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
