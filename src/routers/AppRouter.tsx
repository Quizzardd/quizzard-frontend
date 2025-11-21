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
const ProfilePage = lazy(() => import('@/pages/Profile'));

// Lazy load admin pages
const AdminDashboard = lazy(() =>
  import('@/pages/Admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })),
);
const AdminPlansPage = lazy(() => import('@/pages/Admin/Plans/AdminPlansPage'));
const AdminTeachers = lazy(() => import('@/pages/Admin/Teachers/AdminTeachers'));
const AdminStudents = lazy(() => import('@/pages/Admin/Students/AdminStudents'));
const AdminCourses = lazy(() => import('@/pages/Admin/Courses/AdminCourses'));
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
          <Route path=":quizId" element={<div>Quiz Details</div>} />
        </Route>
        <Route path={ROUTES.SUBSCRIPTION} element={<SubscriptionPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.SETTINGS} element={<div>Settings Page</div>} />

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
        <Route
          index
          element={
            <AdminDashboard
              studentsCount={2}
              teachersCount={3}
              coursesCount={3}
              activeSubscriptions={5}
              activityData={[
                { date: '2025-11-01', logins: 50, newCourses: 5 },
                { date: '2025-11-02', logins: 75, newCourses: 8 },
                { date: '2025-11-03', logins: 60, newCourses: 3 },
              ]}
            />
          }
        />
        <Route path={ROUTES.STUDENTS} element={<AdminStudents />} />
        <Route path={ROUTES.TEACHERS} element={<AdminTeachers />} />
        <Route path={ROUTES.COURSES} element={<AdminCourses />} />
        <Route path={ROUTES.PLANS} element={<AdminPlansPage />} />
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Route>
);
