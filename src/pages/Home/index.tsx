import WelcomeUser from './components/WelcomeUser';
import TeachingGroups from './components/TeachingGroups';
import StatusCards from './components/StatusCard';
import StudentGroups from './components/studentGroups';
import JoinGroupSection from './components/JoinGroupSection';
import { useNavigate } from 'react-router';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 m-4 p-6">
      <button onClick={() => navigate(`/quizzes/691f8bf35dd19b6a0a6264ef/take`)}>Take QUIZ</button>
      <WelcomeUser />
      <StatusCards />
      <JoinGroupSection />
      <TeachingGroups />
      <StudentGroups />
    </div>
  );
}
