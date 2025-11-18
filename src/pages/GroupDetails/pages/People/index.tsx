import InviteButton from './components/InviteButton';
import PeopleSection from './components/PeopleSection';

interface Person {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

const teachers: Person[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  },
];

const students: Person[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@student.edu',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop',
  },
  {
    id: 2,
    name: 'Emma Davis',
    email: 'emma.davis@student.edu',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.chen@student.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah.williams@student.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
  },
];
const People = () => {
  const handleInvite = () => {
    console.log('Invite students clicked');
  };

  return (
    <div>
      {/* <div className="mb-8">
        <InviteButton onClick={handleInvite} />
      </div> */}
      <div className="space-y-8">
        <PeopleSection title="Teachers" count={teachers.length} people={teachers} />
        <PeopleSection title="Students" count={students.length} people={students} />
      </div>
    </div>
  );
};

export default People;
