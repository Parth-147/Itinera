import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Wallet, User, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ComponentCard from '../components/shared/ComponentCard';
import { operatorTours, goaComponents } from '../data/mockData';
import { formatCurrency, calculateSubtotal } from '../utils/costCalculator';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
};

const paymentBadge = { Paid: 'success', Pending: 'warning' };
const statusBadge = { Active: 'primary', 'At Risk': 'danger', Completed: 'success' };

export default function OperatorTourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const tour = operatorTours.find((t) => t.id === id) || operatorTours[0];
  // Use Goa components for all tours (prototype)
  const components = goaComponents;

  const dayGroups = useMemo(() => {
    const groups = {};
    components.forEach((c) => {
      if (!groups[c.day]) groups[c.day] = [];
      groups[c.day].push(c);
    });
    return Object.entries(groups).sort(([a], [b]) => a - b);
  }, [components]);

  const isAtRisk = tour.risk === 'high';

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
      <motion.div initial="hidden" animate="visible">
        {/* Back link */}
        <motion.div variants={fadeUp} custom={0} className="mb-6">
          <button
            onClick={() => navigate('/operator')}
            className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </motion.div>

        {/* Tour header */}
        <motion.div variants={fadeUp} custom={1} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
              Tour: {tour.destination}
            </h1>
            <Badge variant={statusBadge[tour.status] || 'default'} size="lg">
              {tour.status}
            </Badge>
          </div>
        </motion.div>

        {/* Info grid */}
        <motion.div variants={fadeUp} custom={2} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-surface-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-surface-400 mb-1">
              <User className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Traveler</span>
            </div>
            <p className="text-sm font-semibold text-surface-900">{tour.travelerName}</p>
            <p className="text-xs text-surface-400">{tour.travelerEmail}</p>
          </div>
          <div className="bg-white border border-surface-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-surface-400 mb-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Dates</span>
            </div>
            <p className="text-sm font-semibold text-surface-900">{tour.startDate} – {tour.endDate}</p>
          </div>
          <div className="bg-white border border-surface-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-surface-400 mb-1">
              <Wallet className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Total Cost</span>
            </div>
            <p className="text-sm font-semibold text-surface-900">{formatCurrency(tour.totalCost)}</p>
          </div>
          <div className="bg-white border border-surface-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-surface-400 mb-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Booking</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={paymentBadge[tour.payment] || 'default'} size="sm">
                {tour.payment}
              </Badge>
              <Badge variant={tour.bookingStatus === 'Confirmed' ? 'success' : 'warning'} size="sm">
                {tour.bookingStatus}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Disruption Alert */}
        {isAtRisk && (
          <motion.div
            variants={fadeUp}
            custom={3}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800">Disruption Alert</p>
                <p className="text-xs text-red-600">
                  A component in this tour has been flagged as at risk.
                </p>
              </div>
            </div>
            <Button variant="danger" size="sm">
              Manage Disruption
            </Button>
          </motion.div>
        )}

        {/* Component Breakdown */}
        <motion.div variants={fadeUp} custom={4}>
          <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">
            Component Breakdown
          </h2>
          <div className="space-y-6">
            {dayGroups.map(([day, comps]) => (
              <div key={day}>
                <h3 className="text-xs font-medium text-surface-400 mb-2">Day {day}</h3>
                <div className="space-y-3">
                  {comps.map((comp) => (
                    <ComponentCard key={comp.id} component={comp} compact />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
