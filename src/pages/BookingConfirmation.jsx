import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PartyPopper, ArrowRight, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useTrip } from '../context/TripContext';
import { formatCurrency, calculateSubtotal } from '../utils/costCalculator';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

export default function BookingConfirmation() {
  const { trip, itinerary } = useTrip();

  if (!trip) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-surface-500 mb-4">No booking found.</p>
        <Link to="/trip-builder"><Button>Plan a Trip</Button></Link>
      </div>
    );
  }

  // Group by type for booking cards
  const stays = itinerary.filter((c) => c.type === 'stay');
  const transport = itinerary.filter((c) => c.type === 'transport');
  const activities = itinerary.filter((c) => c.type === 'activity');

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-8 py-12">
      <motion.div initial="hidden" animate="visible" className="text-center mb-10">
        <motion.div variants={fadeUp} custom={0} className="text-5xl mb-4">🎉</motion.div>
        <motion.h1 variants={fadeUp} custom={1} className="text-2xl font-bold text-surface-900 mb-2">
          Your Itinera trip is ready!
        </motion.h1>
        <motion.div variants={fadeUp} custom={2} className="flex items-center justify-center gap-2 text-surface-500 mb-1">
          <MapPin className="h-4 w-4" />
          <span className="font-medium text-surface-900">{trip.destination}</span>
        </motion.div>
        <motion.p variants={fadeUp} custom={3} className="text-sm text-surface-500">
          {trip.startDate} – {trip.endDate}
        </motion.p>
        <motion.p variants={fadeUp} custom={4} className="text-2xl font-bold text-surface-900 mt-3">
          {formatCurrency(calculateSubtotal(itinerary))}
        </motion.p>
        <motion.div variants={fadeUp} custom={5} className="mt-3">
          <Badge variant="success" size="lg" dot>Confirmed</Badge>
        </motion.div>
      </motion.div>

      {/* Booking breakdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4 mb-8"
      >
        {[
          { label: 'Stay', items: stays, emoji: '🏨' },
          { label: 'Transport', items: transport, emoji: '✈️' },
          { label: 'Activities', items: activities, emoji: '🏄' },
        ].map(
          (group) =>
            group.items.length > 0 && (
              <div key={group.label} className="bg-white border border-surface-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{group.emoji}</span>
                  <h3 className="text-sm font-semibold text-surface-900">
                    {group.label}
                  </h3>
                  <Badge variant="success" size="sm">{group.items.length} booked</Badge>
                </div>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-surface-600">{item.name}</span>
                      <span className="text-surface-900 font-medium">
                        {formatCurrency(item.cost)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ),
        )}
      </motion.div>

      {/* Prototype notice */}
      <div className="text-center mb-6">
        <p className="text-xs text-surface-400 bg-surface-100 inline-block px-3 py-1.5 rounded-full">
          Prototype · Simulated booking · No real charges
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link to="/trip/trip-1">
          <Button size="lg" iconRight={ArrowRight}>
            View My Trip
          </Button>
        </Link>
      </div>
    </div>
  );
}
