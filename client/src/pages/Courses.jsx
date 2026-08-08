import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import api from '../api/client';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/ui/Spinner';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Design',
  'Business',
  'Marketing',
  'Photography',
  'Music',
  'Other',
];

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const category = searchParams.get('category') || '';
  const level = searchParams.get('level') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page') || 1);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/courses', {
        params: {
          search: searchParams.get('search') || undefined,
          category: category || undefined,
          level: level || undefined,
          sort,
          page,
          limit: 9,
        },
      });
      setCourses(data.data.courses);
      setPagination(data.data.pagination);
    } finally {
      setLoading(false);
    }
  }, [searchParams, category, level, sort, page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    updateParam('search', search);
  }

  function goToPage(p) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Explore courses</h1>
        <p className="mt-1 text-slate-500">Find the right course to grow your skills.</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 rounded-sm border border-slate-200 bg-white p-4 md:flex-row md:items-end">
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
        </form>

        <Select label="Category" value={category} onChange={(e) => updateParam('category', e.target.value)} className="md:w-48">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <Select label="Level" value={level} onChange={(e) => updateParam('level', e.target.value)} className="md:w-40">
          <option value="">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </Select>

        <Select label="Sort by" value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="md:w-44">
          <option value="newest">Newest</option>
          <option value="popular">Most popular</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </Select>
      </div>

      {loading ? (
        <Spinner />
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-20 text-center">
          <SlidersHorizontal className="h-8 w-8 text-slate-300" />
          <p className="font-medium text-slate-600">No courses match your filters</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`h-9 w-9 rounded-sm text-sm font-medium ${
                    p === pagination.page
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
