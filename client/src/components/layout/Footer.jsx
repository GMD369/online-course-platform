import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const COLUMNS = [
  {
    title: 'LearnHub',
    links: [
      { label: 'About us', to: '/' },
      { label: 'Careers', to: '/' },
      { label: 'Contact us', to: '/' },
      { label: 'Blog', to: '/' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'Explore courses', to: '/courses' },
      { label: 'Web Development', to: '/courses?category=Web+Development' },
      { label: 'Data Science', to: '/courses?category=Data+Science' },
      { label: 'Design', to: '/courses?category=Design' },
    ],
  },
  {
    title: 'LearnHub for Business',
    links: [
      { label: 'Teach on LearnHub', to: '/register' },
      { label: 'Become an instructor', to: '/register' },
      { label: 'Instructor resources', to: '/' },
    ],
  },
  {
    title: 'Legal & accessibility',
    links: [
      { label: 'Terms', to: '/' },
      { label: 'Privacy policy', to: '/' },
      { label: 'Cookie settings', to: '/' },
      { label: 'Accessibility statement', to: '/' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold text-white">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-slate-400 hover:text-white hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 sm:flex-row">
          <Link to="/" className="flex items-center gap-2 text-base font-black italic text-white">
            <GraduationCap className="h-5 w-5" /> LearnHub
          </Link>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} LearnHub, Inc. Built as an educational full-stack demo project.
          </p>
        </div>
      </div>
    </footer>
  );
}
