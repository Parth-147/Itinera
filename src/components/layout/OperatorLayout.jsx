import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Zap,
  Building2,
  LogOut,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOperator } from '../../context/OperatorContext';

export default function OperatorLayout() {
  const { user, logout } = useAuth();
  const { stats, activeDisruption, systemAlert, clearAlert } = useOperator();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      to: '/operator/dashboard',
      icon: LayoutDashboard,
      matchExact: true,
      aliases: ['/operator', '/operator/dashboard'],
    },
    {
      label: 'Trips',
      to: '/operator/trips',
      icon: Compass,
      aliases: ['/operator/trips'],
    },
    {
      label: 'Disruptions / Adapt',
      to: '/operator/adapt',
      icon: Zap,
      badge: stats.atRisk > 0 ? stats.atRisk : null,
      badgeColor: 'bg-amber-500 text-white',
      aliases: ['/operator/adapt'],
    },
    {
      label: 'Vendors',
      to: '/operator/vendors',
      icon: Building2,
      aliases: ['/operator/vendors'],
    },
  ];

  const isItemActive = (item) => {
    if (item.aliases) {
      return item.aliases.some((alias) => location.pathname === alias || location.pathname.startsWith(`${alias}/`));
    }
    return location.pathname === item.to;
  };

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* ─── 240px Fixed Sidebar (Desktop) ─── */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-[#0F2942] flex-col justify-between border-r border-[#1F4E79]/30 fixed top-0 bottom-0 z-40 text-white select-none">
        <div>
          {/* Logo Brand */}
          <div className="h-16 px-5 flex items-center gap-3 border-b border-white/10">
            <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold shadow-soft">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-none">
                itinera
              </span>
              <span className="text-[10px] uppercase font-semibold text-primary-300 tracking-wider">
                Ops Control Center
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={`
                    flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${active
                      ? 'bg-primary-600/90 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        active ? 'bg-white text-primary-700' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 rounded-lg bg-white/5 mb-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary-600 flex items-center justify-center text-xs font-semibold text-white">
                AT
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">
                  {user?.name || 'Ananya Tours'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  Operator • Level 2
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── Mobile Sidebar Overlay ─── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-[#0F2942] flex flex-col justify-between p-4 text-white z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center text-white">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-white leading-none block">itinera</span>
                    <span className="text-[10px] text-primary-300 uppercase tracking-wider">Ops Center</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1.5 mt-4">
                {navItems.map((item) => {
                  const active = isItemActive(item);
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium
                        ${active ? 'bg-primary-600 text-white' : 'text-slate-300 hover:text-white'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </aside>
        </div>
      )}

      {/* ─── Main Content Container (offset by 240px on lg) ─── */}
      <div className="flex-1 flex flex-col lg:pl-60 min-w-0">
        {/* ─── Top Control Center Header ─── */}
        <header className="h-16 bg-white border-b border-surface-200/80 sticky top-0 z-30 px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-surface-600 hover:bg-surface-100 cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-surface-900 leading-none">
                Itinera Operations
              </h1>
              <p className="text-xs text-surface-500 mt-1 hidden sm:block">
                Monitor trips, bookings and disruptions in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* System Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>System Operational</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="h-4 w-4" />
                {stats.atRisk > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>

              {/* Notification Popup */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-modal border border-surface-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-100">
                    <span className="text-xs font-semibold text-surface-900">Notifications</span>
                    <span className="text-[10px] text-surface-400">Real-time alerts</span>
                  </div>
                  <div className="py-2 space-y-2">
                    {activeDisruption ? (
                      <div className="p-2.5 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2 text-xs text-red-800">
                        <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">{activeDisruption.travelerName} • {activeDisruption.destination}</p>
                          <p className="text-[11px] text-red-700">{activeDisruption.componentName} cancelled. Adapt ready.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 text-center text-xs text-surface-500">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                        No active disruptions detected.
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/operator/adapt');
                    }}
                    className="w-full mt-1 py-1.5 text-center text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
                  >
                    Go to Disruption Engine
                  </button>
                </div>
              )}
            </div>

            {/* Operator Badge */}
            <div className="flex items-center gap-2 pl-3 border-l border-surface-200">
              <div className="h-8 w-8 rounded-full bg-[#1F4E79] flex items-center justify-center text-white text-xs font-bold">
                AT
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-surface-900 leading-tight">
                  {user?.name || 'Ananya Tours'}
                </p>
                <span className="text-[10px] text-surface-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-500 inline" /> Verified Ops
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Global Live Disruption Toast / Alert */}
        {systemAlert && (
          <div
            className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between border-b ${
              systemAlert.type === 'danger'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {systemAlert.type === 'danger' ? (
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              )}
              <span>{systemAlert.message}</span>
            </div>
            <button
              onClick={clearAlert}
              className="text-surface-400 hover:text-surface-700 text-xs font-semibold underline ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ─── Page View Outlet ─── */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
