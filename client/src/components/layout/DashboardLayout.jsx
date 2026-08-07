import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  User as UserIcon,
  GraduationCap,
  PlusCircle,
} from 'lucide-react';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';

const linksByRole = {
  student: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/my-courses', label: 'My Courses', icon: BookOpen },
    { to: '/courses', label: 'Browse Courses', icon: GraduationCap },
  ],
  instructor: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/courses', label: 'My Courses', icon: BookOpen },
    { to: '/dashboard/courses/new', label: 'Create Course', icon: PlusCircle },
  ],
  admin: [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/users', label: 'Users', icon: Users },
    { to: '/dashboard/courses', label: 'Courses', icon: BookOpen },
  ],
};

export default function DashboardLayout() {
  const { user } = useAuth();
  const links = linksByRole[user?.role] || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-20 flex flex-col gap-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <UserIcon className="h-4 w-4" />
              Profile
            </NavLink>
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
