import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '@/components/ui/button';
import { UserMinus, Loader2 } from 'lucide-react';
import { useRemoveGroupMember } from '@/hooks/UseGroup';
import { useAuth } from '@/hooks/useAuth';
import { useGroupById } from '@/hooks/UseGroup';
import type { IGroupMemberDetailed } from '@/services/groupService';

interface PersonCardProps {
  member: IGroupMemberDetailed;
  role: 'teacher' | 'student';
  groupId: string;
}

function PersonCard({ member, role, groupId }: PersonCardProps) {
  const { user: currentUser } = useAuth();
  const { data: groupData } = useGroupById(groupId);
  const removeMutation = useRemoveGroupMember();

  const name = `${member.user.firstName} ${member.user.lastName}`;
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const avatar =
    member.user.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  // Check if current user is the group owner/teacher and can remove members
  const isOwner = groupData?.group?.owner?._id === currentUser?._id;
  const canRemove = isOwner && role === 'student' && member.user._id !== currentUser?._id;

  const handleRemove = async () => {
    if (confirm(`Are you sure you want to remove ${name} from this group?`)) {
      await removeMutation.mutateAsync({
        groupId,
        userId: member.user._id,
      });
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage className="rounded-full object-cover" src={avatar} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{member.user.email}</p>
        </div>
      </div>
      {canRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={removeMutation.isPending}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {removeMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserMinus className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}
export default PersonCard;
