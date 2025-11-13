import { lazy } from 'react';
import { Route } from 'react-router';
import { ROUTES } from '@/config/routes';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Lazy load layouts
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));
const AuthLayout = lazy(() =>
  import('@/layouts/AuthLayout').then((m) => ({ default: m.AuthLayout })),
);

// Lazy load pages
const Dashboard = lazy(() => import('@/pages/DashBoard'));
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

export const routes = (
  <Route>
    {/* Public Route - Auth */}
    <Route path={ROUTES.AUTH} element={<AuthLayout />} />

    {/* Protected Routes - Main App */}
    <Route element={<ProtectedRoute />}>
      <Route path={ROUTES.HOME} element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path={ROUTES.QUIZZES}>
          <Route index element={<div>Quizzes List</div>} />
          <Route path=":quizId" element={<div>Quiz Details</div>} />
        </Route>
        <Route path={ROUTES.SUBSCRIPTION} element={<SubscriptionPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.SETTINGS} element={<div>Settings Page</div>} />
      </Route>
    </Route>

    {/* Protected Routes - Admin Only */}
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

    {/* 404 Route */}
    <Route path="*" element={<div>404 Not Found</div>} />
  </Route>
);
