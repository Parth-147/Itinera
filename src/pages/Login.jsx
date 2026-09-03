import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Plane, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }),
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    navigate(role === 'operator' ? '/operator' : '/trip-builder');
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg text-center"
      >
        {/* Logo */}
        <motion.div variants={fadeUp} custom={0} className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-surface-900">
            itinera
          </span>
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} className="text-2xl font-bold text-surface-900 mb-2">
          Welcome
        </motion.h1>
        <motion.p variants={fadeUp} custom={2} className="text-surface-500 mb-8">
          Choose how you want to use Itinera
        </motion.p>

        <motion.div variants={fadeUp} custom={3} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Traveler */}
          <button onClick={() => handleLogin('traveler')} className="text-left cursor-pointer">
            <Card variant="default" padding="lg" hover className="h-full">
              <div className="h-11 w-11 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                <Plane className="h-5 w-5 text-primary-600" />
              </div>
              <h3 className="text-base font-semibold text-surface-900 mb-1">
                Traveler
              </h3>
              <p className="text-sm text-surface-500">
                Plan trips, build itineraries and adapt on the go.
              </p>
            </Card>
          </button>

          {/* Operator */}
          <button onClick={() => handleLogin('operator')} className="text-left cursor-pointer">
            <Card variant="default" padding="lg" hover className="h-full">
              <div className="h-11 w-11 rounded-xl bg-surface-100 flex items-center justify-center mb-4">
                <LayoutDashboard className="h-5 w-5 text-surface-600" />
              </div>
              <h3 className="text-base font-semibold text-surface-900 mb-1">
                Operator
              </h3>
              <p className="text-sm text-surface-500">
                Monitor tours, manage disruptions and track bookings.
              </p>
            </Card>
          </button>
        </motion.div>

        <motion.p variants={fadeUp} custom={4} className="mt-6 text-xs text-surface-400">
          Prototype · No real authentication required
        </motion.p>
      </motion.div>
    </div>
  );
}
