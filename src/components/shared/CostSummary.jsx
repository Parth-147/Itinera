import { getCostBreakdown, formatCurrency, getCostDelta } from '../../utils/costCalculator';

export default function CostSummary({ components, originalTotal }) {
  const { subtotal, taxes, total } = getCostBreakdown(components);
  const delta = originalTotal ? getCostDelta(originalTotal, total) : null;

  return (
    <div className="bg-white border border-surface-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-surface-900 mb-4">
        Cost Summary
      </h3>
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-surface-500">Subtotal</span>
          <span className="text-surface-700">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-surface-500">Taxes &amp; fees</span>
          <span className="text-surface-700">{formatCurrency(taxes)}</span>
        </div>
        <hr className="border-surface-100" />
        <div className="flex justify-between font-semibold">
          <span className="text-surface-900">Estimated Total</span>
          <span className="text-surface-900">{formatCurrency(total)}</span>
        </div>
        {delta && delta.direction !== 'same' && (
          <div
            className={`text-xs font-medium text-right ${
              delta.direction === 'decrease' ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {delta.label} from original
          </div>
        )}
      </div>
    </div>
  );
}
