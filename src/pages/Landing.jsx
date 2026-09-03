import { motion } from 'framer-motion';
import {
  ArrowRight,
  Dna,
  Zap,
  Users,
  MapPin,
  Calendar,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Check,
  X as XIcon,
  Plane,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

/* ═══════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardHover = {
  rest: { y: 0 },
  hover: { y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

/* ═══════════════════════════════════════════
   Section Data
   ═══════════════════════════════════════════ */

const steps = [
  {
    number: '01',
    icon: MapPin,
    title: 'Tell us what you want',
    description: 'Destination, budget, interests and travel style.',
  },
  {
    number: '02',
    icon: Calendar,
    title: 'Build your trip',
    description: 'Itinera creates a day-wise personalized itinerary.',
  },
  {
    number: '03',
    icon: RefreshCw,
    title: 'Adapt when plans change',
    description: 'If something gets cancelled or delayed, Itinera finds alternatives.',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Get better every trip',
    description: 'Your reviews build your Trip DNA and improve future recommendations.',
  },
];

const features = [
  {
    icon: Dna,
    title: 'Trip DNA',
    description:
      'Your travel preferences evolve with every trip. Accommodation style, activity affinities, budget comfort — all captured and applied to future plans.',
    accent: 'bg-purple-50 text-purple-600',
    indicator: 'Preference learning',
  },
  {
    icon: Zap,
    title: 'Adapt Engine',
    description:
      'When plans break, Itinera traces the impact across dependent components and surfaces ranked alternatives — factoring cost, time, rating, and your Trip DNA.',
    accent: 'bg-amber-50 text-amber-600',
    indicator: 'Real-time recovery',
  },
  {
    icon: Users,
    title: 'One Platform',
    description:
      'Travelers plan their trips while operators manage tours, bookings and vendors from one unified platform with shared trip data.',
    accent: 'bg-sky-50 text-sky-600',
    indicator: 'Two-sided',
  },
];

const traditionalItems = [
  'Fixed itinerary',
  'Limited choices',
  'Manual replanning',
  'Generic recommendations',
];

const itineraItems = [
  'Build your own itinerary',
  'Swap individual components',
  'Automatic disruption recovery',
  'Personalized recommendations',
];

const itineraryDays = [
  {
    day: 'Day 1',
    items: [
      { emoji: '✈️', label: 'Flight' },
      { emoji: '🏨', label: 'Premium Stay' },
      { emoji: '🌊', label: 'Beach Experience' },
    ],
  },
  {
    day: 'Day 2',
    items: [
      { emoji: '🏄', label: 'Adventure Activity' },
      { emoji: '🍽️', label: 'Local Dining' },
    ],
  },
  {
    day: 'Day 3',
    items: [
      { emoji: '🌅', label: 'Sightseeing' },
      { emoji: '✈️', label: 'Return' },
    ],
  },
];

/* ═══════════════════════════════════════════
   Landing Page
   ═══════════════════════════════════════════ */

export default function Landing() {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ComparisonSection />
      <FinalCTASection />
    </div>
  );
}

/* ─────────────────────────────────────────
   1. HERO
   ───────────────────────────────────────── */

function HeroSection() {
  return (
    <section id="explore" className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary-50/70 blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-[350px] h-[350px] rounded-full bg-accent-50/50 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left: Copy ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="primary" size="lg" className="mb-5">
                <Sparkles className="h-3 w-3" />
                AI-Powered Travel Planning
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-900 tracking-tight leading-[1.1]"
            >
              Your journey.
              <br />
              <span className="text-primary-600">Your way.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-5 text-lg text-surface-500 leading-relaxed max-w-lg"
            >
              Build trips around your preferences, not predefined packages.
              Itinera creates personalized itineraries and adapts them when
              your plans change.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/login">
                <Button size="lg" iconRight={ArrowRight}>
                  Plan My Trip
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="secondary" size="lg">
                  See How It Works
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right: Itinerary Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateZ: 1 }}
            animate={{ opacity: 1, x: 0, rotateZ: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <ItineraryCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Itinerary Preview Card ── */

function ItineraryCard() {
  return (
    <div className="w-full max-w-sm">
      <Card variant="elevated" padding="none" className="overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-primary-200 uppercase tracking-wider mb-1">
                Trip to
              </p>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Goa
              </h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-primary-200">3 days</p>
              <p className="text-lg font-bold text-white">₹24,800</p>
            </div>
          </div>
        </div>

        {/* Days */}
        <div className="px-6 py-5 space-y-4">
          {itineraryDays.map((day) => (
            <div key={day.day}>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
                {day.day}
              </p>
              <div className="space-y-1.5">
                {day.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 py-1"
                  >
                    <span className="text-base leading-none">{item.emoji}</span>
                    <span className="text-sm text-surface-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Personalization indicator */}
        <div className="px-6 pb-5">
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
            <span className="text-sm leading-none">🧬</span>
            <span className="text-xs font-medium text-purple-700">
              Personalized for you
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────
   2. HOW IT WORKS
   ───────────────────────────────────────── */

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="text-center max-w-xl mx-auto mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold text-primary-600 mb-2"
          >
            How It Works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight"
          >
            From idea to itinerary
          </motion.h2>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, idx) => (
            <motion.div key={step.number} variants={fadeUp} custom={idx}>
              <motion.div
                variants={cardHover}
                initial="rest"
                whileHover="hover"
              >
                <Card variant="default" padding="md" className="h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-3xl font-bold text-primary-100 leading-none select-none">
                      {step.number}
                    </span>
                    <div className="h-9 w-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <step.icon className="h-4.5 w-4.5 text-primary-600" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-surface-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-surface-500 leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   3. CORE FEATURES
   ───────────────────────────────────────── */

function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 bg-surface-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="text-center max-w-xl mx-auto mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold text-primary-600 mb-2"
          >
            Core Features
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight"
          >
            Built for intelligent travel
          </motion.h2>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeUp}>
              <motion.div
                variants={cardHover}
                initial="rest"
                whileHover="hover"
              >
                <Card variant="default" padding="lg" className="h-full">
                  {/* Icon */}
                  <div
                    className={`h-11 w-11 rounded-xl ${feature.accent.split(' ')[0]} flex items-center justify-center mb-5`}
                  >
                    <feature.icon className={`h-5 w-5 ${feature.accent.split(' ')[1]}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-surface-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-surface-500 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Indicator */}
                  <Badge variant="default" size="sm">
                    {feature.indicator}
                  </Badge>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   4. COMPARISON — FLEXIBLE TRAVEL
   ───────────────────────────────────────── */

function ComparisonSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="text-center max-w-xl mx-auto mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold text-primary-600 mb-2"
          >
            Built for Flexible Travel
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight"
          >
            Not a package. A platform.
          </motion.h2>
        </motion.div>

        {/* Comparison cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          {/* Traditional */}
          <motion.div variants={fadeUp}>
            <Card variant="default" padding="lg" className="h-full border-surface-100">
              <h3 className="text-base font-semibold text-surface-400 mb-6">
                Traditional Package
              </h3>
              <ul className="space-y-3.5">
                {traditionalItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                      <XIcon className="h-3 w-3 text-red-400" />
                    </div>
                    <span className="text-sm text-surface-500">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>

          {/* Itinera */}
          <motion.div variants={fadeUp}>
            <Card
              variant="default"
              padding="lg"
              className="h-full border-primary-200 ring-1 ring-primary-100"
            >
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-base font-semibold text-surface-900">
                  Itinera
                </h3>
                <Badge variant="primary" size="sm">Better</Badge>
              </div>
              <ul className="space-y-3.5">
                {itineraItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-sm text-surface-900 font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   5. FINAL CTA
   ───────────────────────────────────────── */

function FinalCTASection() {
  return (
    <section className="py-24 md:py-32 bg-surface-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight leading-snug"
          >
            Your next trip shouldn&apos;t be a package.
            <br />
            <span className="text-primary-600">It should be yours.</span>
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-8">
            <Link to="/login">
              <Button size="lg" iconRight={ChevronRight}>
                Start Planning
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
