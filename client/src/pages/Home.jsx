import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Users, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../api/client';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/ui/Spinner';

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Design',
  'Business',
  'Marketing',
  'Photography',
  'Music',
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/courses', { params: { limit: 8, sort: 'popular' } })
      .then(({ data }) => setCourses(data.data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Skills that drive you forward
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-300">
              Learn web development, data science, design, and more from real practitioners — track your
              progress and grow at your own pace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-sm bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700"
              >
                Explore courses <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-sm border-2 border-white px-6 py-3 text-sm font-bold text-white hover:bg-white hover:text-slate-900"
              >
                Become an instructor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-5 sm:px-6 lg:px-8">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to={`/courses?category=${encodeURIComponent(c)}`}
              className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-900 hover:text-slate-900"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900">Popular courses</h2>
          <Link to="/courses" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            View all →
          </Link>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: BookOpen, title: 'Practical courses', desc: 'Real lessons with hands-on projects.' },
              { icon: Users, title: 'Expert instructors', desc: 'Learn from professionals with years of experience.' },
              { icon: ShieldCheck, title: 'Secure & simple', desc: 'Safe checkout and a smooth learning dashboard.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-sm border border-slate-200 bg-white p-6 text-center">
                <Icon className="mx-auto h-8 w-8 text-brand-600" />
                <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
