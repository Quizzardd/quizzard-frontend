import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useGroupById } from '@/hooks/UseGroup';
import GroupLayout from './layout/GroupLayout';

const GroupDetails = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { data: groupData, isLoading, error } = useGroupById(groupId!);

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !groupData?.group) {
    return <div>Error loading group details.</div>;
  }

  const { group, role } = groupData;

  const tabs = [
    {
      value: 'announcements',
      label: 'Announcements',
      path: 'announcements',
    },
    {
      value: 'classwork',
      label: 'Classwork',
      path: 'classwork',
    },
    {
      value: 'people',
      label: 'People',
      path: 'people',
    },
    {
      value: 'grades',
      label: 'Grades',
      path: 'grades',
    },
  ];

  const GroupHeader = () => (
    <div className="w-full h-60 overflow-hidden shadow-md relative">
      <img
        src={group.coverUrl || '/course1.jpg'}
        alt={group.title}
        className="object-cover w-full h-full"
      />

      <div className="absolute bottom-10 left-10 text-white flex items-start gap-4 overlay-shadow p-4 rounded-md bg-black/40">
        <Button variant="secondary" className="mb-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-2 col-auto">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{group.title}</h1>
            {role && (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-white/20 capitalize">
                {role}
              </span>
            )}
          </div>
          <p className="text-lg text-white/90">
            {group.description || 'No description has been added for this group yet.'}
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-white/80">
            {group.ownerName && (
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold">Owner:</span> {group.ownerName}
              </span>
            )}
            {group.inviteCode && (
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold">Invite Code:</span>
                <span className="font-mono tracking-wide">{group.inviteCode}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return <GroupLayout Header={GroupHeader} tabs={tabs} />;
};

export default GroupDetails;
