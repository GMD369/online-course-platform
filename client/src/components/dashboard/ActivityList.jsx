import { Activity } from 'lucide-react';
import { timeAgo } from '../../utils/format';

function describeActivity(item) {
  switch (item.type) {
    case 'enrollment':
      return `Progress on "${item.courseTitle}" — ${item.progress}% complete`;
    case 'new_enrollment':
      return `${item.studentName} enrolled in "${item.courseTitle}"`;
    case 'new_user':
      return `${item.name} joined as ${item.role}`;
    default:
      return 'Activity';
  }
}

export default function ActivityList({ items = [] }) {
  if (!items.length) {
    return <p className="py-8 text-center text-sm text-slate-400">No recent activity yet.</p>;
  }
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 py-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Activity className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-sm text-slate-700">{describeActivity(item)}</p>
            <p className="text-xs text-slate-400">{timeAgo(item.date)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
