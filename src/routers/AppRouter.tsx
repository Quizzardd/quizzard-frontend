import MainLayout from '@/layouts/MainLayout';
import { Route } from 'react-router';
import { ROUTES } from '@/config/routes';
import Home from '@/pages/Home';
import AdminLayout from '@/layouts/AdminLayout';

import { AdminDashboard } from '@/pages/Admin/AdminDashboard';
import { AdminPlanCard } from '@/pages/Admin/Plans/AdminPlans';
import AdminPlansPage from '@/pages/Admin/Plans/AdminPlansPage';
import AdminTeachers from '@/pages/Admin/Teachers/AdminTeachers';
import AdminStudents from '@/pages/Admin/Students/AdminStudents';
import AdminCourses from '@/pages/Admin/Courses/AdminCourses';
// import { LoginPage } from '@/pages/Login';
export const routes = (
  <>
    {/* <Route path={ROUTES.LOGIN} element={<LoginPage />} /> */}
    <Route path={ROUTES.SIGNUP} element={<div>Signup Page</div>} />
    <Route element={<MainLayout />}>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.QUIZZES}>
        <Route index element={<div>Quizzes List</div>} />
        <Route path=":quizId" element={<div>Quiz Details</div>} />
      </Route>
      <Route path={ROUTES.PROFILE} element={<div>Profile Page</div>} />
      <Route path={ROUTES.SETTINGS} element={<div>Settings Page</div>} />

      <Route path="*" element={<div>404 Not Found</div>} />
    </Route>
    <Route path={ROUTES.ADMIN} element={<AdminLayout/>}>
      <Route index element={<AdminDashboard studentsCount={2} teachersCount={3} coursesCount={3} activeSubscriptions={5} activityData={[
  { date: "2025-11-01", logins: 50, newCourses: 5 },
  { date: "2025-11-02", logins: 75, newCourses: 8 },
  { date: "2025-11-03", logins: 60, newCourses: 3 },
]}/>}/>
      <Route  path={ROUTES.STUDENTS} element={<AdminStudents/>}/>
      <Route  path={ROUTES.TEACHERS} element={<AdminTeachers/>}/>
      <Route  path={ROUTES.COURSES} element={<AdminCourses/>}/>
      <Route  path={ROUTES.PLANS} element={<AdminPlansPage/>}/>
    </Route>
  </>
);
