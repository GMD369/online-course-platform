import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { assetUrl } from '../utils/assetUrl';

export default function CourseCard({ course }) {
  const rating = course.rating || 0;
  const reviewCount = course.enrollmentCount ? Math.max(course.enrollmentCount * 7, 12) : 0;
  const isBestseller = rating >= 4.6;

  return (
    <Link
      to={`/courses/${course._id}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-slate-200 bg-white transition hover:shadow-xl hover:shadow-slate-200"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        {course.thumbnail ? (
          <img
            src={assetUrl(course.thumbnail)}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 text-brand-500 font-bold text-lg">
            {course.title?.[0]}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 font-bold leading-snug text-slate-900">{course.title}</h3>
        <p className="text-xs text-slate-600">{course.instructor?.name}</p>

        {rating > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-amber-800">{rating.toFixed(1)}</span>
            <span className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.round(rating) ? 'fill-amber-500 text-amber-500' : 'fill-slate-200 text-slate-200'}`}
                />
              ))}
            </span>
            <span className="text-xs text-slate-500">({reviewCount.toLocaleString()})</span>
          </div>
        )}

        <div className="mt-1 flex items-center gap-1">
          <span className="text-base font-extrabold text-slate-900">{formatCurrency(course.price)}</span>
        </div>

        {isBestseller && (
          <span className="mt-1 inline-flex w-fit items-center bg-amber-200 px-1.5 py-0.5 text-[11px] font-bold text-slate-900">
            Bestseller
          </span>
        )}
      </div>
    </Link>
  );
}
