import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Zap,
  CheckCircle2,
  Clock,
  Star,
  Dna,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Eye,
  Building2,
  Compass,
  Check,
} from 'lucide-react';
import { useOperator } from '../context/OperatorContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/costCalculator';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function OperatorAdapt() {
  const navigate = useNavigate();
  const { trips, activeDisruption, triggerDisruption, resolveDisruption, adaptationHistory } =
    useOperator();

  // Simulation form states
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || 'trip-rahul');
  const [selectedComponentId, setSelectedComponentId] = useState('rahul-scuba');
  const [disruptionType, setDisruptionType] = useState('Activity Cancellation');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResolution, setLastResolution] = useState(adaptationHistory[0] || null);

  // Components available for the currently chosen trip
  const currentTrip = useMemo(() => {
    return trips.find((t) => t.id === selectedTripId) || trips[0];
  }, [trips, selectedTripId]);

  const availableComponents = useMemo(() => {
    return (
      currentTrip?.components || [
        { id: 'rahul-scuba', name: 'Scuba Diving', type: 'Activity', cost: 2500 },
        { id: 'rahul-transfer-1', name: 'Airport Cab Transfer', type: 'Transport', cost: 900 },
        { id: 'rahul-hotel', name: 'Sea View Resort Check-in', type: 'Stay', cost: 11000 },
      ]
    );
  }, [currentTrip]);

  const disruptionTypes = [
    'Activity Cancellation',
    'Vendor Cancellation',
    'Transport Delay',
    'Hotel Unavailable',
  ];

  const handleTrigger = (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setLastResolution(null);

    // Simulate real-time dependency analysis
    setTimeout(() => {
      triggerDisruption(selectedTripId, selectedComponentId, disruptionType);
      setIsAnalyzing(false);
    }, 700);
  };

  const handleSelectAlternative = (altId) => {
    const res = resolveDisruption(altId);
    setLastResolution(res);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ─── Page Title Header ─── */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            <Zap className="h-3 w-3" />
            Adapt Engine
          </Badge>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Intelligent Recovery
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900 mt-2">
          Disruption &amp; Adapt
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Monitor disruptions and automatically recover affected itineraries using dependency graph traversal and Trip DNA ranking.
        </p>
      </div>

      {/* ─── Disruption Simulation Control Center ─── */}
      <Card variant="default" padding="lg" className="border-primary-200/80 shadow-soft">
        <div className="flex items-center justify-between pb-4 border-b border-surface-100">
          <div>
            <h2 className="text-base font-bold text-surface-900 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary-600" />
              Trigger Disruption Simulation
            </h2>
            <p className="text-xs text-surface-500 mt-0.5">
              Simulate vendor delays, cancellations, or closures to demonstrate Itinera’s downstream impact detection.
            </p>
          </div>
          <Badge variant="outline" size="sm">
            Demo Control
          </Badge>
        </div>

        <form onSubmit={handleTrigger} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Select Trip */}
            <div>
              <label className="text-xs font-bold text-surface-700 uppercase tracking-wider block mb-1.5">
                Select Trip
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => {
                  setSelectedTripId(e.target.value);
                  const trip = trips.find((t) => t.id === e.target.value);
                  if (trip?.components?.length > 0) {
                    setSelectedComponentId(trip.components[0].id);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.travelerName} — {t.destination} ({formatCurrency(t.budget)})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Component */}
            <div>
              <label className="text-xs font-bold text-surface-700 uppercase tracking-wider block mb-1.5">
                Select Component
              </label>
              <select
                value={selectedComponentId}
                onChange={(e) => setSelectedComponentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {availableComponents.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji || '📌'} {c.name} ({formatCurrency(c.cost)})
                  </option>
                ))}
              </select>
            </div>

            {/* Disruption Type */}
            <div>
              <label className="text-xs font-bold text-surface-700 uppercase tracking-wider block mb-1.5">
                Disruption Type
              </label>
              <select
                value={disruptionType}
                onChange={(e) => setDisruptionType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {disruptionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="danger"
              size="md"
              loading={isAnalyzing}
              icon={AlertTriangle}
            >
              {isAnalyzing ? 'Analyzing Dependency Graph...' : 'Trigger Disruption'}
            </Button>
          </div>
        </form>
      </Card>

      {/* ─── Disruption Event & Impact Analysis Section ─── */}
      <AnimatePresence mode="wait">
        {activeDisruption && (
          <motion.div
            key="active-disruption-view"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeUp}
            className="space-y-6"
          >
            {/* Highly Visible Alert Header */}
            <div className="p-5 rounded-2xl bg-red-500/10 border-2 border-red-500/40 text-red-950 space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-950">
                    Trip At Risk: {activeDisruption.componentName} has been cancelled.
                  </h3>
                  <p className="text-xs text-red-700">
                    Traveler: <span className="font-semibold">{activeDisruption.travelerName}</span> • Destination: <span className="font-semibold">{activeDisruption.destination}</span> • Incident: {activeDisruption.disruptionType}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-red-200/60 flex items-center gap-2 text-xs font-medium text-red-800">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-red-600" />
                <span>Itinera Adapt Engine is evaluating downstream itinerary dependencies...</span>
              </div>
            </div>

            {/* Downstream Affected Components Panel */}
            <Card variant="default" padding="lg" className="border-amber-300 bg-amber-50/15">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-surface-900 flex items-center gap-2">
                    <span className="text-lg">🧬</span>
                    Downstream Dependency Impact Analysis
                  </h3>
                  <p className="text-xs text-surface-500 mt-0.5">
                    Itinera identified connected components via <code className="bg-surface-100 px-1 py-0.5 rounded text-primary-700">dependsOn[]</code> graph relations:
                  </p>
                </div>
                <Badge variant="warning" size="sm">
                  {activeDisruption.affectedComponents?.length || 3} Affected Items
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeDisruption.affectedComponents.map((comp) => {
                  const isCancelled = comp.status === 'Cancelled' || comp.name === activeDisruption.componentName;
                  return (
                    <div
                      key={comp.id || comp.name}
                      className={`p-4 rounded-xl border ${
                        isCancelled
                          ? 'border-red-300 bg-red-50/50'
                          : 'border-amber-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{comp.emoji || '📌'}</span>
                        <Badge variant={isCancelled ? 'danger' : 'warning'} size="sm" dot>
                          {isCancelled ? 'Cancelled' : 'At Risk'}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-surface-900">{comp.name}</h4>
                      <p className="text-xs text-surface-500 mt-1">
                        {isCancelled
                          ? 'Primary disruption source.'
                          : 'Depends on prior schedule; invalid without replacement.'}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-white/80 rounded-lg border border-amber-200 text-xs text-amber-900">
                <span className="font-bold">Operations Notice: </span>
                Rather than simply deleting the cancelled activity, Itinera searches verified alternative vendors with matching time slots to rescue downstream dining and transfers.
              </div>
            </Card>

            {/* ─── Recommended Alternatives (Ranked) ─── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-surface-900">
                    Recommended Alternatives
                  </h3>
                  <p className="text-xs text-surface-500">
                    Algorithmically scored using: Cost Fit + Time Alignment + Vendor Rating + Trip DNA Match.
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                  Ranked by Adapt Engine
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {activeDisruption.alternatives.map((alt) => {
                  const isCheaper = alt.costDelta < 0;
                  return (
                    <div
                      key={alt.id}
                      className={`
                        bg-white border rounded-2xl p-6 transition-all shadow-xs flex flex-col justify-between
                        ${alt.rank === 1
                          ? 'border-primary-400 ring-2 ring-primary-500/20 shadow-soft'
                          : 'border-surface-200 hover:border-surface-300'
                        }
                      `}
                    >
                      <div>
                        {/* Header Rank Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant={alt.rank === 1 ? 'primary' : 'default'}
                            size="md"
                          >
                            #{alt.rank} {alt.rank === 1 ? 'Best Match' : 'Alternative'}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                            <Dna className="h-3.5 w-3.5 text-purple-600" />
                            <span>{alt.tripFit}% DNA Fit</span>
                          </div>
                        </div>

                        {/* Title & Emoji */}
                        <div className="flex items-start gap-3 mb-4">
                          <span className="text-3xl mt-0.5">{alt.emoji}</span>
                          <div>
                            <h4 className="text-base font-bold text-surface-900 leading-tight">
                              {alt.name}
                            </h4>
                            <p className="text-xs text-surface-500 mt-0.5">
                              {alt.vendor} • {alt.location}
                            </p>
                          </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-2 p-3 bg-surface-50 rounded-xl mb-4 text-center">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-surface-400 block">Cost</span>
                            <span className="text-sm font-bold text-surface-900 block">
                              {formatCurrency(alt.cost)}
                            </span>
                            <span
                              className={`text-[11px] font-semibold flex items-center justify-center gap-0.5 ${
                                isCheaper ? 'text-emerald-600' : 'text-amber-600'
                              }`}
                            >
                              {isCheaper ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                              {alt.costDifferenceText}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-semibold text-surface-400 block">Time Slot</span>
                            <span className="text-xs font-bold text-surface-800 block mt-1">
                              {alt.time}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-semibold text-surface-400 block">Rating</span>
                            <span className="text-xs font-bold text-surface-900 flex items-center justify-center gap-1 mt-1">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              {alt.rating}
                            </span>
                          </div>
                        </div>

                        {/* Why Recommended Explanation */}
                        <div className="mb-5 space-y-1.5">
                          <span className="text-[11px] font-bold text-surface-700 uppercase tracking-wider block">
                            Why recommended?
                          </span>
                          <ul className="space-y-1">
                            {alt.whyRecommended.map((reason, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 text-xs text-surface-600"
                              >
                                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        fullWidth
                        variant={alt.rank === 1 ? 'primary' : 'outline'}
                        size="md"
                        icon={Zap}
                        onClick={() => handleSelectAlternative(alt.id)}
                      >
                        Select Alternative
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Successful Adaptation Banner ─── */}
      <AnimatePresence>
        {lastResolution && !activeDisruption && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500/40 text-emerald-950 space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-emerald-950">
                    Trip Successfully Adapted ✓
                  </h3>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Operations Restored
                  </span>
                </div>
                <p className="text-sm text-emerald-800 font-medium">
                  {lastResolution.oldComponent} → <span className="font-bold">{lastResolution.newComponent}</span>
                </p>
                <p className="text-xs text-emerald-700">
                  Trip cost updated: {formatCurrency(lastResolution.oldBudget)} →{' '}
                  <span className="font-bold">{formatCurrency(lastResolution.newBudget)}</span>
                  {lastResolution.savedAmount > 0 && (
                    <span className="ml-1 font-semibold text-emerald-800">
                      ({formatCurrency(lastResolution.savedAmount)} savings applied)
                    </span>
                  )}
                  . All downstream affected components confirmed.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-200">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/operator/trips/${lastResolution.tripId}`)}
                iconRight={Eye}
              >
                View Updated Trip Itinerary
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/operator/dashboard')}
              >
                Return to Operations Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Adaptation History / Log ─── */}
      {adaptationHistory.length > 0 && (
        <Card variant="default" padding="lg">
          <h3 className="text-sm font-bold uppercase tracking-wider text-surface-700 mb-3">
            Recent Adaptation Operations Log
          </h3>
          <div className="divide-y divide-surface-100">
            {adaptationHistory.map((item, index) => (
              <div key={index} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-surface-900">
                    {item.travelerName} • {item.destination}
                  </p>
                  <p className="text-surface-500">
                    Replaced {item.oldComponent} with {item.newComponent}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-700">
                    Budget: {formatCurrency(item.newBudget)}
                  </p>
                  <p className="text-surface-400 text-[10px]">{item.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
