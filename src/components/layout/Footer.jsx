import { Link, useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const footerLinks = [
  { label: 'Explore', href: '#explore' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Trip DNA', href: '#features' },
  { label: 'Adapt', href: '#features' },
  { label: 'Contact', href: '#' },
];

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleClick = (e, href) => {
    if (isHome && href.startsWith('#') && href !== '#') {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-surface-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          {/* ── Brand ── */}
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-md bg-primary-600 flex items-center justify-center">
                <MapPin className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                itinera
              </span>
            </Link>
            <p className="text-sm text-surface-400 leading-relaxed">
              Personalized travel that adapts.
            </p>
          </div>

          {/* ── Links ── */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm text-surface-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* ── Bottom ── */}
        <div className="mt-12 pt-8 border-t border-surface-800">
          <p className="text-xs text-surface-500">
            © {new Date().getFullYear()} Itinera
          </p>
        </div>
      </div>
    </footer>
  );
}
