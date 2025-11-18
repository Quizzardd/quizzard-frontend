import { Button } from '@/components/ui/button';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router';
import { useGroupById } from '@/hooks/UseGroup';
import GroupLayout from './layout/GroupLayout';

const Header = () => {
  return (
    <div className="w-full h-60 overflow-hidden shadow-md relative">
      <img src="/course1.jpg" className="object-cover w-full h-full" />

      <div className="absolute bottom-10 left-10 text-white flex items-center gap-4 overlay-shadow p-4 rounded-md bg-black/30">
        <Button variant="secondary" className="mb-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-2 col-auto">
          <h1 className="text-2xl font-bold">Group Name</h1>
          <p className="text-lg">This is a brief description of the group.</p>
        </div>
      </div>
    </div>
  );
};

const GroupDetails = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { data: group, isLoading, error } = useGroupById(groupId!);

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading group details.</div>;
  }
  console.log('Group Details:', group);

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

  return <GroupLayout Header={Header} tabs={tabs} />;
};

export default GroupDetails;
