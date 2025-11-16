import WelcomeUser from './components/WelcomeUser';
import TeachingGroups from './components/TeachingGroups';
import StatusCards from './components/StatusCard';
import StudentGroups from './components/studentGroups';

export default function HomePage() {
  return (
    <div className="space-y-8 p-6">
      <WelcomeUser />
      <StatusCards />
      <TeachingGroups />
      <StudentGroups />
    </div>
  );
}
