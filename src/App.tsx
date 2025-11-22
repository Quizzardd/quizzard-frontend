import { Routes } from 'react-router';
import { routes } from '@/routers/AppRouter';
import ScrollToTop from './components/ScrollToTop';
const App = () => {
  return (
    <>
      <ScrollToTop></ScrollToTop>
      <Routes>{routes}</Routes>
    </>
  );
};

export default App;
