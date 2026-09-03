import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap, Star, Dna, Clock, Wallet, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ComponentCard from '../components/shared/ComponentCard';
import { useTrip } from '../context/TripContext';
import { formatCurrency } from '../utils/costCalculator';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
};

export default function AdaptEngine() {
  const navigate = useNavigate();
  const {
    trip, itinerary, disruption, affectedIds,
    getDisruptionAlternatives, resolveDisruption, resolved,
  } = useTrip();

  const disruptedComponent = useMemo(() => {
    if (!disruption) return null;
    return itinerary.find((c) => c.id === disruption.affectedComponentId);
  }, [disruption, itinerary]);

  const affectedComponents = useMemo(() => {
    return itinerary.filter((c) => affectedIds.includes(c.id));
  }, [itinerary, affectedIds]);

  const alternatives = useMemo(() => {
    if (!disruption) return [];
    return getDisruptionAlternatives(disruption.affectedComponentId);
  }, [disruption, getDisruptionAlternatives]);

  const handleSelect = (alt) => {
    resolveDisruption(alt);
    // Don't navigate immediately — show success state
  };

  // Already resolved
  if (resolved && !disruption) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <motion.div initial="hidden" animate="visible">
          <motion.div variants={fadeUp} custom={0}>
            <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="text-2xl font-bold text-surface-900 mb-2">
            Disruption resolved
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-surface-500 mb-6">
            Your itinerary has been updated with the selected alternative.
          </motion.p>
          <motion.div variants={fadeUp} custom={3}>
            <Button onClick={() => navigate('/trip/trip-1')} size="lg">
              View Updated Trip
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // No disruption
  if (!disruption) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-surface-500 mb-4">No active disruption.</p>
        <Button onClick={() => navigate('/trip/trip-1')}>Back to Trip</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8">
      <motion.div initial="hidden" animate="visible">
        {/* Alert Header */}
        <motion.div variants={fadeUp} custom={0} className="text-center mb-8">
          <span className="text-5xl mb-4 block">🚨</span>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">
            Trip disruption detected
          </h1>
          <p className="text-surface-500">
            {disruption.description}
          </p>
        </motion.div>

        {/* Affected Components */}
        <motion.div variants={fadeUp} custom={1} className="mb-8">
          <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">
            Affected Components
          </h2>
          <div className="space-y-3">
            {/* The disrupted one */}
            {disruptedComponent && (
              <div className="relative">
                <ComponentCard component={disruptedComponent} />
                <div className="absolute top-3 right-3">
                  <Badge variant="danger" size="sm" dot>Cancelled</Badge>
                </div>
              </div>
            )}
            {/* Downstream at-risk */}
            {affectedComponents.map((comp) => (
              <ComponentCard key={comp.id} component={comp} />
            ))}
          </div>
        </motion.div>

        {/* Ranked Alternatives */}
        <motion.div variants={fadeUp} custom={2} className="mb-8">
          <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">
            Ranked Alternatives
          </h2>
          <div className="space-y-4">
            {alternatives.map((alt) => (
              <motion.div
                key={alt.id}
                variants={fadeUp}
                className={`bg-white border rounded-xl p-5 ${
                  alt.rank === 1
                    ? 'border-primary-300 ring-1 ring-primary-100'
                    : 'border-surface-200'
                }`}
              >
                {/* Rank label */}
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant={alt.rank === 1 ? 'primary' : 'default'}
                    size="sm"
                  >
                    #{alt.rank} {alt.label}
                  </Badge>
                  {alt.rank === 1 && (
                    <span className="text-xs text-primary-600 font-medium">Recommended</span>
                  )}
                </div>

                {/* Component info */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">{alt.emoji}</span>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-surface-900">
                      {alt.name}
                    </h3>
                    <p className="text-sm text-surface-500">{alt.description}</p>
                    <p className="text-xs text-surface-400 mt-1">{alt.vendor} · {alt.location}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-surface-50 rounded-lg p-2.5 text-center">
                    <Wallet className="h-3.5 w-3.5 text-surface-400 mx-auto mb-1" />
                    <p className="text-xs text-surface-500">Cost</p>
                    <p className="text-sm font-semibold text-surface-900">
                      {formatCurrency(alt.cost)}
                    </p>
                  </div>
                  <div className="bg-surface-50 rounded-lg p-2.5 text-center">
                    <Star className="h-3.5 w-3.5 text-amber-400 mx-auto mb-1" />
                    <p className="text-xs text-surface-500">Rating</p>
                    <p className="text-sm font-semibold text-surface-900">
                      {alt.rating}
                    </p>
                  </div>
                  <div className="bg-surface-50 rounded-lg p-2.5 text-center">
                    <Dna className="h-3.5 w-3.5 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs text-surface-500">DNA Match</p>
                    <p className="text-sm font-semibold text-surface-900">
                      {alt.tripDnaMatch}%
                    </p>
                  </div>
                  <div className="bg-surface-50 rounded-lg p-2.5 text-center">
                    <Clock className="h-3.5 w-3.5 text-surface-400 mx-auto mb-1" />
                    <p className="text-xs text-surface-500">Time</p>
                    <p className="text-sm font-semibold text-surface-900">
                      {alt.timeImpact}
                    </p>
                  </div>
                </div>

                {/* Impact badges */}
                <div className="flex gap-2 mb-4">
                  <Badge
                    variant={alt.costImpact.startsWith('+') ? 'warning' : 'success'}
                    size="sm"
                  >
                    Cost: {alt.costImpact}
                  </Badge>
                  <Badge variant="default" size="sm">
                    Time: {alt.timeImpact}
                  </Badge>
                </div>

                {/* Reason */}
                <div className="bg-primary-50/50 rounded-lg p-3 mb-4">
                  <p className="text-xs font-medium text-primary-700 mb-1">Why this is recommended</p>
                  <p className="text-xs text-primary-600">{alt.reason}</p>
                </div>

                {/* Select */}
                <Button
                  fullWidth
                  variant={alt.rank === 1 ? 'primary' : 'outline'}
                  icon={Zap}
                  onClick={() => handleSelect(alt)}
                >
                  Select Alternative
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
