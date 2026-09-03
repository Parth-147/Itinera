import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Wallet,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowDown,
  Building2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useOperator } from '../context/OperatorContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { formatCurrency } from '../utils/costCalculator';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function OperatorTripDetail() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, activeDisruption } = useOperator();

  // Find trip by ID or fallback to Rahul's Goa trip
  const trip = useMemo(() => {
    return (
      trips.find((t) => t.id === tripId || t.id === `trip-${tripId}`) ||
      trips[0]
    );
  }, [trips, tripId]);

  // Group components by day
  const dayGroups = useMemo(() => {
    const groups = {};
    (trip.components || []).forEach((c) => {
      const day = c.day || 1;
      if (!groups[day]) groups[day] = [];
      groups[day].push(c);
    });
    return Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b));
  }, [trip]);

  const hasAtRisk = trip.risk === 'At Risk' || (trip.components || []).some((c) => c.status === 'At Risk' || c.status === 'Cancelled');

  return (
    <div className="space-y-8">
      {/* ─── Breadcrumb & Back ─── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/operator/dashboard')}
          className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 hover:text-surface-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Operations Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/operator/adapt')}
            icon={Zap}
          >
            Open in Adapt Engine
          </Button>
        </div>
      </div>

      {/* ─── Trip Header Hero ─── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-white border border-surface-200 rounded-2xl p-6 shadow-xs"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-surface-900">
                {trip.travelerName}&apos;s {trip.destination} Trip
              </h1>
              <Badge variant={trip.status === 'Active' ? 'primary' : 'info'} size="md">
                {trip.status}
              </Badge>
              {hasAtRisk && (
                <Badge variant="danger" size="md" dot>
                  Trip At Risk 🔴
                </Badge>
              )}
            </div>
            <p className="text-xs text-surface-500 flex items-center gap-2">
              <span>Trip ID: #{trip.id}</span>
              <span>•</span>
              <span>Traveler: {trip.travelerEmail}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-surface-100">
            <div className="px-4 py-2 bg-surface-50 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-surface-400 block">Dates</span>
              <span className="text-sm font-bold text-surface-900 flex items-center gap-1.5 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-primary-500" />
                {trip.startDate} → {trip.endDate}
              </span>
            </div>

            <div className="px-4 py-2 bg-surface-50 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-surface-400 block">Total Budget</span>
              <span className="text-sm font-bold text-surface-900 flex items-center gap-1.5 mt-0.5">
                <Wallet className="h-3.5 w-3.5 text-emerald-600" />
                {formatCurrency(trip.budget)}
              </span>
            </div>

            <div className="px-4 py-2 bg-surface-50 rounded-xl">
              <span className="text-[10px] uppercase font-semibold text-surface-400 block">Components</span>
              <span className="text-sm font-bold text-surface-900 block mt-0.5">
                {trip.components?.length || 6} items booked
              </span>
            </div>
          </div>
        </div>

        {/* At Risk Alert Banner */}
        {hasAtRisk && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-900">
                  Disruption Detected in this Itinerary
                </p>
                <p className="text-xs text-red-700">
                  One or more components are cancelled or flagged at risk due to dependency failure.
                </p>
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={Zap}
              onClick={() => navigate('/operator/adapt')}
            >
              Resolve in Adapt Engine
            </Button>
          </div>
        )}
      </motion.div>

      {/* ─── Connected Travel Components Flow ─── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-surface-900 tracking-tight">
            Trip Component Breakdown &amp; Dependency Chain
          </h2>
          <p className="text-xs text-surface-500 mt-0.5">
            Components are linked through Itinera’s intelligent dependency graph.
          </p>
        </div>

        <div className="space-y-8">
          {dayGroups.map(([day, components]) => (
            <div key={day} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
                  {day}
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-surface-700">
                  Day {day} Itinerary
                </h3>
              </div>

              <div className="space-y-3 pl-3 sm:pl-4 border-l-2 border-primary-200/80 ml-3">
                {components.map((component, idx) => {
                  const isCancelled = component.status === 'Cancelled';
                  const isRisk = component.status === 'At Risk';

                  return (
                    <div key={component.id} className="space-y-2">
                      {/* Individual Component Card */}
                      <div
                        className={`
                          p-4 rounded-xl border transition-all bg-white
                          ${isCancelled
                            ? 'border-red-400 bg-red-50/20'
                            : isRisk
                            ? 'border-amber-400 bg-amber-50/20'
                            : 'border-surface-200 hover:border-surface-300'
                          }
                        `}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl mt-0.5">{component.emoji || '📌'}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                                  {component.type}
                                </span>
                                <h4 className="text-sm font-bold text-surface-900">
                                  {component.name}
                                </h4>
                              </div>
                              <p className="text-xs text-surface-500 mt-1 flex items-center gap-2 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-surface-400" />
                                  {component.time}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-surface-400" />
                                  {component.location}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-surface-100">
                            <span className="text-sm font-bold text-surface-900">
                              {formatCurrency(component.cost)}
                            </span>
                            <div className="mt-1">
                              <Badge
                                variant={
                                  isCancelled
                                    ? 'danger'
                                    : isRisk
                                    ? 'warning'
                                    : 'success'
                                }
                                size="sm"
                                dot
                              >
                                {component.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Extra Metadata Row */}
                        <div className="mt-3 pt-3 border-t border-surface-100/80 flex flex-wrap items-center justify-between gap-2 text-xs text-surface-500">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-surface-400" />
                            <span>Vendor: </span>
                            <span className="font-semibold text-surface-700">{component.vendor}</span>
                          </div>

                          {component.dependencyLabel && (
                            <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              <span>Dependencies: </span>
                              <span className="font-semibold text-primary-700">{component.dependencyLabel}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Visual Flow Connector Arrow */}
                      {idx < components.length - 1 && (
                        <div className="flex items-center justify-center py-1 text-primary-400">
                          <ArrowDown className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
