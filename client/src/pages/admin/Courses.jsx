import { useEffect, useState, useCallback } from 'react';
import { Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/format';

export default function AdminCourses() {
  const [courses, setCourses] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    const { data } = await api.get('/courses', {
      params: { search: search || undefined, page, limit: 10, status: 'all' },
    });
    setCourses(data.data.courses);
    setPagination(data.data.pagination);
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(course) {
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/courses/${course._id}`);
      toast.success('Course deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">All courses</h1>

      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search courses..."
          className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        />
      </div>

      {!courses ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Instructor</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Students</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((c) => (
                <tr key={c._id}>
                  <td className="max-w-xs px-4 py-3 font-medium text-slate-800">{c.title}</td>
                  <td className="px-4 py-3 text-slate-500">{c.instructor?.name}</td>
                  <td className="px-4 py-3 text-slate-500">{formatCurrency(c.price)}</td>
                  <td className="px-4 py-3 text-slate-500">{c.enrollmentCount}</td>
                  <td className="px-4 py-3">
                    <Badge color={c.published ? 'green' : 'amber'}>{c.published ? 'Published' : 'Draft'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(c)} title="Delete" className="rounded-md p-1.5 text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-lg text-sm font-medium ${
                p === pagination.page ? 'bg-brand-600 text-white' : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
