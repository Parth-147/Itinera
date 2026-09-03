import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getAffectedComponents } from '../utils/dependencyGraph';

const OperatorContext = createContext(null);

// ── Initial Operator Trips Seed Data ──
const initialOperatorTrips = [
  {
    id: 'trip-rahul',
    travelerName: 'Rahul Sharma',
    travelerEmail: 'rahul@example.com',
    destination: 'Goa',
    startDate: '12 Sep 2026',
    endDate: '15 Sep 2026',
    dates: '12 Sep – 15 Sep',
    componentsCount: 6,
    budget: 24500,
    status: 'Active',
    risk: 'Normal',
    lastUpdated: '2 min ago',
    components: [
      { id: 'rahul-flight', day: 1, type: 'Transport', name: 'Mumbai → Goa Flight', details: 'Flight AI-842', time: '12 Sep • 08:30 AM', location: 'Mumbai (BOM) → Goa (GOI)', cost: 5200, vendor: 'Air India', status: 'Confirmed', emoji: '✈️', dependsOn: [], dependencyLabel: 'Initial Component' },
      { id: 'rahul-transfer-1', day: 1, type: 'Transport', name: 'Airport Cab Transfer', details: 'Private Sedan to Hotel', time: '12 Sep • 10:15 AM', location: 'Dabolim Airport → Calangute', cost: 900, vendor: 'Goa Luxury Cabs', status: 'Confirmed', emoji: '🚗', dependsOn: ['rahul-flight'], dependencyLabel: 'Flight AI-842 → Airport Transfer' },
      { id: 'rahul-hotel', day: 1, type: 'Stay', name: 'Sea View Resort Check-in', details: 'Deluxe Ocean View Room', time: '12 Sep • 12:00 PM (3 Nights)', location: 'Calangute Beach Road, Goa', cost: 11000, vendor: 'Sea View Hospitality', status: 'Confirmed', emoji: '🏨', dependsOn: ['rahul-transfer-1'], dependencyLabel: 'Airport Transfer → Hotel Check-in' },
      { id: 'rahul-scuba', day: 2, type: 'Activity', name: 'Scuba Diving', details: 'Guided Reef Dive & Equipment', time: '13 Sep • 10:00 AM', location: 'Grande Island, Goa', cost: 2500, vendor: 'Ocean Adventures', status: 'Confirmed', emoji: '🤿', dependsOn: ['rahul-hotel'], dependencyLabel: 'Hotel Stay → Activity' },
      { id: 'rahul-beach-transfer', day: 2, type: 'Transport', name: 'Beach Transfer to Sunset Point', details: 'Speedboat & Shore Transfer', time: '13 Sep • 02:30 PM', location: 'Grande Island Jetty → Baga Beach', cost: 900, vendor: 'Coastal Transfers Goa', status: 'Confirmed', emoji: '🚤', dependsOn: ['rahul-scuba'], dependencyLabel: 'Scuba Diving → Beach Transfer' },
      { id: 'rahul-dinner', day: 2, type: 'Activity', name: 'Evening Seafood Dinner', details: 'Heritage Goan 4-Course Dinner', time: '13 Sep • 07:30 PM', location: "Fisherman's Wharf, Cavelossim", cost: 1800, vendor: "Fisherman's Wharf", status: 'Confirmed', emoji: '🍽️', dependsOn: ['rahul-beach-transfer'], dependencyLabel: 'Beach Transfer → Evening Activity' },
      { id: 'rahul-sightseeing', day: 3, type: 'Activity', name: 'Fort Aguada & Lighthouse Tour', details: 'Historical Guided Walk', time: '14 Sep • 09:30 AM', location: 'Sinquerim, Candolim', cost: 1200, vendor: 'Goa Heritage Walks', status: 'Confirmed', emoji: '🏰', dependsOn: ['rahul-hotel'], dependencyLabel: 'Hotel Stay → Sightseeing' },
    ],
  },
  {
    id: 'trip-priya',
    travelerName: 'Priya Patil',
    travelerEmail: 'priya.patil@example.com',
    destination: 'Manali',
    startDate: '18 Sep 2026',
    endDate: '22 Sep 2026',
    dates: '18 Sep – 22 Sep',
    componentsCount: 8,
    budget: 31200,
    status: 'Upcoming',
    risk: 'Normal',
    lastUpdated: '1 hr ago',
    components: [
      { id: 'priya-flight', day: 1, type: 'Transport', name: 'Delhi → Kullu Flight', details: 'Alliance Air 9I-805', time: '18 Sep • 07:00 AM', location: 'Delhi (DEL) → Bhuntar (KUU)', cost: 6500, vendor: 'Alliance Air', status: 'Confirmed', emoji: '✈️', dependsOn: [], dependencyLabel: 'Initial Transport' },
      { id: 'priya-hotel', day: 1, type: 'Stay', name: 'Himalayan Riverside Lodge', details: 'Pine Wood Suite', time: '18 Sep • 01:00 PM', location: 'Old Manali Road', cost: 13500, vendor: 'Himalayan Stays', status: 'Confirmed', emoji: '🏔️', dependsOn: ['priya-flight'], dependencyLabel: 'Airport Flight → Hotel' },
      { id: 'priya-trek', day: 2, type: 'Activity', name: 'Solang Valley Paragliding', details: 'High Fly Tandem Jump', time: '19 Sep • 10:00 AM', location: 'Solang Valley', cost: 3200, vendor: 'Manali Air Sports', status: 'Confirmed', emoji: '🪂', dependsOn: ['priya-hotel'], dependencyLabel: 'Hotel → Adventure Activity' },
    ],
  },
  {
    id: 'trip-arjun',
    travelerName: 'Arjun Mehta',
    travelerEmail: 'arjun.mehta@example.com',
    destination: 'Jaipur',
    startDate: '10 Sep 2026',
    endDate: '13 Sep 2026',
    dates: '10 Sep – 13 Sep',
    componentsCount: 5,
    budget: 18900,
    status: 'Active',
    risk: 'At Risk',
    lastUpdated: '5 min ago',
    components: [
      { id: 'arjun-train', day: 1, type: 'Transport', name: 'Vande Bharat Express', details: 'Executive Class', time: '10 Sep • 06:10 AM', location: 'Delhi (NDLS) → Jaipur (JP)', cost: 2100, vendor: 'Indian Railways', status: 'Confirmed', emoji: '🚆', dependsOn: [], dependencyLabel: 'Initial Transport' },
      { id: 'arjun-haveli', day: 1, type: 'Stay', name: 'Heritage Haveli Palace', details: 'Royal Suite Room', time: '10 Sep • 12:30 PM', location: 'Bani Park, Jaipur', cost: 8800, vendor: 'Royal Rajputana Stays', status: 'Confirmed', emoji: '🏰', dependsOn: ['arjun-train'], dependencyLabel: 'Train Arrival → Haveli Stay' },
      { id: 'arjun-safari', day: 2, type: 'Activity', name: 'Jhalana Leopard Safari', details: 'Open Gypsy Safari Slot', time: '11 Sep • 03:00 PM', location: 'Jhalana Safari Park', cost: 2400, vendor: 'Rajasthan Eco Tours', status: 'At Risk', emoji: '🐆', dependsOn: ['arjun-haveli'], dependencyLabel: 'Haveli Stay → Safari Entry' },
    ],
  },
  {
    id: 'trip-neha',
    travelerName: 'Neha Kulkarni',
    travelerEmail: 'neha@example.com',
    destination: 'Kerala',
    startDate: '20 Sep 2026',
    endDate: '27 Sep 2026',
    dates: '20 Sep – 27 Sep',
    componentsCount: 9,
    budget: 42800,
    status: 'Upcoming',
    risk: 'Normal',
    lastUpdated: '3 hr ago',
    components: [],
  },
  {
    id: 'trip-vikram-k',
    travelerName: 'Vikram Khanna',
    travelerEmail: 'vikram@example.com',
    destination: 'Leh Ladakh',
    startDate: '25 Sep 2026',
    endDate: '02 Oct 2026',
    dates: '25 Sep – 02 Oct',
    componentsCount: 7,
    budget: 36750,
    status: 'Upcoming',
    risk: 'Normal',
    lastUpdated: '4 hr ago',
    components: [],
  },
  {
    id: 'trip-vikram',
    travelerName: 'Vikram Desai',
    travelerEmail: 'vikram.desai@example.com',
    destination: 'Rajasthan',
    startDate: '8 Sep 2026',
    endDate: '12 Sep 2026',
    dates: '8 Sep – 12 Sep',
    componentsCount: 11,
    budget: 38600,
    status: 'Completed',
    risk: 'Normal',
    lastUpdated: '1 day ago',
    components: [],
  },
  {
    id: 'trip-sneha',
    travelerName: 'Sneha Reddy',
    travelerEmail: 'sneha.reddy@example.com',
    destination: 'Goa',
    startDate: '15 Sep 2026',
    endDate: '18 Sep 2026',
    dates: '15 Sep – 18 Sep',
    componentsCount: 9,
    budget: 31200,
    status: 'Active',
    risk: 'Normal',
    lastUpdated: '30 min ago',
    components: [],
  },
  {
    id: 'trip-karan',
    travelerName: 'Karan Mehta',
    travelerEmail: 'karan.mehta@example.com',
    destination: 'Kerala',
    startDate: '20 Sep 2026',
    endDate: '25 Sep 2026',
    dates: '20 Sep – 25 Sep',
    componentsCount: 15,
    budget: 45800,
    status: 'Active',
    risk: 'At Risk',
    lastUpdated: '8 min ago',
    components: [],
  },
];

// Recent disruptions feed
const initialDisruptions = [
  { id: 'dis-1', title: 'Scuba Diving Cancelled', travelerName: 'Rahul Sharma', destination: 'Goa', severity: 'High', timeAgo: '10 min ago', tripId: 'trip-rahul' },
  { id: 'dis-2', title: 'Transport Delay', travelerName: 'Arjun Mehta', destination: 'Jaipur', severity: 'Medium', timeAgo: '25 min ago', tripId: 'trip-arjun' },
  { id: 'dis-3', title: 'Hotel Availability Changed', travelerName: 'Priya Patil', destination: 'Manali', severity: 'Low', timeAgo: '1 hr ago', tripId: 'trip-priya' },
];

// Recent activities feed
const initialActivities = [
  { id: 'act-1', title: 'Alternative selected for Scuba Diving', travelerName: 'Rahul Sharma', destination: 'Goa Trip', detail: 'Kayaking Adventure', timeAgo: '10 min ago', color: 'emerald', type: 'resolution', tripId: 'trip-rahul' },
  { id: 'act-2', title: 'Transport delay reported', travelerName: 'Arjun Mehta', destination: 'Jaipur Trip', detail: 'From Delhi to Jaipur', timeAgo: '25 min ago', color: 'amber', type: 'disruption', tripId: 'trip-arjun' },
  { id: 'act-3', title: 'Hotel booking confirmed', travelerName: 'Priya Patil', destination: 'Manali Trip', detail: 'Snow View Resort', timeAgo: '1 hr ago', color: 'blue', type: 'booking', tripId: 'trip-priya' },
  { id: 'act-4', title: 'New trip created', travelerName: 'Neha Kulkarni', destination: 'Kerala Trip', detail: '9 components added', timeAgo: '2 hr ago', color: 'purple', type: 'creation', tripId: 'trip-neha' },
];

// Initial notifications
const initialNotifications = [
  { id: 'n-1', title: 'Scuba Diving cancelled', description: 'Rahul Sharma • Goa Trip', category: 'critical', read: false, timeAgo: '10 min ago', tripId: 'trip-rahul' },
  { id: 'n-2', title: 'Transport delay detected', description: 'Arjun Mehta • Jaipur Trip', category: 'warning', read: false, timeAgo: '25 min ago', tripId: 'trip-arjun' },
  { id: 'n-3', title: 'Alternative successfully selected', description: 'Kayaking Adventure for Rahul Sharma', category: 'info', read: true, timeAgo: '30 min ago', tripId: 'trip-rahul' },
  { id: 'n-4', title: 'New booking confirmed', description: 'Priya Patil • Snow View Resort', category: 'info', read: true, timeAgo: '1 hr ago', tripId: 'trip-priya' },
];

// Pre-seeded alternatives for Rahul's Scuba Diving disruption
const scubaAlternatives = [
  {
    id: 'alt-kayak', rank: 1, name: 'Kayaking Adventure', type: 'Activity', cost: 2000, originalCost: 2500, costDelta: -500, costDifferenceText: '-₹500', time: '10:00 AM – 1:00 PM', rating: 4.7, tripFit: 92, vendor: 'Paddle Goa Adventures', location: 'Zuari River Mangroves, Goa', emoji: '🛶',
    whyRecommended: ["Matches traveler's adventure preference", '₹500 cheaper', 'Same-day availability', '4.7★ vendor rating'],
    details: 'Calm mangrove kayak tour with licensed guide, safety gear, and fresh refreshments.',
  },
  {
    id: 'alt-dolphin', rank: 2, name: 'Dolphin Sightseeing Cruise', type: 'Activity', cost: 2800, originalCost: 2500, costDelta: 300, costDifferenceText: '+₹300', time: '11:00 AM – 2:00 PM', rating: 4.5, tripFit: 86, vendor: 'Goa Coastal Cruise Ltd', location: 'Sinquerim Jetty, Goa', emoji: '🐬',
    whyRecommended: ['Scenic coastal marine exploration', 'High traveler satisfaction rate', 'Includes safety boat & snacks', 'Smooth integration with Day 2 evening plans'],
    details: 'Catamaran cruise off Candolim coast with dolphin spotting and coastal geology tour.',
  },
];

// Pre-seeded Vendors
const initialVendors = [
  { id: 'v-1', name: 'Taj Holiday Village', type: 'Hotel', location: 'Candolim, Goa', rating: 4.8, availability: '92% Available', status: 'Active Partner', contact: 'ops@tajhotels.com', reliability: 96 },
  { id: 'v-2', name: 'Ocean Adventures', type: 'Activity', location: 'Grande Island, Goa', rating: 4.7, availability: 'Limited Slots', status: 'Flagged (Recent Cancellation)', contact: 'dive@oceanadv.in', reliability: 78 },
  { id: 'v-3', name: 'Goa Luxury Cabs', type: 'Transport', location: 'Dabolim Airport, Goa', rating: 4.6, availability: 'Instant Dispatch', status: 'Active Partner', contact: 'dispatch@goaluxcabs.com', reliability: 94 },
  { id: 'v-4', name: "Fisherman's Wharf", type: 'Restaurant', location: 'Cavelossim, Goa', rating: 4.6, availability: 'Reserved Tables', status: 'Active Partner', contact: 'booking@fishermanswharf.in', reliability: 97 },
  { id: 'v-5', name: 'Paddle Goa Adventures', type: 'Activity', location: 'Zuari River, Goa', rating: 4.7, availability: 'Available Today', status: 'Preferred Partner', contact: 'hello@paddlegoa.com', reliability: 95 },
  { id: 'v-6', name: 'Alliance Air', type: 'Transport', location: 'Delhi / Himachal', rating: 4.3, availability: 'Scheduled Flights', status: 'Active Partner', contact: 'charter@allianceair.in', reliability: 88 },
];

export function OperatorProvider({ children }) {
  const [trips, setTrips] = useState(initialOperatorTrips);
  const [vendors] = useState(initialVendors);
  const [activeDisruption, setActiveDisruption] = useState(null);
  const [adaptationHistory, setAdaptationHistory] = useState([]);
  const [systemAlert, setSystemAlert] = useState(null);
  const [disruptions] = useState(initialDisruptions);
  const [activities, setActivities] = useState(initialActivities);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toasts, setToasts] = useState([]);
  const [lastSync, setLastSync] = useState('Just now');

  // Dynamic KPI stats
  const stats = useMemo(() => {
    const active = trips.filter((t) => t.status === 'Active').length + 21;
    const upcoming = trips.filter((t) => t.status === 'Upcoming').length + 9;
    const completed = 15;
    const atRiskCount = trips.filter((t) => t.risk === 'At Risk').length;
    const confirmedComponents = 68;
    const totalRevenue = 1872000;
    const totalTrips = active + upcoming + completed + atRiskCount;
    return { activeTrips: active, upcomingTrips: upcoming, completedTrips: completed, atRisk: atRiskCount, confirmedBookings: confirmedComponents, totalRevenue, totalTrips };
  }, [trips]);

  const unreadNotifications = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  // Toast system
  const addToast = useCallback((message, type = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
    setLastSync('Just now');
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Notification management
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((title, description, category = 'info', tripId = null) => {
    const n = { id: `n-${Date.now()}`, title, description, category, read: false, timeAgo: 'Just now', tripId };
    setNotifications((prev) => [n, ...prev]);
  }, []);

  // Add activity
  const addActivity = useCallback((title, travelerName, destination, detail, color = 'purple', type = 'info', tripId = null) => {
    const a = { id: `act-${Date.now()}`, title, travelerName, destination, detail, timeAgo: 'Just now', color, type, tripId };
    setActivities((prev) => [a, ...prev.slice(0, 9)]);
  }, []);

  // Trigger disruption simulation
  const triggerDisruption = useCallback((tripId, componentId, disruptionType = 'Activity Cancellation') => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== tripId) return trip;
        const targetComp = trip.components.find((c) => c.id === componentId);
        if (!targetComp) return trip;
        const downstreamIds = getAffectedComponents(componentId, trip.components);
        const updatedComponents = trip.components.map((c) => {
          if (c.id === componentId) return { ...c, status: 'Cancelled' };
          if (downstreamIds.includes(c.id)) return { ...c, status: 'At Risk' };
          return c;
        });
        return { ...trip, risk: 'At Risk', components: updatedComponents, lastUpdated: 'Just now' };
      })
    );

    const targetTrip = trips.find((t) => t.id === tripId) || trips[0];
    const targetComp = targetTrip.components.find((c) => c.id === componentId) || { id: componentId, name: 'Scuba Diving', cost: 2500 };
    const downstreamIds = getAffectedComponents(componentId, targetTrip.components);
    const affectedComponentsList = targetTrip.components.filter((c) => c.id === componentId || downstreamIds.includes(c.id));

    setActiveDisruption({
      tripId, travelerName: targetTrip.travelerName, destination: targetTrip.destination, componentId, componentName: targetComp.name, disruptionType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      affectedComponents: affectedComponentsList.length > 0 ? affectedComponentsList : [
        { id: componentId, name: targetComp.name, status: 'Cancelled', emoji: '🤿' },
        { id: 'rahul-beach-transfer', name: 'Beach Transfer to Sunset Point', status: 'At Risk', emoji: '🚤' },
        { id: 'rahul-dinner', name: 'Evening Seafood Dinner', status: 'At Risk', emoji: '🍽️' },
      ],
      alternatives: scubaAlternatives,
    });

    setSystemAlert({ type: 'danger', message: `Trip At Risk: ${targetComp.name} has been cancelled for ${targetTrip.travelerName}.` });
    addNotification(`${targetComp.name} cancelled`, `${targetTrip.travelerName} • ${targetTrip.destination} Trip`, 'critical', tripId);
    addActivity(`${disruptionType}: ${targetComp.name}`, targetTrip.travelerName, `${targetTrip.destination} Trip`, `Component cancelled`, 'red', 'disruption', tripId);
    setLastSync('Just now');
  }, [trips, addNotification, addActivity]);

  // Resolve disruption with chosen alternative
  const resolveDisruption = useCallback((alternativeId) => {
    if (!activeDisruption) return null;
    const selectedAlt = activeDisruption.alternatives.find((a) => a.id === alternativeId) || activeDisruption.alternatives[0];
    const { tripId, componentId, componentName } = activeDisruption;
    let costDiff = 0;
    let oldBudget = 24500;
    let newBudget = 24000;

    setTrips((prevTrips) =>
      prevTrips.map((trip) => {
        if (trip.id !== tripId) return trip;
        oldBudget = trip.budget;
        const updatedComponents = trip.components.map((c) => {
          if (c.id === componentId) {
            costDiff = selectedAlt.cost - c.cost;
            return { ...c, id: selectedAlt.id, name: selectedAlt.name, cost: selectedAlt.cost, vendor: selectedAlt.vendor, location: selectedAlt.location, time: selectedAlt.time, status: 'Confirmed', emoji: selectedAlt.emoji, details: selectedAlt.details };
          }
          if (c.status === 'At Risk') return { ...c, status: 'Confirmed' };
          return c;
        });
        newBudget = oldBudget + costDiff;
        return { ...trip, risk: 'Normal', budget: newBudget, components: updatedComponents, lastUpdated: 'Just now' };
      })
    );

    const resolutionSummary = { tripId, travelerName: activeDisruption.travelerName, destination: activeDisruption.destination, oldComponent: componentName, newComponent: selectedAlt.name, oldBudget, newBudget, savedAmount: costDiff < 0 ? Math.abs(costDiff) : 0, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setAdaptationHistory((prev) => [resolutionSummary, ...prev]);
    setActiveDisruption(null);
    setSystemAlert({ type: 'success', message: `Trip successfully adapted: ${componentName} replaced with ${selectedAlt.name}. Total updated to ₹${newBudget.toLocaleString('en-IN')}.` });
    addNotification('Alternative successfully selected', `${selectedAlt.name} for ${activeDisruption.travelerName}`, 'info', tripId);
    addActivity(`Alternative selected: ${selectedAlt.name}`, activeDisruption.travelerName, `${activeDisruption.destination} Trip`, `Replaced ${componentName}`, 'emerald', 'resolution', tripId);
    setLastSync('Just now');
    return resolutionSummary;
  }, [activeDisruption, addNotification, addActivity]);

  const clearAlert = useCallback(() => setSystemAlert(null), []);

  return (
    <OperatorContext.Provider
      value={{
        trips, vendors, stats, activeDisruption, adaptationHistory, systemAlert, disruptions, activities, notifications, toasts, lastSync, unreadNotifications,
        triggerDisruption, resolveDisruption, clearAlert, addToast, removeToast, markNotificationRead, markAllNotificationsRead, addNotification, addActivity,
      }}
    >
      {children}
    </OperatorContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOperator() {
  const ctx = useContext(OperatorContext);
  if (!ctx) throw new Error('useOperator must be used within OperatorProvider');
  return ctx;
}
