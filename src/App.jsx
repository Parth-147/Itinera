import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageWrapper } from './components/layout';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages with navbar + footer */}
        <Route element={<PageWrapper />}>
          <Route index element={<Landing />} />
          {/* Future routes:
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="trip/new" element={<TripBuilder />} />
            <Route path="trip/:id" element={<Itinerary />} />
            <Route path="trip-dna" element={<TripDNA />} />
          */}
        </Route>

        {/* Operator routes (will use a different layout)
        <Route element={<OperatorLayout />}>
          <Route path="operator" element={<OperatorDashboard />} />
          <Route path="operator/tour/:id" element={<TourDetails />} />
        </Route>
        */}

        {/* 404 */}
        <Route element={<PageWrapper showFooter={false} />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}