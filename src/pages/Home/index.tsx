import WelcomeUser from './components/WelcomeUser';
import TeachingGroups from './components/TeachingGroups';
import StatusCards from './components/StatusCard';
import StudentGroups from './components/studentGroups';
import JoinGroupSection from './components/JoinGroupSection';

export default function HomePage() {
  return (
    <div className="space-y-8 m-4 p-6">
      
      <WelcomeUser />
      <StatusCards />
      <JoinGroupSection />
      <TeachingGroups />
      <StudentGroups />
    </div>
  );
}
