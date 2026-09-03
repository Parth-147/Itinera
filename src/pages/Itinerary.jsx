import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ComponentCard from '../components/shared/ComponentCard';
import CostSummary from '../components/shared/CostSummary';
import SwapModal from '../components/shared/SwapModal';
import { useTrip } from '../context/TripContext';
import { formatCurrency, calculateSubtotal } from '../utils/costCalculator';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function Itinerary() {
  const navigate = useNavigate();
  const { trip, itinerary, swapComponent, removeComponent, confirmBooking, getAlternatives } = useTrip();
  const [swapTarget, setSwapTarget] = useState(null);
  const originalTotal = 28450; // original Goa trip total

  // Group components by day
  const dayGroups = useMemo(() => {
    const groups = {};
    itinerary.forEach((c) => {
      if (!groups[c.day]) groups[c.day] = [];
      groups[c.day].push(c);
    });
    return Object.entries(groups).sort(([a], [b]) => a - b);
  }, [itinerary]);

  const handleConfirm = () => {
    confirmBooking();
    navigate('/booking-confirmation');
  };

  if (!trip || itinerary.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-surface-500 mb-4">No itinerary generated yet.</p>
        <Button onClick={() => navigate('/trip-builder')}>Go to Trip Builder</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left: Itinerary ── */}
        <div className="lg:col-span-2">
          {/* Header */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-5 w-5 text-primary-600" />
              <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
                {trip.destination}
              </h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-surface-500">
              <span>{trip.days || 4} Days · {trip.nights || 3} Nights</span>
              <span>·</span>
              <span className="font-semibold text-surface-900">
                {formatCurrency(calculateSubtotal(itinerary))} Estimated
              </span>
            </div>
          </motion.div>

          {/* Day Groups */}
          <div className="space-y-8">
            {dayGroups.map(([day, components]) => (
              <motion.div
                key={day}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">
                  Day {day}
                </h2>
                <div className="space-y-3">
                  {components.map((comp) => (
                    <ComponentCard
                      key={comp.id}
                      component={comp}
                      showActions
                      onSwap={(c) => setSwapTarget(c)}
                      onRemove={(id) => removeComponent(id)}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Right: Sidebar ── */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {/* Trip DNA hint */}
          <div className="flex items-center gap-2 px-4 py-3 bg-purple-50 rounded-xl">
            <span className="text-sm">🧬</span>
            <span className="text-xs font-medium text-purple-700">
              Personalized for your Trip DNA
            </span>
          </div>

          {/* Cost */}
          <CostSummary components={itinerary} originalTotal={originalTotal} />

          {/* Confirm */}
          <Button
            fullWidth
            size="lg"
            icon={Check}
            onClick={handleConfirm}
          >
            Confirm &amp; Book
          </Button>

          <p className="text-xs text-center text-surface-400">
            Prototype · Simulated booking
          </p>
        </div>
      </div>

      {/* Swap Modal */}
      <SwapModal
        isOpen={!!swapTarget}
        onClose={() => setSwapTarget(null)}
        current={swapTarget}
        alternatives={swapTarget ? getAlternatives(swapTarget.id) : []}
        onSelect={(alt) => swapComponent(swapTarget.id, alt)}
      />
    </div>
  );
}
