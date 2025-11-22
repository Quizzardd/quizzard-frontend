import { useParams } from 'react-router';
import { useGroupMembers } from '@/hooks/UseGroup';
import { Loader2 } from 'lucide-react';
import PeopleSection from './components/PeopleSection';

const People = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { data, isLoading, error } = useGroupMembers(groupId!);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Error loading group members. Please try again.
      </div>
    );
  }

  // Separate members by role
  const allMembers = data?.members || [];
  const teachers = allMembers.filter((m) => m.role === 'teacher');
  const students = allMembers.filter((m) => m.role === 'student');

  return (
    <div>
      <div className="space-y-8">
        <PeopleSection
          title="Teachers"
          count={teachers.length}
          people={teachers}
          role="teacher"
          groupId={groupId!}
        />
        <PeopleSection
          title="Students"
          count={students.length}
          people={students}
          role="student"
          groupId={groupId!}
        />
      </div>
    </div>
  );
};

export default People;
