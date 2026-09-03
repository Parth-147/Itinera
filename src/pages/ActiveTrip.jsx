import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Wallet, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ComponentCard from '../components/shared/ComponentCard';
import { useTrip } from '../context/TripContext';
import { formatCurrency, calculateSubtotal } from '../utils/costCalculator';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function ActiveTrip() {
  const navigate = useNavigate();
  const { trip, itinerary, disruption, triggerDisruption, resolved } = useTrip();

  const dayGroups = useMemo(() => {
    const groups = {};
    itinerary.forEach((c) => {
      if (!groups[c.day]) groups[c.day] = [];
      groups[c.day].push(c);
    });
    return Object.entries(groups).sort(([a], [b]) => a - b);
  }, [itinerary]);

  if (!trip) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-surface-500 mb-4">No active trip.</p>
        <Button onClick={() => navigate('/trip-builder')}>Plan a Trip</Button>
      </div>
    );
  }

  const hasDisruption = !!disruption;
  const allConfirmed = itinerary.every((c) => c.status === 'confirmed');

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
      {/* Trip Overview */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 tracking-tight mb-4">
          Trip to {trip.destination}
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-surface-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-surface-400 mb-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Destination</span>
            </div>
            <p className="text-sm font-semibold text-surface-900">{trip.destination}</p>
          </div>
          <div className="bg-white border border-surface-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-surface-400 mb-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Dates</span>
            </div>
            <p className="text-sm font-semibold text-surface-900">{trip.startDate} — {trip.endDate}</p>
          </div>
          <div className="bg-white border border-surface-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-surface-400 mb-1">
              <Wallet className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Total</span>
            </div>
            <p className="text-sm font-semibold text-surface-900">
              {formatCurrency(calculateSubtotal(itinerary))}
            </p>
          </div>
          <div className="bg-white border border-surface-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-surface-400 mb-1">
              {allConfirmed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              )}
              <span className="text-xs font-medium">Status</span>
            </div>
            <Badge variant={allConfirmed ? 'success' : 'warning'} size="sm" dot>
              {allConfirmed ? 'All confirmed' : 'Disruption detected'}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Disruption Alert Banner */}
      {hasDisruption && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <p className="text-sm font-semibold text-red-800">Trip disruption detected</p>
              <p className="text-xs text-red-600">{disruption.description}</p>
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={Zap}
            onClick={() => navigate(`/trip/trip-1/adapt`)}
          >
            View Adapt Engine
          </Button>
        </motion.div>
      )}

      {/* Resolved Banner */}
      {resolved && !hasDisruption && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">Disruption resolved</p>
            <p className="text-xs text-emerald-600">Your itinerary has been updated.</p>
          </div>
        </motion.div>
      )}

      {/* Day-wise Components */}
      <div className="space-y-6 mb-8">
        {dayGroups.map(([day, components]) => (
          <div key={day}>
            <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">
              Day {day}
            </h2>
            <div className="space-y-3">
              {components.map((comp) => (
                <ComponentCard key={comp.id} component={comp} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Demo Controls */}
      <div className="bg-surface-100 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-surface-700 mb-1">Demo Controls</h3>
        <p className="text-xs text-surface-500 mb-4">
          Simulate disruptions to see the Adapt Engine in action.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={AlertTriangle}
            onClick={() => triggerDisruption('goa-transfer-arrival')}
            disabled={hasDisruption}
          >
            Simulate Disruption
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/trip/trip-1/review')}
          >
            Write Review
          </Button>
        </div>
      </div>
    </div>
  );
}
