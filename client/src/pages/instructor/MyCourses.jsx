import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle, Eye, EyeOff, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/format';

export default function InstructorMyCourses() {
  const [courses, setCourses] = useState(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    const { data } = await api.get('/courses', { params: { mine: 'true', limit: 50, search: search || undefined } });
    setCourses(data.data.courses);
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  async function togglePublish(course) {
    try {
      await api.patch(`/courses/${course._id}`, { published: !course.published });
      toast.success(course.published ? 'Course unpublished' : 'Course published');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update course');
    }
  }

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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My courses</h1>
        <Link to="/dashboard/courses/new">
          <Button>
            <PlusCircle className="h-4 w-4" /> New course
          </Button>
        </Link>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search my courses..."
          className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        />
      </div>

      {!courses ? (
        <Spinner />
      ) : courses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
          No courses yet. Create your first course to get started.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Category</th>
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
                  <td className="px-4 py-3 text-slate-500">{c.category}</td>
                  <td className="px-4 py-3 text-slate-500">{formatCurrency(c.price)}</td>
                  <td className="px-4 py-3 text-slate-500">{c.enrollmentCount}</td>
                  <td className="px-4 py-3">
                    <Badge color={c.published ? 'green' : 'amber'}>{c.published ? 'Published' : 'Draft'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => togglePublish(c)}
                        title={c.published ? 'Unpublish' : 'Publish'}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                      >
                        {c.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <Link
                        to={`/dashboard/courses/${c._id}/edit`}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(c)}
                        title="Delete"
                        className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
