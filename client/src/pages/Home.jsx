import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GraduationCap, Users, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../api/client';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/ui/Spinner';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/courses', { params: { limit: 3, sort: 'popular' } })
      .then(({ data }) => setCourses(data.data.courses))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            <GraduationCap className="h-3.5 w-3.5" /> Learn something new every day
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Grow your skills with courses taught by real practitioners
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Browse hands-on courses in web development, data science, design, and more — track your
            progress and learn at your own pace.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
            >
              Browse courses <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Become an instructor
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: BookOpen, title: 'Practical courses', desc: 'Real lessons with hands-on lessons and projects.' },
            { icon: Users, title: 'Expert instructors', desc: 'Learn from professionals with years of experience.' },
            { icon: ShieldCheck, title: 'Secure & simple', desc: 'Safe checkout and a smooth learning dashboard.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <Icon className="mx-auto h-8 w-8 text-brand-600" />
              <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Popular courses</h2>
          <Link to="/courses" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            View all →
          </Link>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
