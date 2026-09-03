import { useState, useEffect, useRef, useMemo } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Compass, Zap, Building2, BarChart3, Settings, LogOut, Bell,
  CheckCircle2, AlertTriangle, Menu, X, ShieldCheck, ChevronDown, Search,
  User, Activity, MapPin, Cog,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOperator } from '../../context/OperatorContext';

/* ── Toast Container ── */
function ToastContainer() {
  const { toasts, removeToast } = useOperator();
  const icons = { success: CheckCircle2, error: AlertTriangle, warning: AlertTriangle, info: Activity };
  const colors = {
    success: 'border-emerald-500/30 bg-emerald-500/[0.08]',
    error: 'border-red-500/30 bg-red-500/[0.08]',
    warning: 'border-amber-500/30 bg-amber-500/[0.08]',
    info: 'border-blue-500/30 bg-blue-500/[0.08]',
  };
  const textColors = { success: 'text-emerald-400', error: 'text-red-400', warning: 'text-amber-400', info: 'text-blue-400' };

  return (
    <div className="fixed bottom-6 right-6 z-[999] space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type] || CheckCircle2;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${colors[t.type] || colors.success}`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${textColors[t.type] || textColors.success}`} />
              <span className="text-[13px] font-medium text-white flex-1">{t.message}</span>
              <button onClick={() => removeToast(t.id)} className="text-slate-500 hover:text-white ml-2 cursor-pointer"><X className="h-3.5 w-3.5" /></button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ── Command Palette ── */
function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { trips, vendors } = useOperator();

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const tripResults = trips
      .filter((t) => t.travelerName.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q))
      .map((t) => ({ id: t.id, label: `${t.travelerName} — ${t.destination}`, sub: `${t.status} • ${t.dates}`, type: 'trip', icon: MapPin }));
    const vendorResults = vendors
      .filter((v) => v.name.toLowerCase().includes(q) || v.type.toLowerCase().includes(q))
      .map((v) => ({ id: v.id, label: v.name, sub: `${v.type} • ${v.location}`, type: 'vendor', icon: Building2 }));
    const pageResults = [
      { id: 'nav-dashboard', label: 'Go to Dashboard', sub: 'Operator Dashboard', type: 'page', icon: LayoutDashboard, path: '/operator/dashboard' },
      { id: 'nav-adapt', label: 'Disruption Simulator', sub: 'Adapt Engine', type: 'page', icon: Zap, path: '/operator/adapt' },
      { id: 'nav-vendors', label: 'Vendor Management', sub: 'View all vendors', type: 'page', icon: Building2, path: '/operator/vendors' },
    ].filter((p) => p.label.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q));
    return [...tripResults.slice(0, 4), ...vendorResults.slice(0, 3), ...pageResults];
  }, [query, trips, vendors]);

  const handleSelect = (result) => {
    if (result.type === 'trip') navigate(`/operator/trips/${result.id}`);
    else if (result.type === 'vendor') navigate('/operator/vendors');
    else if (result.path) navigate(result.path);
    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[900] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="relative w-full max-w-lg bg-[#131d30] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <Search className="h-5 w-5 text-slate-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trips, travelers, vendors..."
            className="flex-1 bg-transparent text-[15px] text-white placeholder:text-slate-600 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.06] text-[10px] text-slate-500 font-mono">ESC</kbd>
        </div>
        {query.trim() && (
          <div className="max-h-72 overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="py-8 text-center text-slate-600 text-[13px]">No results found for "{query}"</div>
            ) : (
              results.map((r) => {
                const Icon = r.icon;
                return (
                  <button key={r.id} onClick={() => handleSelect(r)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/[0.04] transition-colors cursor-pointer group">
                    <div className="h-8 w-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 group-hover:bg-primary-500/[0.1]">
                      <Icon className="h-4 w-4 text-slate-500 group-hover:text-primary-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-white truncate">{r.label}</p>
                      <p className="text-[11px] text-slate-600 truncate">{r.sub}</p>
                    </div>
                    <span className="text-[10px] text-slate-600 uppercase tracking-wider">{r.type}</span>
                  </button>
                );
              })
            )}
          </div>
        )}
        {!query.trim() && (
          <div className="p-4 text-center text-slate-600 text-[13px]">
            <p>Start typing to search across trips, travelers, and vendors</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ── Main Layout ── */
export default function OperatorLayout() {
  const { user, logout } = useAuth();
  const { stats, systemAlert, clearAlert, lastSync, notifications, unreadNotifications, markNotificationRead, markAllNotificationsRead } = useOperator();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Ctrl+K handler
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setShowCommandPalette(true); }
      if (e.key === 'Escape') { setShowCommandPalette(false); setShowNotifications(false); setShowProfile(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (showNotifications && !e.target.closest('#notification-panel')) setShowNotifications(false);
      if (showProfile && !e.target.closest('#profile-panel')) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showNotifications, showProfile]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { label: 'Dashboard', to: '/operator/dashboard', icon: LayoutDashboard, aliases: ['/operator', '/operator/dashboard'] },
    { label: 'Trips', to: '/operator/trips', icon: Compass, aliases: ['/operator/trips'] },
    { label: 'Disruptions / Adapt', to: '/operator/adapt', icon: Zap, badge: stats.atRisk > 0 ? stats.atRisk : null, badgeColor: 'bg-amber-500 text-white', aliases: ['/operator/adapt'] },
    { label: 'Vendors', to: '/operator/vendors', icon: Building2, aliases: ['/operator/vendors'] },
    { label: 'Reports', to: '/operator/dashboard', icon: BarChart3, aliases: [] },
    { label: 'Settings', to: '/operator/dashboard', icon: Settings, aliases: [] },
  ];

  const isItemActive = (item) => item.aliases?.some((a) => location.pathname === a || location.pathname.startsWith(`${a}/`));
  const categoryIcons = { critical: '🔴', warning: '🟠', info: '🔵' };

  return (
    <div className="min-h-screen bg-[#070d1b] flex">
      {/* ── Sidebar (Desktop) ── */}
      <aside className="hidden lg:flex w-[260px] shrink-0 bg-[#0b1628] flex-col justify-between border-r border-white/[0.06] fixed top-0 bottom-0 z-40 text-white select-none">
        <div>
          <div className="h-[72px] px-6 flex items-center gap-3.5 border-b border-white/[0.06]">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[17px] font-bold tracking-tight text-white block leading-none">ITINERA</span>
              <span className="text-[10px] uppercase font-semibold text-primary-400/80 tracking-[0.15em] mt-0.5 block">OPS CONTROL CENTER</span>
            </div>
          </div>
          <nav className="px-3 space-y-1 mt-5">
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">Navigation</p>
            {navItems.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;
              return (
                <NavLink key={item.label} to={item.to} className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${active ? 'bg-gradient-to-r from-primary-600/90 to-primary-700/70 text-white shadow-lg shadow-primary-600/20' : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'}`}>
                  <div className="flex items-center gap-3">
                    <Icon className={`h-[18px] w-[18px] ${active ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge != null && (
                    <span className={`text-[10px] min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full font-bold ${active ? 'bg-white/20 text-white' : item.badgeColor} ${!active ? 'animate-pulse' : ''}`}>{item.badge}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="p-3 border-t border-white/[0.06]">
          <div className="px-3 py-3 rounded-xl bg-white/[0.04] mb-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white ring-2 ring-primary-500/20">AT</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'Ananya Tours'}</p>
                <p className="text-[11px] text-slate-500 truncate">Operator • Level 2</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-200 cursor-pointer">
            <LogOut className="h-4 w-4" /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar ── */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="relative w-72 bg-[#0b1628] flex flex-col justify-between text-white z-10 shadow-2xl">
              <div>
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white"><Compass className="h-5 w-5" /></div>
                    <div><span className="text-[17px] font-bold text-white leading-none block">ITINERA</span><span className="text-[10px] text-primary-400 uppercase tracking-[0.15em]">OPS CENTER</span></div>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"><X className="h-5 w-5" /></button>
                </div>
                <nav className="px-3 space-y-1 mt-4">
                  {navItems.map((item) => {
                    const active = isItemActive(item);
                    const Icon = item.icon;
                    return (
                      <NavLink key={item.label} to={item.to} onClick={() => setMobileOpen(false)} className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${active ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white' : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'}`}>
                        <div className="flex items-center gap-3"><Icon className={`h-[18px] w-[18px] ${active ? 'text-white' : 'text-slate-500'}`} /><span>{item.label}</span></div>
                        {item.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">{item.badge}</span>}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
              <div className="p-3 border-t border-white/[0.06]">
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-slate-500 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"><LogOut className="h-4 w-4" /><span>Logout</span></button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col lg:pl-[260px] min-w-0">
        {/* Header */}
        <header className="h-[72px] bg-[#0d1829]/95 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-30 px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/[0.06] cursor-pointer" aria-label="Open mobile menu"><Menu className="h-5 w-5" /></button>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">Itinera Operations</h1>
              <p className="text-[12px] text-slate-500 mt-1 hidden sm:block">Monitor trips, bookings and disruptions in real time.</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Live Operations */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.06] border border-emerald-500/15 text-[11px] font-medium text-emerald-400">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-emerald-400"></span></span>
              <span>LIVE</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500">{lastSync}</span>
            </div>

            {/* Search trigger */}
            <button onClick={() => setShowCommandPalette(true)} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/[0.1] transition-all cursor-pointer text-[12px]">
              <Search className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Search...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-slate-600">⌘K</kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative" id="notification-panel">
              <button onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer" aria-label="Notifications">
                <Bell className="h-[18px] w-[18px]" />
                {unreadNotifications > 0 && <span className="absolute top-1 right-1 h-[18px] min-w-[18px] px-1 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-[#0d1829] animate-pulse">{unreadNotifications}</span>}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} className="absolute right-0 mt-2 w-96 bg-[#131d30] rounded-2xl shadow-2xl border border-white/[0.08] overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                      <span className="text-[14px] font-bold text-white">Notifications</span>
                      <button onClick={markAllNotificationsRead} className="text-[11px] text-primary-400 hover:text-primary-300 font-medium cursor-pointer">Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
                      {notifications.slice(0, 6).map((n) => (
                        <button key={n.id} onClick={() => { markNotificationRead(n.id); if (n.tripId) navigate(`/operator/trips/${n.tripId}`); setShowNotifications(false); }} className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/[0.03] transition-colors cursor-pointer ${!n.read ? 'bg-white/[0.02]' : ''}`}>
                          <span className="text-sm mt-0.5">{categoryIcons[n.category] || '🔵'}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[13px] font-medium ${!n.read ? 'text-white' : 'text-slate-400'}`}>{n.title}</p>
                            <p className="text-[11px] text-slate-600 mt-0.5">{n.description}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-slate-600">{n.timeAgo}</span>
                            {!n.read && <span className="h-2 w-2 rounded-full bg-primary-500"></span>}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-white/[0.06]">
                      <button onClick={() => { setShowNotifications(false); navigate('/operator/adapt'); }} className="w-full py-2 text-center text-[12px] font-medium text-primary-400 hover:text-primary-300 hover:bg-primary-500/[0.08] rounded-xl transition-all cursor-pointer">View All Notifications</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-white/[0.06]"></div>

            {/* Profile */}
            <div className="relative" id="profile-panel">
              <button onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-[12px] font-bold ring-2 ring-primary-500/20">AT</div>
                <div className="hidden sm:block text-left">
                  <p className="text-[13px] font-semibold text-white leading-tight">{user?.name || 'Ananya Tours'}</p>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-400" /> Verified Operator</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500 hidden sm:block" />
              </button>
              <AnimatePresence>
                {showProfile && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} className="absolute right-0 mt-3 w-64 bg-[#131d30] rounded-2xl shadow-2xl border border-white/[0.08] overflow-hidden z-50">
                    <div className="px-4 py-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-sm font-bold text-white">AT</div>
                        <div>
                          <p className="text-[14px] font-bold text-white">{user?.name || 'Ananya Tours'}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-400" /> Verified Operator</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/15">
                        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                        <span className="text-[11px] font-medium text-emerald-400">Status: Operational</span>
                      </div>
                    </div>
                    <div className="py-2">
                      {[
                        { label: 'Profile', icon: User },
                        { label: 'Account Settings', icon: Cog },
                      ].map((item) => (
                        <button key={item.label} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer">
                          <item.icon className="h-4 w-4 text-slate-500" /><span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-white/[0.06] py-2">
                      <button onClick={() => { setShowProfile(false); handleLogout(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-400 hover:bg-red-500/[0.08] transition-colors cursor-pointer">
                        <LogOut className="h-4 w-4" /><span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* System Alert */}
        <AnimatePresence>
          {systemAlert && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className={`px-6 py-3 text-[12px] font-medium flex items-center justify-between border-b ${systemAlert.type === 'danger' ? 'bg-red-500/[0.08] text-red-300 border-red-500/20' : 'bg-emerald-500/[0.08] text-emerald-300 border-emerald-500/20'}`}>
              <div className="flex items-center gap-2.5">
                {systemAlert.type === 'danger' ? <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                <span>{systemAlert.message}</span>
              </div>
              <button onClick={clearAlert} className="text-slate-400 hover:text-white text-[12px] font-semibold ml-4 cursor-pointer transition-colors">Dismiss</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 p-5 lg:p-7 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Toasts */}
      <ToastContainer />

      {/* Command Palette */}
      <AnimatePresence>
        <CommandPalette open={showCommandPalette} onClose={() => setShowCommandPalette(false)} />
      </AnimatePresence>
    </div>
  );
}
