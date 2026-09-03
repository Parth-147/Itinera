import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Plus,
  Search,
  Star,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useOperator } from '../context/OperatorContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function OperatorVendors() {
  const { vendors } = useOperator();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [inventoryModal, setInventoryModal] = useState(null);

  const types = ['All', 'Hotel', 'Transport', 'Activity', 'Restaurant'];

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedType === 'All') return true;
    return v.type === selectedType;
  });

  return (
    <div className="space-y-8 max-w-6xl">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm">
              <Building2 className="h-3 w-3" />
              Vendor Operations
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 mt-2">
            Vendor Management
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Certified travel vendors across hotels, transport, activities, and dining for Itinera operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Add Vendor modal placeholder — prototype feature')}
            icon={Plus}
          >
            Add Vendor
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => alert('Viewing aggregated fleet & room inventory across partners.')}
          >
            View Inventory
          </Button>
        </div>
      </div>

      {/* ─── Search & Filters ─── */}
      <Card variant="default" padding="md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="h-4 w-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search vendor or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer
                  ${selectedType === type
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ─── Vendors Table ─── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white border border-surface-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-50/80 border-b border-surface-200 text-[11px] font-semibold text-surface-500 uppercase tracking-wider">
              <th className="py-3.5 px-5">Vendor Partner</th>
              <th className="py-3.5 px-5">Type</th>
              <th className="py-3.5 px-5">Location</th>
              <th className="py-3.5 px-5">Rating</th>
              <th className="py-3.5 px-5">Availability</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 text-sm">
            {filteredVendors.map((vendor) => {
              const isFlagged = vendor.status.includes('Flagged');
              return (
                <tr key={vendor.id} className="hover:bg-surface-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <p className="font-semibold text-surface-900">{vendor.name}</p>
                    <p className="text-xs text-surface-400">{vendor.contact}</p>
                  </td>

                  <td className="py-4 px-5">
                    <Badge variant="default" size="sm">
                      {vendor.type}
                    </Badge>
                  </td>

                  <td className="py-4 px-5 text-surface-600 text-xs">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-surface-400" />
                      <span>{vendor.location}</span>
                    </div>
                  </td>

                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1 text-xs font-semibold text-surface-800">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{vendor.rating}</span>
                    </div>
                  </td>

                  <td className="py-4 px-5 text-xs text-surface-600 font-medium">
                    {vendor.availability}
                  </td>

                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        isFlagged
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {isFlagged ? (
                        <AlertCircle className="h-3 w-3 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      )}
                      <span>{vendor.status}</span>
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => setInventoryModal(vendor)}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Inventory
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      {/* Inventory modal preview */}
      {inventoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-modal border border-surface-200">
            <h3 className="text-base font-bold text-surface-900">{inventoryModal.name}</h3>
            <p className="text-xs text-surface-500 mb-4">{inventoryModal.type} in {inventoryModal.location}</p>
            <div className="p-3 bg-surface-50 rounded-xl space-y-2 text-xs text-surface-700">
              <div className="flex justify-between">
                <span>Direct API Connectivity:</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Slots Allocated to Itinera:</span>
                <span className="font-semibold">24 Daily Units</span>
              </div>
              <div className="flex justify-between">
                <span>Cancellation Rate:</span>
                <span className="font-semibold">0.4% (Industry Low)</span>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button size="sm" onClick={() => setInventoryModal(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
