import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { initials } from '../../utils/format';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    toast.success('Logged out successfully');
    setMenuOpen(false);
    navigate('/');
  }

  function handleSearch(e) {
    e.preventDefault();
    navigate(search.trim() ? `/courses?search=${encodeURIComponent(search.trim())}` : '/courses');
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-1.5" aria-label="LearnHub home">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-base font-black italic text-white">
            L
          </span>
          <span className="hidden text-xl font-black italic tracking-tight text-slate-900 sm:inline">
            LearnHub
          </span>
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 max-w-xl md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for anything"
              aria-label="Search for courses"
              className="w-full rounded-full border border-slate-800 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </form>

        <div className="ml-auto hidden items-center gap-5 md:flex">
          <Link to="/courses" className="text-sm font-medium text-slate-800 hover:text-brand-600">
            Explore
          </Link>
          {!user && (
            <Link to="/register" className="text-sm font-medium text-slate-800 hover:text-brand-600">
              Become an instructor
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1 hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {initials(user.name)}
                </span>
                <span className="text-sm font-medium text-slate-700">{user.name.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-sm px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-sm border-2 border-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-900 hover:text-white"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        <button className="ml-auto md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for anything"
                className="w-full rounded-full border border-slate-800 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              />
            </div>
          </form>
          <div className="flex flex-col gap-3">
            <Link to="/courses" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
              Explore
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-left text-sm font-medium text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
                  Log in
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="text-sm font-medium text-brand-700">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
