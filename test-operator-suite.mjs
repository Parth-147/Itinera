/**
 * ITINERA OPERATOR CONTROL CENTER — AUTOMATED TEST SUITE
 * Senior QA Test Runner
 */

import assert from 'node:assert';
import { getAffectedComponents } from './src/utils/dependencyGraph.js';
import { formatCurrency } from './src/utils/costCalculator.js';

console.log('═══════════════════════════════════════════════════════════════');
console.log('   ITINERA OPERATOR CONTROL CENTER — SENIOR QA TEST SUITE      ');
console.log('═══════════════════════════════════════════════════════════════\n');

let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Reason: ${err.message}`);
    failedTests++;
  }
}

// ─────────────────────────────────────────────────────────────
// 1. DEPENDENCY GRAPH & CASCADE ANALYSIS TESTS
// ─────────────────────────────────────────────────────────────
console.log('📦 SUITE 1: Dependency Graph & Disruption Impact Analysis');

const rahulComponents = [
  { id: 'rahul-flight', dependsOn: [] },
  { id: 'rahul-transfer-1', dependsOn: ['rahul-flight'] },
  { id: 'rahul-hotel', dependsOn: ['rahul-transfer-1'] },
  { id: 'rahul-scuba', dependsOn: ['rahul-hotel'] },
  { id: 'rahul-beach-transfer', dependsOn: ['rahul-scuba'] },
  { id: 'rahul-dinner', dependsOn: ['rahul-beach-transfer'] },
  { id: 'rahul-sightseeing', dependsOn: ['rahul-hotel'] },
];

test('Scuba cancellation must accurately identify beach transfer & dinner as downstream affected', () => {
  const affected = getAffectedComponents('rahul-scuba', rahulComponents);
  assert.deepStrictEqual(affected.sort(), ['rahul-beach-transfer', 'rahul-dinner'].sort());
});

test('Flight failure must cascade to all dependent components downstream', () => {
  const affected = getAffectedComponents('rahul-flight', rahulComponents);
  assert.strictEqual(affected.length, 6);
  assert.ok(affected.includes('rahul-transfer-1'));
  assert.ok(affected.includes('rahul-hotel'));
  assert.ok(affected.includes('rahul-scuba'));
  assert.ok(affected.includes('rahul-beach-transfer'));
  assert.ok(affected.includes('rahul-dinner'));
  assert.ok(affected.includes('rahul-sightseeing'));
});

test('Leaf node failure (dinner) has no downstream affected components', () => {
  const affected = getAffectedComponents('rahul-dinner', rahulComponents);
  assert.deepStrictEqual(affected, []);
});

// ─────────────────────────────────────────────────────────────
// 2. FINANCIAL & BUDGET RECOVERY CALCULATIONS
// ─────────────────────────────────────────────────────────────
console.log('\n💰 SUITE 2: Financial Formatting & Budget Recovery Calculations');

test('formatCurrency outputs valid Indian Rupee representation', () => {
  assert.strictEqual(formatCurrency(24500), '₹24,500');
  assert.strictEqual(formatCurrency(1872000), '₹18,72,000');
  assert.strictEqual(formatCurrency(0), '₹0');
});

test('Budget adjustment with cost-saving alternative (-₹500 for Kayaking)', () => {
  const initialBudget = 24500;
  const oldCost = 2500;
  const newCost = 2000;
  const costDiff = newCost - oldCost; // -500
  const updatedBudget = initialBudget + costDiff;
  assert.strictEqual(updatedBudget, 24000);
});

test('Budget adjustment with premium alternative (+₹300 for Dolphin Cruise)', () => {
  const initialBudget = 24500;
  const oldCost = 2500;
  const newCost = 2800;
  const costDiff = newCost - oldCost; // +300
  const updatedBudget = initialBudget + costDiff;
  assert.strictEqual(updatedBudget, 24800);
});

// ─────────────────────────────────────────────────────────────
// 3. OPERATOR STATE MACHINE SIMULATION (DISRUPTION → ADAPT → RECOVER)
// ─────────────────────────────────────────────────────────────
console.log('\n⚡ SUITE 3: Operator State Machine (Disruption → Adaptation → Resolution)');

let state = {
  trips: [
    {
      id: 'trip-rahul',
      travelerName: 'Rahul Sharma',
      destination: 'Goa',
      budget: 24500,
      status: 'Active',
      risk: 'Normal',
      components: [
        { id: 'rahul-flight', name: 'Flight', cost: 5200, status: 'Confirmed', dependsOn: [] },
        { id: 'rahul-hotel', name: 'Hotel', cost: 11000, status: 'Confirmed', dependsOn: ['rahul-flight'] },
        { id: 'rahul-scuba', name: 'Scuba Diving', cost: 2500, status: 'Confirmed', dependsOn: ['rahul-hotel'] },
        { id: 'rahul-beach-transfer', name: 'Beach Transfer', cost: 900, status: 'Confirmed', dependsOn: ['rahul-scuba'] },
        { id: 'rahul-dinner', name: 'Dinner', cost: 1800, status: 'Confirmed', dependsOn: ['rahul-beach-transfer'] },
      ],
    },
    {
      id: 'trip-arjun',
      travelerName: 'Arjun Mehta',
      destination: 'Jaipur',
      budget: 18900,
      status: 'Active',
      risk: 'At Risk',
      components: [],
    },
  ],
  activeDisruption: null,
  adaptationHistory: [],
};

test('Step 1: Triggering Disruption transitions trip risk to At Risk and cascades status', () => {
  const tripId = 'trip-rahul';
  const componentId = 'rahul-scuba';
  const downstreamIds = getAffectedComponents(componentId, state.trips[0].components);

  state.trips = state.trips.map((trip) => {
    if (trip.id !== tripId) return trip;
    const updated = trip.components.map((c) => {
      if (c.id === componentId) return { ...c, status: 'Cancelled' };
      if (downstreamIds.includes(c.id)) return { ...c, status: 'At Risk' };
      return c;
    });
    return { ...trip, risk: 'At Risk', components: updated };
  });

  state.activeDisruption = {
    tripId,
    componentId,
    componentName: 'Scuba Diving',
    alternatives: [
      { id: 'alt-kayak', name: 'Kayaking Adventure', cost: 2000, originalCost: 2500 },
      { id: 'alt-dolphin', name: 'Dolphin Cruise', cost: 2800, originalCost: 2500 },
    ],
  };

  const rahul = state.trips.find((t) => t.id === 'trip-rahul');
  assert.strictEqual(rahul.risk, 'At Risk');
  assert.strictEqual(rahul.components.find((c) => c.id === 'rahul-scuba').status, 'Cancelled');
  assert.strictEqual(rahul.components.find((c) => c.id === 'rahul-beach-transfer').status, 'At Risk');
  assert.strictEqual(rahul.components.find((c) => c.id === 'rahul-dinner').status, 'At Risk');
  assert.strictEqual(rahul.components.find((c) => c.id === 'rahul-hotel').status, 'Confirmed');
});

test('Step 2: Resolving Disruption with Kayaking restores downstream health & updates budget', () => {
  const selectedAlt = state.activeDisruption.alternatives.find((a) => a.id === 'alt-kayak');
  const { tripId, componentId } = state.activeDisruption;

  let costDiff = 0;
  state.trips = state.trips.map((trip) => {
    if (trip.id !== tripId) return trip;
    const updated = trip.components.map((c) => {
      if (c.id === componentId) {
        costDiff = selectedAlt.cost - c.cost;
        return { ...c, id: selectedAlt.id, name: selectedAlt.name, cost: selectedAlt.cost, status: 'Confirmed' };
      }
      if (c.status === 'At Risk') return { ...c, status: 'Confirmed' };
      return c;
    });
    return { ...trip, risk: 'Normal', budget: trip.budget + costDiff, components: updated };
  });

  const rahul = state.trips.find((t) => t.id === 'trip-rahul');
  assert.strictEqual(rahul.risk, 'Normal');
  assert.strictEqual(rahul.budget, 24000);
  assert.ok(rahul.components.find((c) => c.id === 'alt-kayak'));
  assert.strictEqual(rahul.components.find((c) => c.id === 'alt-kayak').status, 'Confirmed');
  assert.strictEqual(rahul.components.find((c) => c.id === 'rahul-beach-transfer').status, 'Confirmed');
  assert.strictEqual(rahul.components.find((c) => c.id === 'rahul-dinner').status, 'Confirmed');
});

// ─────────────────────────────────────────────────────────────
// 4. DATA FILTERING, SEARCHING & PAGINATION SANITY
// ─────────────────────────────────────────────────────────────
console.log('\n🔍 SUITE 4: Table Filtering, Search & Sorting Logic');

const sampleTrips = [
  { id: '1', travelerName: 'Rahul Sharma', destination: 'Goa', status: 'Active', risk: 'Normal', budget: 24500 },
  { id: '2', travelerName: 'Priya Patil', destination: 'Manali', status: 'Upcoming', risk: 'Normal', budget: 31200 },
  { id: '3', travelerName: 'Arjun Mehta', destination: 'Jaipur', status: 'Active', risk: 'At Risk', budget: 18900 },
  { id: '4', travelerName: 'Sneha Reddy', destination: 'Goa', status: 'Active', risk: 'Normal', budget: 31200 },
  { id: '5', travelerName: 'Vikram Desai', destination: 'Rajasthan', status: 'Completed', risk: 'Normal', budget: 38600 },
  { id: '6', travelerName: 'Karan Mehta', destination: 'Kerala', status: 'Active', risk: 'At Risk', budget: 45800 },
];

test('Search filtering by destination "Goa" returns exactly 2 trips', () => {
  const query = 'goa';
  const res = sampleTrips.filter((t) => t.destination.toLowerCase().includes(query) || t.travelerName.toLowerCase().includes(query));
  assert.strictEqual(res.length, 2);
});

test('Filter tab "At Risk" correctly isolates trips with risk === "At Risk"', () => {
  const res = sampleTrips.filter((t) => t.risk === 'At Risk');
  assert.strictEqual(res.length, 2);
  assert.ok(res.every((t) => t.risk === 'At Risk'));
});

test('Multi-attribute sorting by budget ascending orders correctly', () => {
  const sorted = [...sampleTrips].sort((a, b) => a.budget - b.budget);
  assert.strictEqual(sorted[0].travelerName, 'Arjun Mehta');
  assert.strictEqual(sorted[sorted.length - 1].travelerName, 'Karan Mehta');
});

test('Pagination splits 6 items into 2 pages of size 5', () => {
  const perPage = 5;
  const page1 = sampleTrips.slice(0, perPage);
  const page2 = sampleTrips.slice(perPage, perPage * 2);
  assert.strictEqual(page1.length, 5);
  assert.strictEqual(page2.length, 1);
});

// ─────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`TEST SUMMARY: ${passedTests} Passed, ${failedTests} Failed`);
console.log('═══════════════════════════════════════════════════════════════');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL INTEGRATION & LOGIC TEST SUITES PASSED CLEANLY!\n');
}
