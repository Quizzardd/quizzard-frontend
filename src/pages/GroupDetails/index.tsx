import { Button } from '@/components/ui/button';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ClassroomTabs from './components/ClassroomTabs';

interface IGroupDetails {}

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

const GroupDetails: React.FC<IGroupDetails> = ({ props }) => {
  return (
    <div className="bg-background">
      <Header />
      <ClassroomTabs />
    </div>
  );
};

export default GroupDetails;
