/**
 * Calculate the subtotal from an array of trip components.
 */
export function calculateSubtotal(components) {
  return components.reduce((sum, c) => sum + (c.cost || 0), 0);
}

/**
 * Placeholder tax calculation (5% GST).
 */
export function calculateTaxes(subtotal) {
  return Math.round(subtotal * 0.05);
}

/**
 * Full cost breakdown.
 */
export function getCostBreakdown(components) {
  const subtotal = calculateSubtotal(components);
  const taxes = calculateTaxes(subtotal);
  return { subtotal, taxes, total: subtotal + taxes };
}

/**
 * Format a number as Indian currency.
 */
export function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Get the difference between two costs.
 */
export function getCostDelta(oldCost, newCost) {
  const diff = newCost - oldCost;
  if (diff === 0) return { amount: 0, direction: 'same', label: 'No change' };
  return {
    amount: Math.abs(diff),
    direction: diff > 0 ? 'increase' : 'decrease',
    label: diff > 0
      ? `+${formatCurrency(diff)}`
      : `-${formatCurrency(Math.abs(diff))}`,
  };
}
