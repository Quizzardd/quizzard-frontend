import { ModeToggle } from '@/components/ModeToggle';
import AdminLayout from './layouts/AdminLayout';

const App = () => {
  return (
    <div>
      <ModeToggle />
      <h1 className="text-highlight">Hello Omar</h1>  
      <AdminLayout>
        <></>
      </AdminLayout>
    </div>
  );
};

export default App;
