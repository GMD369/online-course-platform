import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import ActivityList from '../../components/dashboard/ActivityList';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/format';

export default function StudentOverview() {
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
        <p className="text-slate-500">Here's an overview of your learning progress.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Enrolled courses" value={stats.totalEnrollments} />
        <StatCard icon={Clock} label="In progress" value={stats.inProgress} accent="amber" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} accent="green" />
        <StatCard icon={DollarSign} label="Total spent" value={formatCurrency(stats.totalSpent)} accent="slate" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent activity</h2>
          </div>
          <ActivityList items={recentActivity} />
        </Card>
        <Card className="flex flex-col items-start justify-center gap-3 p-5">
          <h2 className="font-semibold text-slate-900">Keep learning</h2>
          <p className="text-sm text-slate-500">Discover new courses to continue building your skills.</p>
          <Link to="/courses" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            Browse courses →
          </Link>
        </Card>
      </div>
    </div>
  );
}
