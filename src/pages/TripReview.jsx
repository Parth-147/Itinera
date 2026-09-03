import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Dna } from 'lucide-react';
import Button from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import Textarea from '../components/ui/Textarea';
import { useTrip } from '../context/TripContext';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
};

const categories = [
  { key: 'accommodation', label: 'Accommodation', emoji: '🏨' },
  { key: 'transport', label: 'Transport', emoji: '✈️' },
  { key: 'activities', label: 'Activities', emoji: '🏄' },
  { key: 'food', label: 'Food', emoji: '🍽️' },
];

export default function TripReview() {
  const navigate = useNavigate();
  const { trip, submitReview, reviewSubmitted } = useTrip();
  const [ratings, setRatings] = useState({
    accommodation: 0,
    transport: 0,
    activities: 0,
    food: 0,
  });
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = () => {
    submitReview(ratings);
  };

  // Success state
  if (reviewSubmitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <motion.div initial="hidden" animate="visible">
          <motion.div variants={fadeUp} custom={0}>
            <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="text-2xl font-bold text-surface-900 mb-2">
            Trip DNA updated
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-surface-500 mb-6">
            Your future recommendations will now be more personalized.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/trip-dna')} icon={Dna}>
              View Trip DNA
            </Button>
            <Button variant="ghost" onClick={() => navigate('/trip/trip-1')}>
              Back to Trip
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 lg:px-8 py-10">
      <motion.div initial="hidden" animate="visible">
        <motion.h1 variants={fadeUp} custom={0} className="text-2xl font-bold text-surface-900 mb-1">
          How was your trip?
        </motion.h1>
        <motion.p variants={fadeUp} custom={1} className="text-surface-500 mb-8">
          {trip ? `Your trip to ${trip.destination}` : 'Rate your experience'}
        </motion.p>

        {/* Rating categories */}
        <motion.div variants={fadeUp} custom={2} className="space-y-5 mb-8">
          {categories.map((cat) => (
            <div key={cat.key} className="flex items-center justify-between bg-white border border-surface-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-sm font-medium text-surface-900">{cat.label}</span>
              </div>
              <StarRating
                value={ratings[cat.key]}
                onChange={(v) => setRatings((p) => ({ ...p, [cat.key]: v }))}
              />
            </div>
          ))}
        </motion.div>

        {/* Review text */}
        <motion.div variants={fadeUp} custom={3} className="mb-8">
          <Textarea
            label="Share your experience (optional)"
            placeholder="What did you love? What could be better?"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </motion.div>

        {/* Submit */}
        <motion.div variants={fadeUp} custom={4}>
          <Button
            fullWidth
            size="lg"
            icon={Dna}
            onClick={handleSubmit}
            disabled={Object.values(ratings).every((r) => r === 0)}
          >
            Update My Trip DNA
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
