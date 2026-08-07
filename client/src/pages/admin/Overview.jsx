import { useEffect, useState } from 'react';
import { Users, BookOpen, GraduationCap, DollarSign } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import ActivityList from '../../components/dashboard/ActivityList';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/format';

export default function AdminOverview() {
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
        <h1 className="text-2xl font-bold text-slate-900">Admin dashboard</h1>
        <p className="text-slate-500">Welcome, {user.name.split(' ')[0]}. Here's the platform at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total users" value={stats.totalUsers} />
        <StatCard icon={BookOpen} label="Total courses" value={stats.totalCourses} accent="amber" />
        <StatCard icon={GraduationCap} label="Total enrollments" value={stats.totalEnrollments} accent="green" />
        <StatCard icon={DollarSign} label="Platform revenue" value={formatCurrency(stats.totalRevenue)} accent="slate" />
      </div>

      <Card className="p-5">
        <h2 className="mb-3 font-semibold text-slate-900">Recent activity</h2>
        <ActivityList items={recentActivity} />
      </Card>
    </div>
  );
}
