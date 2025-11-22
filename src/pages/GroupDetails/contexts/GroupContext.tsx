import { createContext, useContext } from 'react';

type GroupRole = 'teacher' | 'student' | null;

interface GroupContextType {
  groupId: string;
  role: GroupRole;
  isTeacher: boolean;
  isStudent: boolean;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroupContext must be used within GroupProvider');
  }
  return context;
};

export const GroupProvider = ({
  children,
  groupId,
  role,
}: {
  children: React.ReactNode;
  groupId: string;
  role: GroupRole;
}) => {
  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';

  return (
    <GroupContext.Provider value={{ groupId, role, isTeacher, isStudent }}>
      {children}
    </GroupContext.Provider>
  );
};
