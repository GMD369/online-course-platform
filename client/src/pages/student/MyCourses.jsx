import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import Spinner from '../../components/ui/Spinner';
import { assetUrl } from '../../utils/assetUrl';
import { formatCurrency } from '../../utils/format';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState(null);

  useEffect(() => {
    api.get('/enrollments/me').then(({ data }) => setEnrollments(data.data.enrollments));
  }, []);

  if (!enrollments) return <Spinner className="h-10 w-10" />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">My courses</h1>

      {enrollments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <p className="text-slate-500">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="mt-2 inline-block text-sm font-semibold text-brand-700">
            Browse courses →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((e) => (
            <Link
              key={e._id}
              to={`/courses/${e.course?._id}`}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-video bg-slate-100">
                {e.course?.thumbnail ? (
                  <img src={assetUrl(e.course.thumbnail)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 font-bold text-brand-500">
                    {e.course?.title?.[0]}
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="line-clamp-2 font-semibold text-slate-900">{e.course?.title}</p>
                <p className="mt-1 text-xs text-slate-500">by {e.course?.instructor?.name}</p>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>{e.progress}% complete</span>
                    <span>{formatCurrency(e.amountPaid)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${e.progress}%` }} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
