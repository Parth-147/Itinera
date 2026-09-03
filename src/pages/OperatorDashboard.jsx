import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Search,
  ChevronRight,
  Filter,
  ArrowUpRight,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useOperator } from '../context/OperatorContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/costCalculator';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function OperatorDashboard() {
  const navigate = useNavigate();
  const { trips, stats, activeDisruption } = useOperator();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filterTabs = ['All', 'Active', 'Upcoming', 'Completed', 'At Risk'];

  // Filtered trips list
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        trip.travelerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === 'All') return true;
      if (selectedFilter === 'At Risk') return trip.risk === 'At Risk';
      return trip.status === selectedFilter;
    });
  }, [trips, searchQuery, selectedFilter]);

  return (
    <div className="space-y-8">
      {/* ─── Top Live Disruption Callout (If active) ─── */}
      {activeDisruption && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  Critical Alert
                </span>
                <span className="text-xs text-red-600">{activeDisruption.timestamp}</span>
              </div>
              <p className="text-sm font-semibold text-red-950 mt-0.5">
                Trip At Risk: {activeDisruption.componentName} cancelled for {activeDisruption.travelerName} ({activeDisruption.destination})
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => navigate('/operator/adapt')}
            iconRight={ArrowUpRight}
            className="shrink-0"
          >
            Launch Adapt Engine
          </Button>
        </motion.div>
      )}

      {/* ─── 4 KPI Summary Cards ─── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Active Trips */}
        <Card variant="default" padding="md" className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
              Active Trips
            </span>
            <div className="h-8 w-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-surface-900">
              {stats.activeTrips}
            </span>
            <span className="text-xs text-emerald-600 font-medium">● 6 in transit</span>
          </div>
          <p className="text-xs text-surface-500 mt-1">Currently operating</p>
        </Card>

        {/* Card 2: Upcoming */}
        <Card variant="default" padding="md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
              Upcoming
            </span>
            <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-surface-900">
              {stats.upcomingTrips}
            </span>
            <span className="text-xs text-surface-400">Next 14 days</span>
          </div>
          <p className="text-xs text-surface-500 mt-1">Ready for departures</p>
        </Card>

        {/* Card 3: Trips Requiring Attention (At Risk) - High Prominence */}
        <div
          onClick={() => navigate('/operator/adapt')}
          className={`rounded-xl border p-5 transition-all cursor-pointer ${
            stats.atRisk > 0
              ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30 hover:bg-amber-500/15'
              : 'bg-white border-surface-200 hover:border-surface-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
              Trips Requiring Attention
            </span>
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                stats.atRisk > 0 ? 'bg-amber-500 text-white animate-pulse' : 'bg-surface-100 text-surface-500'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold tracking-tight ${
                stats.atRisk > 0 ? 'text-amber-950' : 'text-surface-900'
              }`}
            >
              {stats.atRisk}
            </span>
            {stats.atRisk > 0 && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                At Risk
              </span>
            )}
          </div>
          <p className="text-xs text-amber-800/80 mt-1 flex items-center gap-1 font-medium">
            <span>Review Adapt Engine</span>
            <ChevronRight className="h-3 w-3 inline" />
          </p>
        </div>

        {/* Card 4: Confirmed Components */}
        <Card variant="default" padding="md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
              Confirmed Components
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-surface-900">
              {stats.confirmedBookings}
            </span>
            <span className="text-xs text-emerald-600 font-medium">98.4% health</span>
          </div>
          <p className="text-xs text-surface-500 mt-1">Hotels, transport &amp; activities</p>
        </Card>
      </motion.div>

      {/* ─── Main Trips Section ─── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-surface-900 tracking-tight">Active Trips</h2>
            <p className="text-xs text-surface-500 mt-0.5">
              Live operational monitoring for all booked traveler tours.
            </p>
          </div>

          {/* Quick shortcut to Adapt Engine */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/operator/adapt')}
            icon={Sparkles}
          >
            Disruption Simulator &amp; Adapt
          </Button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white border border-surface-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="h-4 w-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search traveler or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {filterTabs.map((tab) => {
              const active = selectedFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer
                    ${active
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                    }
                  `}
                >
                  {tab}
                  {tab === 'At Risk' && stats.atRisk > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px]">
                      {stats.atRisk}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white border border-surface-200 rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50/80 border-b border-surface-200 text-[11px] font-semibold text-surface-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Traveler</th>
                <th className="py-3.5 px-5">Destination</th>
                <th className="py-3.5 px-5">Dates</th>
                <th className="py-3.5 px-5 text-center">Components</th>
                <th className="py-3.5 px-5">Budget</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-center">Risk</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 text-sm">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-surface-400">
                    No trips match your current search or filter.
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => {
                  const isAtRisk = trip.risk === 'At Risk';
                  return (
                    <tr
                      key={trip.id}
                      className={`hover:bg-surface-50/70 transition-colors ${
                        isAtRisk ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Traveler */}
                      <td className="py-4 px-5">
                        <p className="font-semibold text-surface-900">{trip.travelerName}</p>
                        <p className="text-xs text-surface-400">{trip.travelerEmail}</p>
                      </td>

                      {/* Destination */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 font-medium text-surface-800">
                          <MapPin className="h-3.5 w-3.5 text-primary-500" />
                          <span>{trip.destination}</span>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-5 text-surface-600 text-xs font-medium">
                        {trip.dates}
                      </td>

                      {/* Components */}
                      <td className="py-4 px-5 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-surface-100 text-surface-700 text-xs font-semibold">
                          {trip.componentsCount || trip.components?.length || 6}
                        </span>
                      </td>

                      {/* Budget */}
                      <td className="py-4 px-5 font-semibold text-surface-900">
                        {formatCurrency(trip.budget)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <Badge
                          variant={
                            trip.status === 'Active'
                              ? 'primary'
                              : trip.status === 'Upcoming'
                              ? 'info'
                              : 'success'
                          }
                          size="sm"
                        >
                          {trip.status}
                        </Badge>
                      </td>

                      {/* Risk */}
                      <td className="py-4 px-5 text-center">
                        {isAtRisk ? (
                          <Badge variant="danger" size="sm" dot>
                            At Risk 🔴
                          </Badge>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                            Normal 🟢
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => navigate(`/operator/trips/${trip.id}`)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>View</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Card View */}
        <div className="lg:hidden space-y-3">
          {filteredTrips.length === 0 ? (
            <div className="p-8 text-center text-surface-400 bg-white rounded-xl border border-surface-200">
              No trips match your current search or filter.
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const isAtRisk = trip.risk === 'At Risk';
              return (
                <div
                  key={trip.id}
                  onClick={() => navigate(`/operator/trips/${trip.id}`)}
                  className={`p-4 bg-white border rounded-xl space-y-3 shadow-xs cursor-pointer ${
                    isAtRisk ? 'border-amber-400 bg-amber-50/20' : 'border-surface-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-surface-900">{trip.travelerName}</h3>
                      <p className="text-xs text-surface-500">{trip.destination} • {trip.dates}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-surface-900">{formatCurrency(trip.budget)}</p>
                      <p className="text-[10px] text-surface-400">{trip.componentsCount || 6} items</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-surface-100">
                    <div className="flex items-center gap-2">
                      <Badge variant={trip.status === 'Active' ? 'primary' : 'default'} size="sm">
                        {trip.status}
                      </Badge>
                      {isAtRisk ? (
                        <Badge variant="danger" size="sm" dot>At Risk 🔴</Badge>
                      ) : (
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                          Normal 🟢
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-primary-600 flex items-center">
                      Details <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
