import { Link, Outlet, useLocation } from 'react-router-dom';
import { MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const travelerLinks = [
  { label: 'Explore', to: '/' },
  { label: 'My Trips', to: '/itinerary' },
  { label: 'Trip DNA', to: '/trip-dna' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-[200] bg-white/85 backdrop-blur-xl border-b border-surface-200/50 shadow-soft">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="h-7 w-7 rounded-md bg-primary-600 flex items-center justify-center">
                <MapPin className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-surface-900">
                itinera
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              {travelerLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === link.to
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-surface-500 hover:text-surface-900 hover:bg-surface-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-surface-500 hidden sm:block">
                {user.name}
              </span>
            )}
            <button
              onClick={logout}
              className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors cursor-pointer"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </nav>
      </header>
      <main className="flex-1 pt-14">
        <Outlet />
      </main>
    </div>
  );
}
