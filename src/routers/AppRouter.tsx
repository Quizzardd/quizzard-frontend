import { lazy } from 'react';
import { Route } from 'react-router';
import { ROUTES } from '@/config/routes';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import HomePage from '@/pages/Home';
import { HomeRoute } from './HomeRoute';
import { AuthRoute } from './AuthRoute';
import Announcements from '@/pages/GroupDetails/pages/Announcements';
import Classwork from '@/pages/GroupDetails/pages/Classwrok';
import People from '@/pages/GroupDetails/pages/People';

// Lazy load layouts
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));

// Lazy load pages
const SubscriptionPage = lazy(() => import('@/pages/Subscriptions'));
const SubscriptionSuccess = lazy(() => import('@/pages/Subscriptions/SubscriptionSuccess'));
const SubscriptionFail = lazy(() => import('@/pages/Subscriptions/SubscriptionFail'));
const ProfilePage = lazy(() => import('@/pages/Profile'));
const QuizTakingPage = lazy(() => import('@/pages/StudentQuiz/QuizTakingPage'));
const CreateQuizPage = lazy(() => import('@/pages/GroupDetails/pages/CreateQuiz'));

// Lazy load admin pages
const AdminDashboard = lazy(() =>
  import('@/pages/Admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })),
);
const AdminPlansPage = lazy(() => import('@/pages/Admin/Plans/AdminPlansPage'));
const AdminUsers = lazy(() => import('@/pages/Admin/Students/AdminStudents'));
const AdminGroups = lazy(() => import('@/pages/Admin/Courses/AdminCourses'));
const GroupDetails = lazy(() => import('@/pages/GroupDetails'));

const NotFound = lazy(() => import('@/pages/NotFound'));

export const routes = (
  <Route>
    <Route path="/" element={<HomeRoute />} />

    <Route path={ROUTES.AUTH} element={<AuthRoute />} />

    <Route element={<ProtectedRoute />}>
      <Route path={ROUTES.HOME} element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path={ROUTES.QUIZZES}>
          <Route index element={<div>Quizzes List</div>} />
          <Route path=":quizId/take" element={<QuizTakingPage />} />
        </Route>
        <Route path={ROUTES.SUBSCRIPTION} element={<SubscriptionPage />} />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
        <Route path="/subscription/fail" element={<SubscriptionFail />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.SETTINGS} element={<div>Settings Page</div>} />

        <Route path="/groups/:groupId/create-quiz" element={<CreateQuizPage />} />

        <Route path="/groups/:groupId" element={<GroupDetails />}>
          <Route index element={<Announcements />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="classwork" element={<Classwork />} />
          <Route path="people" element={<People />} />
          <Route path="grades" element={<div>Grades content…</div>} />
        </Route>
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
      <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="groups" element={<AdminGroups />} />
        <Route path={ROUTES.PLANS} element={<AdminPlansPage />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Route>
);
