import { useState } from 'react';
import { Plus } from 'lucide-react';
import GroupCard from './GroupCard';
import { GroupsListSkeleton } from './GroupsSkeleton';
import CreateGroupModal from './CreateGroupModal';
import { useUserGroups } from '@/hooks/UseGroup';
import type { IGroupMember } from '@/types/groups';
import { Button } from '@/components/ui/button';

export default function TeachingGroups() {
  const { data, isLoading } = useUserGroups();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (isLoading) {
    return <GroupsListSkeleton />;
  }

  const teaching = data?.filter((item: IGroupMember) => item.role === 'teacher') || [];
  console.log(teaching);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Teaching Groups</h2>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2 cursor-pointer" size="sm">
          <Plus className="w-4 h-4" />
          Create New Group
        </Button>
      </div>

      {teaching.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-2xl">
          <p className="text-muted-foreground text-sm mb-4">You are not teaching any groups yet.</p>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="outline"
            className="gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Your First Group
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teaching.map((item: IGroupMember) => (
            <GroupCard
              key={item._id}
              title={item.group.title}
              owner={item.group.owner}
              coverUrl={item.group.coverUrl}
              inviteCode={item.group.inviteCode}
              membersCount={item.group.membersCount}
              modulesCount={item.group.modulesCount}
              joinedAt={item.joinedAt}
              role={item.role}
            />
          ))}
        </div>
      )}

      <CreateGroupModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}
