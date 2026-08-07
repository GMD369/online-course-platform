import { Link } from 'react-router-dom';
import { Star, Users, Clock } from 'lucide-react';
import Badge from './ui/Badge';
import { formatCurrency } from '../utils/format';
import { assetUrl } from '../utils/assetUrl';

export default function CourseCard({ course }) {
  const totalDuration = course.lessons?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0;

  return (
    <Link
      to={`/courses/${course._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-video w-full overflow-hidden bg-slate-100">
        {course.thumbnail ? (
          <img
            src={assetUrl(course.thumbnail)}
            alt={course.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 text-brand-500 font-bold text-lg">
            {course.title?.[0]}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <Badge color="brand">{course.category}</Badge>
          <Badge color="slate">{course.level}</Badge>
        </div>
        <h3 className="line-clamp-2 font-semibold text-slate-900">{course.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-500">{course.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {course.enrollmentCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {totalDuration}m
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {course.rating?.toFixed(1) || '—'}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-sm text-slate-500">{course.instructor?.name}</span>
          <span className="font-bold text-brand-700">{formatCurrency(course.price)}</span>
        </div>
      </div>
    </Link>
  );
}
