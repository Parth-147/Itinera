import { Star, ArrowLeftRight, Trash2, Eye } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/costCalculator';

const statusStyles = {
  confirmed: { variant: 'success', label: 'Confirmed' },
  'at-risk': { variant: 'warning', label: 'At Risk' },
  cancelled: { variant: 'danger', label: 'Cancelled' },
  pending: { variant: 'default', label: 'Pending' },
};

export default function ComponentCard({
  component,
  onSwap,
  onRemove,
  onViewDetails,
  showActions = false,
  compact = false,
}) {
  const status = statusStyles[component.status] || statusStyles.confirmed;

  return (
    <div
      className={`
        bg-white border border-surface-200 rounded-xl
        transition-all duration-200
        ${component.status === 'at-risk' ? 'border-amber-300 bg-amber-50/30' : ''}
        ${component.status === 'cancelled' ? 'border-red-300 bg-red-50/30 opacity-60' : ''}
        ${compact ? 'p-3' : 'p-4 sm:p-5'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Emoji */}
        <span className="text-2xl leading-none mt-0.5 shrink-0">
          {component.emoji}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">
                {component.type}
              </p>
              <h4 className="text-sm font-semibold text-surface-900">
                {component.name}
              </h4>
            </div>
            <Badge variant={status.variant} size="sm" dot>
              {status.label}
            </Badge>
          </div>

          {!compact && component.description && (
            <p className="text-xs text-surface-500 mb-2">
              {component.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-surface-500">
            {component.vendor && component.vendor !== 'Self-guided' && (
              <span>{component.vendor}</span>
            )}
            {component.location && (
              <span>{component.location}</span>
            )}
            {component.time && <span>{component.time}</span>}
          </div>

          {/* Cost + Rating row */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm font-semibold text-surface-900">
              {formatCurrency(component.cost)}
            </span>
            {component.rating && (
              <div className="flex items-center gap-1 text-xs text-surface-500">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {component.rating}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && component.status !== 'cancelled' && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-100">
          {onSwap && (
            <button
              onClick={() => onSwap(component)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="h-3 w-3" />
              Swap
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(component.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-500 hover:bg-surface-100 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Remove
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(component)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-500 hover:bg-surface-100 rounded-lg transition-colors cursor-pointer ml-auto"
            >
              <Eye className="h-3 w-3" />
              Details
            </button>
          )}
        </div>
      )}
    </div>
  );
}
