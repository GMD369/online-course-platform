import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

import StudentMyCourses from './pages/student/MyCourses';
import InstructorMyCourses from './pages/instructor/MyCourses';
import CourseEditor from './pages/instructor/CourseEditor';
import AdminUsers from './pages/admin/Users';
import AdminCourses from './pages/admin/Courses';

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />

            <Route element={<ProtectedRoute roles={['student']} />}>
              <Route path="/dashboard/my-courses" element={<StudentMyCourses />} />
            </Route>

            <Route element={<ProtectedRoute roles={['instructor']} />}>
              <Route path="/dashboard/courses" element={<InstructorMyCourses />} />
              <Route path="/dashboard/courses/new" element={<CourseEditor />} />
              <Route path="/dashboard/courses/:id/edit" element={<CourseEditor />} />
            </Route>

            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/dashboard/users" element={<AdminUsers />} />
              <Route path="/dashboard/courses" element={<AdminCourses />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
