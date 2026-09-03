import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md"
      >
        <p className="text-8xl font-bold text-primary-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-surface-900 mb-2">
          Page not found
        </h1>
        <p className="text-surface-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <Link to="/">
          <Button icon={Home}>Back to Home</Button>
        </Link>
      </motion.div>
    </div>
  );
}
