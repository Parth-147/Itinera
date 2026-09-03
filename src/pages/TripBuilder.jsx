import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Badge from '../components/ui/Badge';
import { useTrip } from '../context/TripContext';
import { tripBuilderOptions } from '../data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

export default function TripBuilder() {
  const navigate = useNavigate();
  const { generateTrip } = useTrip();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    accommodation: 'premium',
    transport: 'flight',
    interests: [],
    travelStyle: 'balanced',
    freeText: '',
  });

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const toggleInterest = (interest) => {
    setForm((p) => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter((i) => i !== interest)
        : [...p.interests, interest],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.destination.trim()) e.destination = 'Destination is required';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.endDate) e.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.endDate < form.startDate) e.endDate = 'Must be after start date';
    if (!form.budget || Number(form.budget) <= 0) e.budget = 'Enter a valid budget';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    generateTrip(form);
    setLoading(false);
    navigate('/itinerary');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10">
      <motion.div initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={fadeUp} custom={0} className="mb-8">
          <Badge variant="primary" size="lg" className="mb-3">
            <Sparkles className="h-3 w-3" />
            AI-Powered
          </Badge>
          <h1 className="text-3xl font-bold text-surface-900 tracking-tight mb-2">
            Plan your trip
          </h1>
          <p className="text-surface-500">
            Tell us where you want to go and how you like to travel.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* Destination */}
          <motion.div variants={fadeUp} custom={1} className="mb-6">
            <Input
              label="Destination"
              placeholder="e.g. Goa, Manali, Kerala"
              icon={MapPin}
              value={form.destination}
              onChange={(e) => set('destination', e.target.value)}
              error={errors.destination}
            />
          </motion.div>

          {/* Dates */}
          <motion.div variants={fadeUp} custom={2} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Input
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              error={errors.startDate}
            />
            <Input
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(e) => set('endDate', e.target.value)}
              error={errors.endDate}
            />
          </motion.div>

          {/* Budget */}
          <motion.div variants={fadeUp} custom={3} className="mb-6">
            <Input
              label="Budget (₹)"
              type="number"
              placeholder="30000"
              value={form.budget}
              onChange={(e) => set('budget', e.target.value)}
              error={errors.budget}
            />
          </motion.div>

          {/* Accommodation + Transport */}
          <motion.div variants={fadeUp} custom={4} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Select
              label="Accommodation"
              options={tripBuilderOptions.accommodationTypes}
              value={form.accommodation}
              onChange={(e) => set('accommodation', e.target.value)}
            />
            <Select
              label="Transport"
              options={tripBuilderOptions.transportTypes}
              value={form.transport}
              onChange={(e) => set('transport', e.target.value)}
            />
          </motion.div>

          {/* Interests */}
          <motion.div variants={fadeUp} custom={5} className="mb-6">
            <p className="text-sm font-medium text-surface-700 mb-2">Interests</p>
            <div className="flex flex-wrap gap-2">
              {tripBuilderOptions.interests.map((interest) => {
                const active = form.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3.5 py-1.5 text-sm font-medium rounded-full border transition-all cursor-pointer ${
                      active
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Travel Style */}
          <motion.div variants={fadeUp} custom={6} className="mb-6">
            <p className="text-sm font-medium text-surface-700 mb-2">Travel Style</p>
            <div className="flex gap-3">
              {tripBuilderOptions.travelStyles.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => set('travelStyle', style.value)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                    form.travelStyle === style.value
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Free text */}
          <motion.div variants={fadeUp} custom={7} className="mb-8">
            <Textarea
              label="Describe your dream trip (optional)"
              placeholder="I want a relaxed Goa trip with beaches, great food and some adventure."
              value={form.freeText}
              onChange={(e) => set('freeText', e.target.value)}
              hint="Our AI uses this to personalize your itinerary"
            />
          </motion.div>

          {/* Submit */}
          <motion.div variants={fadeUp} custom={8}>
            <Button
              type="submit"
              size="xl"
              fullWidth
              loading={loading}
              icon={Sparkles}
            >
              {loading ? 'Generating your trip...' : 'Generate My Trip'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
