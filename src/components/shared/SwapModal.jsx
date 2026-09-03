import { Star } from 'lucide-react';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatCurrency, getCostDelta } from '../../utils/costCalculator';

export default function SwapModal({
  isOpen,
  onClose,
  current,
  alternatives,
  onSelect,
}) {
  if (!current) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Swap Component" size="lg">
      {/* Current component */}
      <div className="mb-6">
        <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-2">
          Current
        </p>
        <div className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl">
          <span className="text-2xl">{current.emoji}</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-surface-900">
              {current.name}
            </h4>
            <p className="text-xs text-surface-500">{current.vendor}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-surface-900">
              {formatCurrency(current.cost)}
            </p>
            {current.rating && (
              <div className="flex items-center gap-1 text-xs text-surface-500 justify-end">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {current.rating}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alternatives */}
      <div>
        <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-3">
          Alternatives
        </p>
        <div className="space-y-3">
          {alternatives.map((alt) => {
            const delta = getCostDelta(current.cost, alt.cost);
            return (
              <div
                key={alt.id}
                className="flex items-center gap-3 p-4 border border-surface-200 rounded-xl hover:border-primary-200 hover:bg-primary-50/30 transition-colors"
              >
                <span className="text-2xl">{alt.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-surface-900">
                    {alt.name}
                  </h4>
                  <p className="text-xs text-surface-500 truncate">
                    {alt.description}
                  </p>
                  <p className="text-xs text-surface-400 mt-0.5">
                    {alt.location}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-surface-900">
                    {formatCurrency(alt.cost)}
                  </p>
                  {alt.rating && (
                    <div className="flex items-center gap-1 text-xs text-surface-500 justify-end">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {alt.rating}
                    </div>
                  )}
                  <Badge
                    variant={delta.direction === 'decrease' ? 'success' : delta.direction === 'increase' ? 'danger' : 'default'}
                    size="sm"
                    className="mt-1"
                  >
                    {delta.label}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onSelect(alt);
                    onClose();
                  }}
                  className="shrink-0"
                >
                  Select
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
