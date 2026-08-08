import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Users, Clock, PlayCircle, CheckCircle2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EnrollModal from '../components/EnrollModal';
import { formatCurrency, initials } from '../utils/format';
import { assetUrl } from '../utils/assetUrl';

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data.data.course);
      setEnrolled(data.data.enrolled);
    } catch {
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleEnrollClick() {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }
    if (user.role !== 'student') {
      toast.error('Only student accounts can enroll in courses.');
      return;
    }
    setShowModal(true);
  }

  if (loading) return <Spinner className="h-10 w-10" />;
  if (!course) {
    return <div className="py-20 text-center text-slate-500">Course not found.</div>;
  }

  const totalDuration = course.lessons?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0;

  return (
    <div className="bg-white">
      <div className="bg-slate-950">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <Badge color="brand">{course.category}</Badge>
              <Badge color="slate">{course.level}</Badge>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold text-white">{course.title}</h1>
            <p className="mt-3 text-lg text-slate-300">{course.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-1 font-bold text-amber-400">
                {course.rating?.toFixed(1) || 'New'}
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {course.enrollmentCount} students
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {totalDuration} minutes total
              </span>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {initials(course.instructor?.name)}
              </span>
              <div>
                <p className="text-sm font-medium text-white">
                  Created by <span className="text-brand-400 underline">{course.instructor?.name}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-slate-800 bg-white p-5 shadow-2xl">
            <div className="aspect-video overflow-hidden rounded-sm bg-slate-100">
              {course.thumbnail ? (
                <img src={assetUrl(course.thumbnail)} alt={course.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 text-2xl font-bold text-brand-500">
                  {course.title?.[0]}
                </div>
              )}
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">{formatCurrency(course.price)}</p>
            {enrolled ? (
              <Button className="mt-4 w-full" variant="secondary" disabled>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Already enrolled
              </Button>
            ) : (
              <Button className="mt-4 w-full" variant="dark" size="lg" onClick={handleEnrollClick}>
                Enroll now
              </Button>
            )}
            <p className="mt-3 text-center text-xs text-slate-400">
              {course.lessons?.length || 0} lessons · Full lifetime access
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:w-2/3">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Course content</h2>
          <div className="divide-y divide-slate-200 overflow-hidden rounded-sm border border-slate-200 bg-white">
            {course.lessons?.length ? (
              course.lessons.map((lesson, i) => (
                <div key={lesson._id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    {enrolled ? (
                      <PlayCircle className="h-5 w-5 text-brand-600" />
                    ) : (
                      <Lock className="h-5 w-5 text-slate-300" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {i + 1}. {lesson.title}
                      </p>
                      {enrolled && lesson.content && <p className="mt-0.5 text-xs text-slate-500">{lesson.content}</p>}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{lesson.duration || 0}m</span>
                </div>
              ))
            ) : (
              <p className="px-5 py-6 text-sm text-slate-500">No lessons have been added to this course yet.</p>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <EnrollModal
          course={course}
          onClose={() => setShowModal(false)}
          onEnrolled={() => {
            setShowModal(false);
            load();
          }}
        />
      )}
    </div>
  );
}
