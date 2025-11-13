import MainLayout from '@/layouts/MainLayout';
import { Route } from 'react-router';
import { ROUTES } from '@/config/routes';
import Home from '@/pages/Home';
import { AuthLayout } from '@/layouts/AuthLayout';
export const routes = (
  <>
    <Route path="/" element={<AuthLayout />} />

    <Route element={<MainLayout />}>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.DASHBOARD} element={<div>Dashboard Page</div>} />
      <Route path={ROUTES.QUIZZES}>
        <Route index element={<div>Quizzes List</div>} />
        <Route path=":quizId" element={<div>Quiz Details</div>} />
      </Route>
      <Route path={ROUTES.PROFILE} element={<div>Profile Page</div>} />
      <Route path={ROUTES.SETTINGS} element={<div>Settings Page</div>} />

      <Route path="*" element={<div>404 Not Found</div>} />
    </Route>
  </>
);
