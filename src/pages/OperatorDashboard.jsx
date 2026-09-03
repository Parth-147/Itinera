import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Calendar, AlertTriangle, CheckCircle, Search, ChevronRight, ChevronDown, ChevronUp,
  MapPin, Zap, IndianRupee, TrendingUp, Plus, Bell,
  FileText, Database, RefreshCw, Cpu, BellRing, Clock, X, ArrowRight, Star,
  Check, Send, Eye, Users,
} from 'lucide-react';
import { useOperator } from '../context/OperatorContext';
import { formatCurrency } from '../utils/costCalculator';

/* ═══════════════════════════════════════════
   UTILITY COMPONENTS & HELPERS
   ═══════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

function SortIcon({ col, sortBy, sortDir }) {
  if (sortBy !== col) return null;
  return sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
}

function AnimatedNumber({ value, duration = 1200, prefix = '' }) {
  const [display, setDisplay] = useState(() => (typeof value === 'number' ? value : parseInt(value) || 0));
  const ref = useRef(null);

  useEffect(() => {
    const end = typeof value === 'number' ? value : parseInt(value) || 0;
    const start = 0;
    const startTime = performance.now();
    function animate(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplay(Math.round(start + (end - start) * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    }
    ref.current = requestAnimationFrame(animate);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value, duration]);

  return <>{prefix}{display.toLocaleString('en-IN')}</>;
}

function CircularProgress({ value, size = 48, strokeWidth = 4, color = '#818cf8' }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-bold text-white">{value}%</span>
      </div>
    </div>
  );
}

function DonutChart({ data, size = 160, strokeWidth = 18, onSegmentClick }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const segmentsWithOffsets = useMemo(() => {
    return data.reduce((acc, seg) => {
      const prevOff = acc.totalOffset;
      const pct = seg.value / total;
      const nextOff = prevOff + pct * c;
      return {
        totalOffset: nextOff,
        list: [...acc.list, { ...seg, pct, off: prevOff }],
      };
    }, { totalOffset: 0, list: [] }).list;
  }, [data, total, c]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={strokeWidth} />
        {segmentsWithOffsets.map((seg, i) => {
          const dash = animated ? seg.pct * c : 0;
          return (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-seg.off}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out cursor-pointer hover:opacity-80"
              style={{ transitionDelay: `${i * 150}ms` }}
              onClick={() => onSegmentClick?.(seg.filterKey)}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-white"><AnimatedNumber value={total} /></span>
        <span className="text-[11px] text-slate-500 font-medium mt-0.5">Total Trips</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TRIP QUICK VIEW DRAWER
   ═══════════════════════════════════════════ */
function TripDrawer({ trip, open, onClose, onAdapt }) {
  const navigate = useNavigate();
  if (!trip) return null;

  const components = trip.components || [];
  const confirmed = components.filter((c) => c.status === 'Confirmed').length;
  const total = components.length || trip.componentsCount || 6;
  const healthPct = total > 0 ? Math.round((confirmed / total) * 100) : 92;
  const healthColor = healthPct >= 80 ? '#34d399' : healthPct >= 50 ? '#fbbf24' : '#ef4444';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" onClick={onClose} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0d1829] border-l border-white/[0.08] z-[101] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h3 className="text-[16px] font-bold text-white">Trip Quick View</h3>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Trip Info */}
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500/30 to-primary-700/30 flex items-center justify-center text-[14px] font-bold text-primary-300 shrink-0">
                  {trip.travelerName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className="text-[16px] font-bold text-white">{trip.travelerName}</h4>
                  <p className="text-[12px] text-slate-500">{trip.travelerEmail}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-500/[0.1] text-primary-400 text-[11px] font-medium"><MapPin className="h-3 w-3" />{trip.destination}</span>
                    <span className="text-[11px] text-slate-500">{trip.dates}</span>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Budget</p>
                  <p className="text-[15px] font-bold text-white mt-1">{formatCurrency(trip.budget)}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Health</p>
                  <div className="flex justify-center mt-1"><CircularProgress value={healthPct} color={healthColor} /></div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Bookings</p>
                  <p className="text-[15px] font-bold text-white mt-1">{confirmed}/{total}</p>
                  <p className="text-[10px] text-emerald-400">Confirmed</p>
                </div>
              </div>

              {/* Status + Risk */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${trip.status === 'Active' ? 'bg-primary-500/[0.12] text-primary-400' : trip.status === 'Upcoming' ? 'bg-blue-500/[0.12] text-blue-400' : 'bg-emerald-500/[0.12] text-emerald-400'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${trip.status === 'Active' ? 'bg-primary-400' : trip.status === 'Upcoming' ? 'bg-blue-400' : 'bg-emerald-400'}`}></span>
                  {trip.status}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${trip.risk === 'At Risk' ? 'bg-red-500/[0.12] text-red-400' : 'bg-emerald-500/[0.08] text-emerald-400/80'}`}>
                  {trip.risk}
                </span>
              </div>

              {/* Itinerary Timeline */}
              {components.length > 0 && (
                <div>
                  <h5 className="text-[13px] font-bold text-white mb-3 uppercase tracking-wider">Itinerary</h5>
                  <div className="relative">
                    <div className="absolute left-[11px] top-3 bottom-3 w-px bg-white/[0.08]"></div>
                    <div className="space-y-3">
                      {components.map((comp) => (
                        <div key={comp.id} className={`flex gap-3 relative ${comp.status === 'Cancelled' ? 'opacity-50' : ''}`}>
                          <div className={`h-[23px] w-[23px] rounded-full flex items-center justify-center text-[11px] shrink-0 relative z-10 ring-4 ring-[#0d1829] ${
                            comp.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' : comp.status === 'At Risk' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>{comp.emoji || '📍'}</div>
                          <div className="flex-1 min-w-0 pb-1">
                            <div className="flex items-center gap-2">
                              <p className="text-[12px] font-semibold text-white truncate">{comp.name}</p>
                              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                                comp.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' : comp.status === 'At Risk' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                              }`}>{comp.status}</span>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-0.5">{comp.vendor} • {formatCurrency(comp.cost)}</p>
                            <p className="text-[10px] text-slate-600">{comp.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-5 py-4 border-t border-white/[0.06] space-y-2">
              <button onClick={() => { onClose(); navigate(`/operator/trips/${trip.id}`); }} className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Eye className="h-4 w-4" /> View Full Trip
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { onClose(); onAdapt?.(trip); }} className="py-2.5 rounded-xl bg-amber-500/[0.1] border border-amber-500/20 text-amber-400 text-[12px] font-semibold hover:bg-amber-500/20 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" /> Adapt Trip
                </button>
                <button className="py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-400 text-[12px] font-semibold hover:bg-white/[0.08] transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                  <Send className="h-3.5 w-3.5" /> Contact
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   DISRUPTION SIMULATOR MODAL
   ═══════════════════════════════════════════ */
function DisruptionSimulatorModal({ open, onClose, onTrigger }) {
  const { trips } = useOperator();
  const tripsWithComponents = useMemo(() => trips.filter((t) => t.components?.length > 0), [trips]);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [disruptionType, setDisruptionType] = useState('Activity Cancellation');
  const [severity, setSeverity] = useState('High');

  const activeTripId = selectedTrip || tripsWithComponents[0]?.id || '';
  const currentTrip = tripsWithComponents.find((t) => t.id === activeTripId);
  const components = currentTrip?.components || [];
  const activeComponentId = selectedComponent || components[0]?.id || '';

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#131d30] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/[0.15] flex items-center justify-center"><Zap className="h-5 w-5 text-amber-400" /></div>
            <div>
              <h3 className="text-[16px] font-bold text-white">Simulate Travel Disruption</h3>
              <p className="text-[11px] text-slate-500">Test the Adapt Engine with a simulated disruption</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.06] text-slate-400 cursor-pointer"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Trip</label>
            <select
              value={activeTripId}
              onChange={(e) => {
                setSelectedTrip(e.target.value);
                setSelectedComponent('');
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer appearance-none"
            >
              {tripsWithComponents.map((t) => <option key={t.id} value={t.id}>{t.travelerName} — {t.destination}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Component</label>
            <select
              value={activeComponentId}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer appearance-none"
            >
              {components.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Type</label>
              <select value={disruptionType} onChange={(e) => setDisruptionType(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer appearance-none">
                <option>Activity Cancellation</option><option>Transport Delay</option><option>Hotel Overbooking</option><option>Vendor Unavailable</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Severity</label>
              <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer appearance-none">
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/[0.06]">
          <button
            onClick={() => {
              onTrigger(activeTripId, activeComponentId, disruptionType);
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white text-[14px] font-bold hover:from-amber-600 hover:to-red-600 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Zap className="h-5 w-5" /> Trigger Disruption
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ADAPT ENGINE PANEL
   ═══════════════════════════════════════════ */
const STAGES = ['Disruption Detected', 'Dependency Analysis', 'Impact Assessment', 'Alternative Search', 'Smart Ranking', 'Recovery Ready'];

function AdaptEnginePanel({ open, onClose, onSelectAlternative, disruption }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!open) return;
    const timers = STAGES.map((_, i) => setTimeout(() => setStage(i + 1), (i + 1) * 600));
    return () => {
      timers.forEach(clearTimeout);
      setStage(0);
    };
  }, [open]);

  if (!open || !disruption) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-[#131d30] border border-white/[0.08] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] sticky top-0 bg-[#131d30] z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center"><Zap className="h-5 w-5 text-white" /></div>
            <div><h3 className="text-[16px] font-bold text-white">ITINERA ADAPT ENGINE</h3><p className="text-[11px] text-slate-500">Intelligent disruption recovery</p></div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.06] text-slate-400 cursor-pointer"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Processing Steps */}
          <div className="grid grid-cols-6 gap-1">
            {STAGES.map((s, i) => (
              <div key={s} className="text-center">
                <div className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-500 ${
                  stage > i ? 'bg-emerald-500/20 text-emerald-400' : stage === i ? 'bg-primary-500/20 text-primary-400 animate-pulse' : 'bg-white/[0.04] text-slate-600'
                }`}>{stage > i ? <Check className="h-4 w-4" /> : i + 1}</div>
                <p className={`text-[9px] mt-1 font-medium ${stage > i ? 'text-emerald-400' : stage === i ? 'text-primary-400' : 'text-slate-600'}`}>{s}</p>
              </div>
            ))}
          </div>

          {stage < STAGES.length && (
            <div className="text-center py-4">
              <div className="h-8 w-8 mx-auto rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
              <p className="text-[13px] text-primary-400 mt-3 font-medium">Analyzing disruption...</p>
            </div>
          )}

          {/* Affected Components */}
          {stage >= STAGES.length && (
            <>
              <div className="p-4 rounded-xl bg-red-500/[0.06] border border-red-500/15">
                <p className="text-[12px] font-semibold text-red-400 mb-2">Affected Components</p>
                <div className="space-y-2">
                  {(disruption.affectedComponents || []).map((c) => (
                    <div key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03]">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{c.emoji}</span>
                        <span className="text-[12px] font-medium text-white">{c.name}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${c.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternatives */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[13px] font-bold text-white">{disruption.alternatives?.length || 0} Alternatives Found</p>
                  <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">AI Ranked</span>
                </div>
                <div className="space-y-3">
                  {(disruption.alternatives || []).map((alt, i) => (
                    <div key={alt.id} className={`p-4 rounded-xl border transition-all hover:scale-[1.005] ${i === 0 ? 'bg-primary-500/[0.05] border-primary-500/20' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{alt.emoji}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[14px] font-bold text-white">{alt.name}</p>
                              {i === 0 && <span className="text-[9px] font-bold uppercase tracking-wider text-primary-400 bg-primary-500/15 px-1.5 py-0.5 rounded">Best Match</span>}
                            </div>
                            <p className="text-[11px] text-slate-500">{alt.vendor} • {alt.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[16px] font-bold text-white">{formatCurrency(alt.cost)}</p>
                          <p className={`text-[11px] font-semibold ${alt.costDelta <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>{alt.costDifferenceText}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] text-center">
                          <p className="text-[10px] text-slate-500">Rating</p>
                          <p className="text-[13px] font-semibold text-white flex items-center justify-center gap-1"><Star className="h-3 w-3 text-amber-400" />{alt.rating}</p>
                        </div>
                        <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] text-center">
                          <p className="text-[10px] text-slate-500">Trip Fit</p>
                          <p className="text-[13px] font-semibold text-primary-400">{alt.tripFit}%</p>
                        </div>
                        <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] text-center">
                          <p className="text-[10px] text-slate-500">Time</p>
                          <p className="text-[11px] font-semibold text-white">{alt.time}</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-[10px] text-slate-500 mb-1.5 uppercase tracking-wider font-semibold">Why recommended</p>
                        <div className="grid grid-cols-2 gap-1">
                          {alt.whyRecommended?.map((r) => (
                            <p key={r} className="text-[11px] text-slate-400 flex items-center gap-1"><Check className="h-3 w-3 text-emerald-400 shrink-0" />{r}</p>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => onSelectAlternative(alt.id)}
                        className={`w-full py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          i === 0 ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20' : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]'
                        }`}>
                        <Check className="h-4 w-4" /> Select Alternative
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUCCESS ANIMATION
   ═══════════════════════════════════════════ */
function SuccessModal({ open, onClose, resolution, onNotify }) {
  if (!open || !resolution) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-[#131d30] border border-emerald-500/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
            className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-white">Trip Successfully Adapted</h3>
          <p className="text-[13px] text-slate-500 mt-2">{resolution.travelerName} • {resolution.destination}</p>

          <div className="mt-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-[12px] text-red-400 line-through">{resolution.oldComponent}</span>
              <ArrowRight className="h-4 w-4 text-emerald-400" />
              <span className="text-[12px] text-emerald-400 font-semibold">{resolution.newComponent}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-500">Trip Cost</span>
              <span className="text-white font-semibold">{formatCurrency(resolution.oldBudget)} → {formatCurrency(resolution.newBudget)}</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-500">Risk Status</span>
              <span className="text-emerald-400 font-semibold">AT RISK → RESOLVED</span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-2">
          <button onClick={onNotify} className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2">
            <Send className="h-4 w-4" /> Notify Traveler
          </button>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 text-[13px] font-medium transition-colors cursor-pointer">
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NOTIFY TRAVELER MODAL
   ═══════════════════════════════════════════ */
function NotifyModal({ open, onClose, resolution, addToast }) {
  const [sent, setSent] = useState(false);
  const msg = resolution ? `Your ${resolution.oldComponent} activity was cancelled. Itinera has automatically arranged ${resolution.newComponent} as an alternative. Your updated trip cost is ${formatCurrency(resolution.newBudget)}.` : '';

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-[#131d30] border border-white/[0.08] rounded-2xl shadow-2xl">
        {!sent ? (
          <>
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-[16px] font-bold text-white">Notify {resolution?.travelerName}</h3>
              <p className="text-[11px] text-slate-500">Send trip update notification</p>
            </div>
            <div className="p-6">
              <p className="text-[12px] text-slate-400 leading-relaxed p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">{msg}</p>
            </div>
            <div className="px-6 pb-6 flex gap-2">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/[0.04] text-slate-400 text-[13px] font-medium hover:bg-white/[0.08] transition-colors cursor-pointer">Cancel</button>
              <button onClick={() => { setSent(true); addToast?.('Traveler notified successfully', 'success'); setTimeout(() => { setSent(false); onClose(); }, 1500); }}
                className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white text-[13px] font-semibold hover:bg-primary-700 transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Send className="h-4 w-4" /> Send Notification
              </button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-14 w-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3"><Check className="h-7 w-7 text-emerald-400" /></motion.div>
            <h3 className="text-[16px] font-bold text-white">Traveler Notified</h3>
            <p className="text-[12px] text-slate-500 mt-1">Message sent to {resolution?.travelerName}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   REVENUE SUMMARY MODAL
   ═══════════════════════════════════════════ */
function RevenueModal({ open, onClose }) {
  if (!open) return null;
  const data = [
    { dest: 'Goa', rev: 586700, pct: 31 },
    { dest: 'Manali', rev: 312000, pct: 17 },
    { dest: 'Kerala', rev: 456800, pct: 24 },
    { dest: 'Rajasthan', rev: 328500, pct: 18 },
    { dest: 'Leh Ladakh', rev: 188000, pct: 10 },
  ];
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-[#131d30] border border-white/[0.08] rounded-2xl shadow-2xl">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-white">Revenue Summary</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.06] text-slate-400 cursor-pointer"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"><p className="text-[10px] text-slate-500">Current Month</p><p className="text-xl font-bold text-white">₹18,72,000</p></div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"><p className="text-[10px] text-slate-500">Last Month</p><p className="text-xl font-bold text-slate-400">₹16,62,000</p></div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-[13px] font-semibold text-emerald-400">+12.6% growth vs last month</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">By Destination</p>
            {data.map((d) => (
              <div key={d.dest} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <span className="text-[13px] text-white font-medium">{d.dest}</span>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 rounded-full bg-white/[0.06] overflow-hidden"><div className="h-full rounded-full bg-primary-500 transition-all duration-1000" style={{ width: `${d.pct}%` }}></div></div>
                  <span className="text-[12px] text-slate-400 font-medium w-20 text-right">{formatCurrency(d.rev)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════ */
export default function OperatorDashboard() {
  const navigate = useNavigate();
  const { trips, stats, activeDisruption, disruptions, activities, addToast, triggerDisruption, resolveDisruption } = useOperator();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const perPage = 5;

  // Modals / Drawers
  const [drawerTrip, setDrawerTrip] = useState(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showAdapt, setShowAdapt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
  const [lastResolution, setLastResolution] = useState(null);

  const filterTabs = ['All', 'Active', 'Upcoming', 'Completed', 'At Risk'];

  // KPI card click handlers
  const handleKpiClick = useCallback((filter) => {
    setSelectedFilter(filter);
    setSelectedRisk('All');
    setPage(1);
  }, []);

  // Filtered + sorted trips
  const filteredTrips = useMemo(() => {
    let result = trips.filter((trip) => {
      const matchesSearch = trip.travelerName.toLowerCase().includes(searchQuery.toLowerCase()) || trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (selectedFilter === 'At Risk') return trip.risk === 'At Risk';
      if (selectedFilter !== 'All' && trip.status !== selectedFilter) return false;
      if (selectedRisk !== 'All') { if (selectedRisk === 'At Risk' && trip.risk !== 'At Risk') return false; if (selectedRisk === 'Normal' && trip.risk !== 'Normal') return false; }
      return true;
    });
    if (sortBy) {
      result = [...result].sort((a, b) => {
        let va = a[sortBy], vb = b[sortBy];
        if (typeof va === 'string') va = va.toLowerCase();
        if (typeof vb === 'string') vb = vb.toLowerCase();
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [trips, searchQuery, selectedFilter, selectedRisk, sortBy, sortDir]);

  const totalPages = Math.ceil(filteredTrips.length / perPage);
  const paginatedTrips = filteredTrips.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key) => { if (sortBy === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc'); else { setSortBy(key); setSortDir('asc'); } };
  const clearFilters = () => { setSearchQuery(''); setSelectedFilter('All'); setSelectedRisk('All'); setSortBy(null); setPage(1); };
  const getInitials = (n) => n.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);

  // Disruption flow handlers
  const handleTriggerDisruption = (tripId, componentId, type) => {
    triggerDisruption(tripId, componentId, type);
    addToast('⚠ Disruption detected. Opening Adapt Engine...', 'warning');
    setTimeout(() => setShowAdapt(true), 800);
  };

  const handleSelectAlternative = (altId) => {
    const result = resolveDisruption(altId);
    setShowAdapt(false);
    setLastResolution(result);
    addToast('✓ Trip successfully adapted!', 'success');
    setTimeout(() => setShowSuccess(true), 400);
  };

  const handleOpenAdaptFromDrawer = (trip) => {
    if (trip.components?.length > 0) { setShowSimulator(true); }
    else { navigate('/operator/adapt'); }
  };

  // Chart data
  const chartData = useMemo(() => [
    { label: 'Active', value: stats.activeTrips, color: '#818cf8', pct: '45%', filterKey: 'Active' },
    { label: 'Upcoming', value: stats.upcomingTrips, color: '#38bdf8', pct: '22%', filterKey: 'Upcoming' },
    { label: 'Completed', value: stats.completedTrips, color: '#34d399', pct: '27%', filterKey: 'Completed' },
    { label: 'At Risk', value: stats.atRisk, color: '#fbbf24', pct: '6%', filterKey: 'At Risk' },
  ], [stats.activeTrips, stats.upcomingTrips, stats.completedTrips, stats.atRisk]);

  const severityColors = { High: { bg: 'bg-red-500/[0.1]', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500' }, Medium: { bg: 'bg-amber-500/[0.1]', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500' }, Low: { bg: 'bg-blue-500/[0.1]', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-400' } };
  const activityColors = { emerald: 'bg-emerald-500', amber: 'bg-amber-500', blue: 'bg-blue-500', purple: 'bg-primary-500', red: 'bg-red-500' };
  const systemItems = [{ label: 'Database', icon: Database }, { label: 'Real-time Sync', icon: RefreshCw }, { label: 'AI Engine (Adapt)', icon: Cpu }, { label: 'Notifications', icon: BellRing }];

  const atRiskTrips = useMemo(() => trips.filter((t) => t.risk === 'At Risk'), [trips]);

  return (
    <div className="space-y-6">
      {/* ── Attention Center ── */}
      <AnimatePresence>
        {atRiskTrips.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="p-5 rounded-2xl bg-gradient-to-r from-red-500/[0.06] to-amber-500/[0.04] border border-red-500/15">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <h3 className="text-[14px] font-bold text-white">{atRiskTrips.length} Trip{atRiskTrips.length > 1 ? 's' : ''} Require Attention</h3>
                </div>
                <button onClick={() => handleKpiClick('At Risk')} className="text-[11px] text-primary-400 hover:text-primary-300 font-medium cursor-pointer">View All →</button>
              </div>
              <div className="space-y-2">
                {atRiskTrips.map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-red-500/20 flex items-center justify-center text-[11px] font-bold text-red-300">{getInitials(trip.travelerName)}</div>
                      <div>
                        <p className="text-[13px] font-semibold text-white">{trip.travelerName} — {trip.destination}</p>
                        <p className="text-[11px] text-slate-500">{trip.components?.find((c) => c.status === 'At Risk' || c.status === 'Cancelled')?.name || 'Component at risk'} • <span className="text-red-400 font-medium">HIGH PRIORITY</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setDrawerTrip(trip)} className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-[11px] text-slate-400 font-medium hover:bg-white/[0.08] transition-colors cursor-pointer">View</button>
                      <button onClick={() => { if (trip.components?.length > 0) { setShowSimulator(true); } else { navigate('/operator/adapt'); } }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/[0.12] text-[11px] text-amber-400 font-semibold hover:bg-amber-500/20 transition-colors cursor-pointer flex items-center gap-1"><Zap className="h-3 w-3" /> Adapt Now</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── KPI Cards ── */}
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: 'Active Trips', value: stats.activeTrips, sub: '↑ 6 in transit', desc: 'Currently operating', icon: Compass, color: 'primary', filter: 'Active', trend: true },
          { title: 'Upcoming Trips', value: stats.upcomingTrips, sub: 'Next 14 days', desc: 'Ready for departures', icon: Calendar, color: 'blue', filter: 'Upcoming' },
          { title: 'At Risk Trips', value: stats.atRisk, sub: stats.atRisk > 0 ? '↑ 1 from yesterday' : '', desc: 'Requires attention', icon: AlertTriangle, color: 'amber', filter: 'At Risk', isRisk: true },
          { title: 'Confirmed Components', value: stats.confirmedBookings, sub: '98.4% health', desc: 'Hotels, transport & activities', icon: CheckCircle, color: 'emerald', filter: null },
          { title: 'Total Revenue', displayValue: '₹18,72,000', sub: '↑ 12.6%', desc: 'vs last month', icon: IndianRupee, color: 'primary', filter: 'revenue', trend: true },
        ].map((card, i) => {
          const Icon = card.icon;
          const isAmber = card.isRisk && stats.atRisk > 0;
          const colorMap = { primary: { bg: 'bg-primary-500/[0.12]', text: 'text-primary-400', border: 'hover:border-primary-500/30', shadow: 'hover:shadow-primary-500/[0.04]' }, blue: { bg: 'bg-blue-500/[0.12]', text: 'text-blue-400', border: 'hover:border-blue-500/30', shadow: 'hover:shadow-blue-500/[0.04]' }, amber: { bg: 'bg-amber-500/[0.12]', text: 'text-amber-400', border: 'hover:border-amber-500/30', shadow: 'hover:shadow-amber-500/[0.04]' }, emerald: { bg: 'bg-emerald-500/[0.12]', text: 'text-emerald-400', border: 'hover:border-emerald-500/30', shadow: 'hover:shadow-emerald-500/[0.04]' } };
          const cm = colorMap[card.color];
          return (
            <motion.div key={card.title} variants={fadeUp} custom={i}>
              <div onClick={() => card.filter === 'revenue' ? setShowRevenue(true) : card.filter ? handleKpiClick(card.filter) : null}
                className={`group relative p-5 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                  isAmber ? 'bg-amber-500/[0.06] border border-amber-500/20 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/[0.06]'
                  : `bg-[#111c2e]/80 border border-white/[0.06] ${cm.border} hover:shadow-lg ${cm.shadow}`
                }`}>
                <div className={`absolute top-0 right-0 w-24 h-24 ${cm.bg} rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-500 opacity-50`}></div>
                <div className="flex items-center justify-between relative">
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${isAmber ? 'text-amber-400' : 'text-slate-500'}`}>{card.title}</span>
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${isAmber && stats.atRisk > 0 ? 'bg-amber-500/20 text-amber-400 animate-pulse' : `${cm.bg} ${cm.text}`}`}><Icon className="h-[18px] w-[18px]" /></div>
                </div>
                <div className="mt-3 flex items-baseline gap-2 relative">
                  <span className={`text-3xl font-bold tracking-tight ${isAmber ? 'text-amber-300' : 'text-white'}`}>
                    {card.displayValue || <AnimatedNumber value={card.value} />}
                  </span>
                  {card.sub && <span className={`text-[11px] font-medium flex items-center gap-0.5 ${card.trend ? 'text-emerald-400' : isAmber ? 'text-amber-400' : 'text-slate-500'}`}>{card.trend && <TrendingUp className="h-3 w-3" />}{card.sub}</span>}
                </div>
                <p className={`text-[11px] mt-1.5 ${isAmber ? 'text-amber-400/70' : 'text-slate-500'}`}>{card.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Active Trips Section ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Active Trips</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">Live operational monitoring for all booked traveler tours.</p>
          </div>
          <button onClick={() => setShowSimulator(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600/20 border border-primary-500/30 text-primary-400 text-[13px] font-semibold hover:bg-primary-600/30 hover:border-primary-500/50 transition-all cursor-pointer">
            <Zap className="h-4 w-4" /> Disruption Simulator &amp; Adapt Engine
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[#111c2e]/60 border border-white/[0.06] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input type="text" placeholder="Search traveler or destination..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 text-[13px] bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/40 transition-all" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={selectedRisk} onChange={(e) => { setSelectedRisk(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-xl text-[12px] font-medium bg-white/[0.04] border border-white/[0.08] text-slate-400 focus:outline-none cursor-pointer appearance-none">
              <option value="All">Risk Level</option><option value="Normal">Normal</option><option value="At Risk">At Risk</option>
            </select>
            <div className="flex items-center gap-1 overflow-x-auto">
              {filterTabs.map((tab) => (
                <button key={tab} onClick={() => { setSelectedFilter(tab); setPage(1); }}
                  className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedFilter === tab ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'}`}>
                  {tab}{tab === 'At Risk' && stats.atRisk > 0 && <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${selectedFilter === tab ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>{stats.atRisk}</span>}
                </button>
              ))}
            </div>
            {(searchQuery || selectedFilter !== 'All' || selectedRisk !== 'All' || sortBy) && (
              <button onClick={clearFilters} className="px-3 py-2 rounded-xl text-[11px] text-slate-500 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer flex items-center gap-1"><X className="h-3 w-3" /> Clear</button>
            )}
          </div>
        </div>

        {/* Table + Right Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
          <div>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-[#111c2e]/60 border border-white/[0.06] rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[10px] font-semibold text-slate-500 uppercase tracking-[0.1em]">
                    <th className="py-4 px-5 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => handleSort('travelerName')}><span className="flex items-center gap-1">Traveler <SortIcon col="travelerName" sortBy={sortBy} sortDir={sortDir} /></span></th>
                    <th className="py-4 px-4 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => handleSort('destination')}><span className="flex items-center gap-1">Destination <SortIcon col="destination" sortBy={sortBy} sortDir={sortDir} /></span></th>
                    <th className="py-4 px-4">Dates</th>
                    <th className="py-4 px-4 text-center">Components</th>
                    <th className="py-4 px-4 cursor-pointer hover:text-slate-300 transition-colors" onClick={() => handleSort('budget')}><span className="flex items-center gap-1">Budget <SortIcon col="budget" sortBy={sortBy} sortDir={sortDir} /></span></th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-center">Risk</th>
                    <th className="py-4 px-3">Updated</th>
                    <th className="py-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-[13px]">
                  {paginatedTrips.length === 0 ? (
                    <tr><td colSpan={9} className="py-16 text-center text-slate-600"><Search className="h-6 w-6 mx-auto mb-2 text-slate-700" />No trips match your current filters.<br /><button onClick={clearFilters} className="mt-2 text-primary-400 hover:text-primary-300 text-[12px] font-medium cursor-pointer">Clear all filters</button></td></tr>
                  ) : paginatedTrips.map((trip) => {
                    const isAtRisk = trip.risk === 'At Risk';
                    return (
                      <tr key={trip.id} onClick={() => setDrawerTrip(trip)} className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${isAtRisk ? 'bg-amber-500/[0.02]' : ''}`}>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500/30 to-primary-700/30 flex items-center justify-center text-[11px] font-bold text-primary-300 shrink-0">{getInitials(trip.travelerName)}</div>
                            <div><p className="font-semibold text-white">{trip.travelerName}</p><p className="text-[11px] text-slate-600">{trip.travelerEmail}</p></div>
                          </div>
                        </td>
                        <td className="py-4 px-4"><div className="flex items-center gap-1.5 font-medium text-slate-300"><MapPin className="h-3.5 w-3.5 text-primary-400" />{trip.destination}</div></td>
                        <td className="py-4 px-4 text-slate-500 text-[12px] font-medium">{trip.dates}</td>
                        <td className="py-4 px-4 text-center"><span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-400 text-[12px] font-semibold border border-white/[0.06]">{trip.componentsCount || trip.components?.length || 6}</span></td>
                        <td className="py-4 px-4 font-semibold text-white">{formatCurrency(trip.budget)}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${trip.status === 'Active' ? 'bg-primary-500/[0.12] text-primary-400 border border-primary-500/20' : trip.status === 'Upcoming' ? 'bg-blue-500/[0.12] text-blue-400 border border-blue-500/20' : 'bg-emerald-500/[0.12] text-emerald-400 border border-emerald-500/20'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${trip.status === 'Active' ? 'bg-primary-400' : trip.status === 'Upcoming' ? 'bg-blue-400' : 'bg-emerald-400'}`}></span>{trip.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">{isAtRisk ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-red-500/[0.12] text-red-400 border border-red-500/20"><span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse"></span>At Risk</span> : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/[0.08] text-emerald-400/80 border border-emerald-500/10"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>Normal</span>}</td>
                        <td className="py-4 px-3 text-[11px] text-slate-600">{trip.lastUpdated}</td>
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => setDrawerTrip(trip)} className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary-400 hover:text-primary-300 hover:bg-primary-500/[0.08] px-3 py-1.5 rounded-lg transition-all cursor-pointer">View <ChevronRight className="h-3.5 w-3.5" /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
                  <span className="text-[12px] text-slate-600">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filteredTrips.length)} of {filteredTrips.length}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-[12px] text-slate-500 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">← Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer ${page === i + 1 ? 'bg-primary-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'}`}>{i + 1}</button>
                    ))}
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-[12px] text-slate-500 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">Next →</button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {paginatedTrips.length === 0 ? (
                <div className="p-10 text-center text-slate-600 bg-[#111c2e]/60 rounded-2xl border border-white/[0.06]"><Search className="h-6 w-6 mx-auto mb-2 text-slate-700" />No trips found.</div>
              ) : paginatedTrips.map((trip) => (
                <div key={trip.id} onClick={() => setDrawerTrip(trip)} className={`p-4 bg-[#111c2e]/60 border rounded-2xl space-y-3 cursor-pointer transition-all hover:bg-white/[0.02] ${trip.risk === 'At Risk' ? 'border-amber-500/20' : 'border-white/[0.06]'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3"><div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500/30 to-primary-700/30 flex items-center justify-center text-[11px] font-bold text-primary-300">{getInitials(trip.travelerName)}</div><div><h3 className="font-semibold text-white text-[14px]">{trip.travelerName}</h3><p className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3 text-primary-400" />{trip.destination} • {trip.dates}</p></div></div>
                    <p className="text-[14px] font-bold text-white">{formatCurrency(trip.budget)}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${trip.status === 'Active' ? 'bg-primary-500/[0.12] text-primary-400' : trip.status === 'Upcoming' ? 'bg-blue-500/[0.12] text-blue-400' : 'bg-emerald-500/[0.12] text-emerald-400'}`}>{trip.status}</span>
                      {trip.risk === 'At Risk' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-red-500/[0.12] text-red-400">At Risk</span>}
                    </div>
                    <span className="text-[12px] font-semibold text-primary-400 flex items-center">Details <ChevronRight className="h-3 w-3" /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div className="space-y-5">
            {/* Recent Disruptions */}
            <div className="bg-[#111c2e]/60 border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-white">Live Disruptions</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 animate-pulse">LIVE</span>
                </div>
                <button onClick={() => navigate('/operator/adapt')} className="text-[11px] font-medium text-primary-400 hover:text-primary-300 cursor-pointer">View All</button>
              </div>
              <div className="space-y-3">
                {disruptions.map((d) => {
                  const col = severityColors[d.severity] || severityColors.Low;
                  return (
                    <div key={d.id} onClick={() => setDrawerTrip(trips.find((t) => t.id === d.tripId))} className={`p-3.5 rounded-xl ${col.bg} border ${col.border} cursor-pointer hover:scale-[1.01] transition-all duration-200`}>
                      <div className="flex items-start gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${col.dot} mt-1 shrink-0`}></div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-semibold ${col.text}`}>{d.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{d.travelerName} • {d.destination} Trip</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-slate-600 flex items-center gap-1"><Clock className="h-3 w-3" />{d.timeAgo}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${col.bg} ${col.text} border ${col.border}`}>{d.severity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trip Status Distribution */}
            <div className="bg-[#111c2e]/60 border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-[14px] font-bold text-white mb-5">Trip Status Distribution</h3>
              <div className="flex justify-center mb-5"><DonutChart data={chartData} size={160} strokeWidth={18} onSegmentClick={(filter) => handleKpiClick(filter)} /></div>
              <div className="grid grid-cols-2 gap-2.5">
                {chartData.map((d) => (
                  <button key={d.label} onClick={() => handleKpiClick(d.filterKey)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer text-left">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                    <div><p className="text-[11px] text-slate-500">{d.label}</p><p className="text-[13px] font-semibold text-white">{d.value} <span className="text-[10px] text-slate-600 font-normal">({d.pct})</span></p></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px_280px] gap-5">
        {/* Activities */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <div className="bg-[#111c2e]/60 border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-[14px] font-bold text-white mb-5">Recent Activities</h3>
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.06]"></div>
              <div className="space-y-5">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} onClick={() => { const t = trips.find((tr) => tr.id === act.tripId); if (t) setDrawerTrip(t); }} className="flex gap-4 relative cursor-pointer group">
                    <div className={`h-[15px] w-[15px] rounded-full ${activityColors[act.color] || 'bg-primary-500'} shrink-0 mt-0.5 ring-4 ring-[#111c2e] relative z-10 group-hover:scale-110 transition-transform`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white group-hover:text-primary-400 transition-colors">{act.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{act.travelerName} • {act.destination}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-primary-400 font-medium bg-primary-500/[0.08] px-2 py-0.5 rounded-md">{act.detail}</span>
                        <span className="text-[10px] text-slate-600 flex items-center gap-1"><Clock className="h-3 w-3" />{act.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Overview */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
          <div className="bg-[#111c2e]/60 border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-[14px] font-bold text-white mb-4">System Overview</h3>
            <div className="space-y-3">
              {systemItems.map((item) => { const Icon = item.icon; return (
                <div key={item.label} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-2.5"><Icon className="h-4 w-4 text-slate-500" /><span className="text-[12px] font-medium text-slate-400">{item.label}</span></div>
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400"></span><span className="text-[11px] font-medium text-emerald-400">Operational</span></div>
                </div>
              ); })}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
          <div className="bg-[#111c2e]/60 border border-white/[0.06] rounded-2xl p-5">
            <h3 className="text-[14px] font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Add Vendor', icon: Plus, color: 'blue', action: () => navigate('/operator/vendors') },
                { label: 'Simulate Disruption', icon: Zap, color: 'primary', action: () => setShowSimulator(true), highlight: true },
                { label: 'Generate Report', icon: FileText, color: 'emerald', action: () => addToast('Report generation started', 'info') },
                { label: 'Notify Travelers', icon: Bell, color: 'amber', action: () => addToast('Batch notification sent to all travelers', 'success') },
                { label: 'View All Trips', icon: Users, color: 'slate', action: () => { handleKpiClick('All'); } },
              ].map((btn) => (
                <button key={btn.label} onClick={btn.action}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all cursor-pointer group ${
                    btn.highlight ? 'bg-primary-500/[0.06] border-primary-500/20 text-primary-400 hover:bg-primary-500/[0.12] hover:border-primary-500/30' : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.1]'
                  }`}>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                    btn.color === 'blue' ? 'bg-blue-500/[0.12] text-blue-400' : btn.color === 'primary' ? 'bg-primary-500/[0.15] text-primary-400' : btn.color === 'emerald' ? 'bg-emerald-500/[0.12] text-emerald-400' : btn.color === 'amber' ? 'bg-amber-500/[0.12] text-amber-400' : 'bg-white/[0.06] text-slate-400'
                  }`}><btn.icon className="h-4 w-4" /></div>
                  <span className={`text-[13px] font-medium ${btn.highlight ? 'font-semibold' : ''}`}>{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ MODALS / DRAWERS ═══ */}
      <TripDrawer trip={drawerTrip} open={!!drawerTrip} onClose={() => setDrawerTrip(null)} onAdapt={handleOpenAdaptFromDrawer} />
      <DisruptionSimulatorModal open={showSimulator} onClose={() => setShowSimulator(false)} onTrigger={handleTriggerDisruption} />
      <AdaptEnginePanel open={showAdapt} onClose={() => setShowAdapt(false)} onSelectAlternative={handleSelectAlternative} disruption={activeDisruption} />
      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} resolution={lastResolution} onNotify={() => { setShowSuccess(false); setTimeout(() => setShowNotify(true), 300); }} />
      <NotifyModal open={showNotify} onClose={() => setShowNotify(false)} resolution={lastResolution} addToast={addToast} />
      <RevenueModal open={showRevenue} onClose={() => setShowRevenue(false)} />
    </div>
  );
}
