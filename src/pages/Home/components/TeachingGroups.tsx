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
  // const teaching = [
  //   {
  //     group: {
  //       title: 'React Masterclass',
  //       owner: 'Omar',
  //       image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61',
  //       url: '/g/react-masterclass',
  //       membersCount: 23,
  //       modulesCount: 12,
  //     },
  //     role: 'teacher',
  //     joinedAt: '2025-01-01T10:00:00Z',
  //   },
  //   {
  //     group: {
  //       title: 'AI Fundamentals',
  //       owner: 'Michael',
  //       image: 'https://images.unsplash.com/photo-1542831371-d531d36971e6',
  //       url: '/g/ai-fundamentals',
  //       membersCount: 15,
  //       modulesCount: 9,
  //     },
  //     role: 'teacher',
  //     joinedAt: '2025-02-03T10:00:00Z',
  //   },
  // ];

  if (teaching.length === 0) {
    return <p className="text-muted-foreground text-sm">You are not teaching any groups yet.</p>;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Teaching Groups</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teaching.map((item: any) => (
          <GroupCard
            key={item.group.url}
            title={item.group.title}
            owner={item.group.owner}
            coverUrl={item.group.image}
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
