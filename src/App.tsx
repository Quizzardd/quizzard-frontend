import { ModeToggle } from '@/components/ModeToggle';
import SubscriptionPage from './pages/plans';

const App = () => {
  

  return (
    <>
      <div>
        <ModeToggle />
        <h1 className="text-highlight">Hello Omar</h1>
      </div>
      <SubscriptionPage/>
    </>
  );
};

export default App;
