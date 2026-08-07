import { useEffect, useState } from 'react';
import { BookOpen, Users, DollarSign, CheckCircle2 } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import ActivityList from '../../components/dashboard/ActivityList';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/format';

export default function InstructorOverview() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => setData(data.data));
  }, []);

  if (!data) return <Spinner className="h-10 w-10" />;

  const { stats, recentActivity } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-slate-500">Track how your courses are performing.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Total courses" value={stats.totalCourses} />
        <StatCard icon={CheckCircle2} label="Published" value={stats.publishedCourses} accent="green" />
        <StatCard icon={Users} label="Total students" value={stats.totalStudents} accent="amber" />
        <StatCard icon={DollarSign} label="Total revenue" value={formatCurrency(stats.totalRevenue)} accent="slate" />
      </div>

      <Card className="p-5">
        <h2 className="mb-3 font-semibold text-slate-900">Recent enrollments</h2>
        <ActivityList items={recentActivity} />
      </Card>
    </div>
  );
}
