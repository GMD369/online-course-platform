import { useAuth } from '../context/AuthContext';
import StudentOverview from './student/Overview';
import InstructorOverview from './instructor/Overview';
import AdminOverview from './admin/Overview';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'instructor') return <InstructorOverview />;
  if (user?.role === 'admin') return <AdminOverview />;
  return <StudentOverview />;
}
