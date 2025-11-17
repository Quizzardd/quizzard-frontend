import GroupCard from './GroupCard';
import  { GroupsListSkeleton } from './GroupsSkeleton';
import { useUserGroups } from '@/hooks/UseGroup';

export default function StudentGroups() {
  const { data, isLoading } = useUserGroups();

  if (isLoading) {
      return <GroupsListSkeleton />;
}

    //const student = data?.filter((item: any) => item.role === 'student') || [];
    const student = [
      {
        group: {
          title: 'JavaScript Bootcamp',
          owner: 'Sara',
          image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
          url: '/g/js-bootcamp',
          membersCount: 40,
          modulesCount: 18,
        },
        role: 'student',
        joinedAt: '2025-01-12T10:00:00Z',
      },
      {
        group: {
          title: 'Beginner Python',
          owner: 'Laila',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
          url: '/g/python-beginner',
          membersCount: 60,
          modulesCount: 14,
        },
        role: 'student',
        joinedAt: '2025-03-02T10:00:00Z',
      },
    ];

  if (student.length === 0) {
    return <p className="text-muted-foreground text-sm">No enrolled groups yet.</p>;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Enrolled Groups</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {student.map((item: any) => (
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
