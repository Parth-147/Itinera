import { createContext, useContext, useState, useCallback } from 'react';
import {
  goaComponents,
  goaTrip,
  componentAlternatives,
  disruptionAlternatives,
  defaultTripDNA,
} from '../data/mockData';
import { getAffectedComponents } from '../utils/dependencyGraph';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [disruption, setDisruption] = useState(null);
  const [affectedIds, setAffectedIds] = useState([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [tripDNA, setTripDNA] = useState({ ...defaultTripDNA });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [resolved, setResolved] = useState(false);

  /* ── Generate trip from builder form ── */
  const generateTrip = useCallback((formData) => {
    const dest = formData.destination || 'Goa';
    const newTrip = {
      ...goaTrip,
      id: 'trip-' + Date.now(),
      destination: dest,
      startDate: formData.startDate || goaTrip.startDate,
      endDate: formData.endDate || goaTrip.endDate,
      budget: Number(formData.budget) || goaTrip.budget,
      status: 'planning',
    };
    setTrip(newTrip);
    setItinerary(goaComponents.map((c) => ({ ...c })));
    setBookingConfirmed(false);
    setDisruption(null);
    setAffectedIds([]);
    setResolved(false);
    setReviewSubmitted(false);
  }, []);

  /* ── Swap a component with an alternative ── */
  const swapComponent = useCallback((componentId, alternative) => {
    setItinerary((prev) =>
      prev.map((c) =>
        c.id === componentId
          ? {
              ...alternative,
              id: c.id,
              day: c.day,
              dependsOn: c.dependsOn,
              status: c.status,
              bookingRef: 'SWP-' + Date.now().toString(36).toUpperCase(),
            }
          : c,
      ),
    );
  }, []);

  /* ── Remove a component ── */
  const removeComponent = useCallback((componentId) => {
    setItinerary((prev) => prev.filter((c) => c.id !== componentId));
  }, []);

  /* ── Confirm booking ── */
  const confirmBooking = useCallback(() => {
    setBookingConfirmed(true);
    setTrip((prev) => (prev ? { ...prev, status: 'confirmed' } : prev));
    setItinerary((prev) => prev.map((c) => ({ ...c, status: 'confirmed' })));
  }, []);

  /* ── Trigger disruption on a component ── */
  const triggerDisruption = useCallback(
    (componentId) => {
      const component = itinerary.find((c) => c.id === componentId);
      if (!component) return;

      const downstream = getAffectedComponents(componentId, itinerary);

      setDisruption({
        id: 'disruption-' + Date.now(),
        type: 'cancellation',
        description: `${component.name} has been cancelled.`,
        affectedComponentId: componentId,
        componentName: component.name,
        componentEmoji: component.emoji,
      });

      setAffectedIds(downstream);
      setResolved(false);

      setItinerary((prev) =>
        prev.map((c) => {
          if (c.id === componentId) return { ...c, status: 'cancelled' };
          if (downstream.includes(c.id)) return { ...c, status: 'at-risk' };
          return c;
        }),
      );

      setTrip((prev) => (prev ? { ...prev, status: 'disrupted' } : prev));
    },
    [itinerary],
  );

  /* ── Resolve disruption with selected alternative ── */
  const resolveDisruption = useCallback(
    (alternative) => {
      if (!disruption) return;
      const disruptedId = disruption.affectedComponentId;

      setItinerary((prev) =>
        prev.map((c) => {
          if (c.id === disruptedId) {
            return {
              ...alternative,
              id: c.id,
              day: c.day,
              dependsOn: c.dependsOn,
              status: 'confirmed',
              bookingRef: 'REC-' + Date.now().toString(36).toUpperCase(),
            };
          }
          if (affectedIds.includes(c.id)) return { ...c, status: 'confirmed' };
          return c;
        }),
      );

      setResolved(true);
      setDisruption(null);
      setAffectedIds([]);
      setTrip((prev) => (prev ? { ...prev, status: 'active' } : prev));
    },
    [disruption, affectedIds],
  );

  /* ── Submit review and update Trip DNA ── */
  const submitReview = useCallback((ratings) => {
    setTripDNA((prev) => ({
      ...prev,
      accommodation: {
        ...prev.accommodation,
        score: Math.min(100, Math.round((prev.accommodation.score + ratings.accommodation * 20) / 2 + 5)),
      },
      activities: {
        ...prev.activities,
        adventure: Math.min(100, Math.round((prev.activities.adventure + ratings.activities * 18) / 2 + 3)),
        food: Math.min(100, Math.round((prev.activities.food + ratings.food * 18) / 2 + 4)),
      },
      tripsCompleted: prev.tripsCompleted + 1,
    }));
    setReviewSubmitted(true);
  }, []);

  /* ── Get swap alternatives for a component ── */
  const getAlternatives = useCallback((componentId) => {
    return componentAlternatives[componentId] || [];
  }, []);

  /* ── Get disruption alternatives for a component ── */
  const getDisruptionAlternatives = useCallback((componentId) => {
    return disruptionAlternatives[componentId] || [];
  }, []);

  return (
    <TripContext.Provider
      value={{
        trip,
        itinerary,
        disruption,
        affectedIds,
        bookingConfirmed,
        tripDNA,
        reviewSubmitted,
        resolved,
        generateTrip,
        swapComponent,
        removeComponent,
        confirmBooking,
        triggerDisruption,
        resolveDisruption,
        submitReview,
        getAlternatives,
        getDisruptionAlternatives,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used within TripProvider');
  return ctx;
}
