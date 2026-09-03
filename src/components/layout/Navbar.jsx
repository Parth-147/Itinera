import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin } from 'lucide-react';
import Button from '../ui/Button';

const navLinks = [
  { label: 'Explore', href: '#explore' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Trip DNA', href: '#features' },
  { label: 'Adapt', href: '#features' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNavClick = (e, href) => {
    if (isHome && href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-[200] transition-all duration-300
        ${scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-surface-200/50 shadow-soft'
          : 'bg-transparent'
        }
      `}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="h-7 w-7 rounded-md bg-primary-600 flex items-center justify-center group-hover:bg-primary-700 transition-colors">
            <MapPin className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-surface-900">
            itinera
          </span>
        </Link>

        {/* ── Desktop Links ── */}
        <div className="hidden md:flex items-center gap-1">
          {isHome &&
            navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3.5 py-2 text-sm font-medium text-surface-500 hover:text-surface-900 rounded-lg hover:bg-surface-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
        </div>

        {/* ── Desktop Actions ── */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>

        {/* ── Mobile Toggle ── */}
        <button
          className="md:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100 transition-colors cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-surface-200"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {isHome &&
                navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="px-3 py-2.5 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              <hr className="my-2 border-surface-100" />
              <div className="flex flex-col gap-2 pt-1">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" fullWidth size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" fullWidth size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
