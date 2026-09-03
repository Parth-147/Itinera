import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { OperatorProvider } from './context/OperatorContext';

// Layouts
import PageWrapper from './components/layout/PageWrapper';
import AppLayout from './components/layout/AppLayout';
import OperatorLayout from './components/layout/OperatorLayout';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Traveler pages
import TripBuilder from './pages/TripBuilder';
import Itinerary from './pages/Itinerary';
import BookingConfirmation from './pages/BookingConfirmation';
import ActiveTrip from './pages/ActiveTrip';
import AdaptEngine from './pages/AdaptEngine';
import TripReview from './pages/TripReview';
import TripDNA from './pages/TripDNA';

// Operator pages
import OperatorDashboard from './pages/OperatorDashboard';
import OperatorTripDetail from './pages/OperatorTripDetail';
import OperatorAdapt from './pages/OperatorAdapt';
import OperatorVendors from './pages/OperatorVendors';

/* ── Auth guard: redirect to /login if not logged in ── */
function RequireAuth({ children, requiredRole }) {
  const { isLoggedIn, role } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <OperatorProvider>
            <Routes>
              {/* ── Public: Landing + Footer ── */}
              <Route element={<PageWrapper />}>
                <Route index element={<Landing />} />
              </Route>

              {/* ── Public: Login (no layout wrapper) ── */}
              <Route path="login" element={<Login />} />

              {/* ── Traveler pages ── */}
              <Route
                element={
                  <RequireAuth requiredRole="traveler">
                    <AppLayout />
                  </RequireAuth>
                }
              >
                <Route path="trip-builder" element={<TripBuilder />} />
                <Route path="itinerary" element={<Itinerary />} />
                <Route path="booking-confirmation" element={<BookingConfirmation />} />
                <Route path="trip/:id" element={<ActiveTrip />} />
                <Route path="trip/:id/adapt" element={<AdaptEngine />} />
                <Route path="trip/:id/review" element={<TripReview />} />
                <Route path="trip-dna" element={<TripDNA />} />
              </Route>

              {/* ── Operator pages ── */}
              <Route
                element={
                  <RequireAuth requiredRole="operator">
                    <OperatorLayout />
                  </RequireAuth>
                }
              >
                <Route path="operator" element={<OperatorDashboard />} />
                <Route path="operator/dashboard" element={<OperatorDashboard />} />
                <Route path="operator/trips" element={<OperatorDashboard />} />
                <Route path="operator/trips/:tripId" element={<OperatorTripDetail />} />
                <Route path="operator/tours/:id" element={<OperatorTripDetail />} />
                <Route path="operator/adapt" element={<OperatorAdapt />} />
                <Route path="operator/vendors" element={<OperatorVendors />} />
              </Route>

              {/* ── 404 ── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OperatorProvider>
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}