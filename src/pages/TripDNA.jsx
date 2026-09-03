import { motion } from 'framer-motion';
import { Dna, ArrowDown, Sparkles, TrendingUp, Star } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { useTrip } from '../context/TripContext';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] } }),
};

const activityLabels = {
  adventure: { label: 'Adventure', emoji: '🏄' },
  beaches: { label: 'Beaches', emoji: '🌊' },
  culture: { label: 'Culture', emoji: '🏛️' },
  food: { label: 'Food', emoji: '🍽️' },
  nightlife: { label: 'Nightlife', emoji: '🎉' },
  wildlife: { label: 'Wildlife', emoji: '🦁' },
  temples: { label: 'Temples', emoji: '🛕' },
  shopping: { label: 'Shopping', emoji: '🛍️' },
};

function ProgressBar({ value, color = 'bg-primary-500' }) {
  return (
    <div className="h-2 w-full bg-surface-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

const steps = [
  { icon: Star, label: 'Trip Reviews', description: 'Rate each component after your trip' },
  { icon: TrendingUp, label: 'Preference Analysis', description: 'AI analyzes your travel patterns' },
  { icon: Dna, label: 'Trip DNA', description: 'Your profile updates automatically' },
  { icon: Sparkles, label: 'Personalized Recs', description: 'Future trips match your style' },
];

export default function TripDNA() {
  const { tripDNA } = useTrip();

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10">
      <motion.div initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={fadeUp} custom={0} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Dna className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
                Your Trip DNA
              </h1>
              <p className="text-sm text-surface-500">
                Your travel preferences evolve with every journey.
              </p>
            </div>
          </div>
          <Badge variant="default" size="sm">
            Based on {tripDNA.tripsCompleted} previous trips
          </Badge>
        </motion.div>

        {/* Overview cards */}
        <motion.div variants={fadeUp} custom={1} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card variant="default" padding="md">
            <p className="text-xs font-medium text-surface-400 mb-1">Accommodation</p>
            <p className="text-lg font-bold text-surface-900">{tripDNA.accommodation.preference}</p>
            <div className="mt-2">
              <ProgressBar value={tripDNA.accommodation.score} color="bg-primary-500" />
              <p className="text-xs text-surface-400 mt-1">{tripDNA.accommodation.score}%</p>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-xs font-medium text-surface-400 mb-1">Budget Sensitivity</p>
            <p className="text-lg font-bold text-surface-900">{tripDNA.budgetSensitivity}%</p>
            <div className="mt-2">
              <ProgressBar value={tripDNA.budgetSensitivity} color="bg-amber-500" />
              <p className="text-xs text-surface-400 mt-1">Moderate</p>
            </div>
          </Card>
          <Card variant="default" padding="md">
            <p className="text-xs font-medium text-surface-400 mb-1">Travel Style</p>
            <p className="text-lg font-bold text-surface-900">{tripDNA.travelStyle}</p>
            <div className="mt-2 flex gap-1">
              {['Budget', 'Balanced', 'Premium'].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full ${
                    s === tripDNA.travelStyle ? 'bg-primary-500' : 'bg-surface-100'
                  }`}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Activity Preferences */}
        <motion.div variants={fadeUp} custom={2} className="mb-10">
          <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">
            Activity Preferences
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(tripDNA.activities)
              .sort(([, a], [, b]) => b - a)
              .map(([key, score]) => {
                const info = activityLabels[key] || { label: key, emoji: '📌' };
                return (
                  <div key={key} className="flex items-center gap-3 bg-white border border-surface-200 rounded-xl p-3.5">
                    <span className="text-lg">{info.emoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-surface-900">{info.label}</span>
                        <span className="text-xs font-semibold text-surface-500">{score}%</span>
                      </div>
                      <ProgressBar
                        value={score}
                        color={score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-primary-500' : 'bg-surface-300'}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>

        {/* How Trip DNA Works */}
        <motion.div variants={fadeUp} custom={3}>
          <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">
            How Trip DNA Works
          </h2>
          <div className="space-y-0">
            {steps.map((step, idx) => (
              <div key={step.label}>
                <div className="flex items-center gap-4 bg-white border border-surface-200 rounded-xl p-4">
                  <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <step.icon className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900">{step.label}</p>
                    <p className="text-xs text-surface-500">{step.description}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="h-4 w-4 text-surface-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
