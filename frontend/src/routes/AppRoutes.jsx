import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard.jsx';
import Budget from '../pages/Budget.jsx';
import ItineraryBuilder from '../pages/ItineraryBuilder.jsx';
import ItineraryView from '../pages/ItineraryView.jsx';
import Login from '../pages/Login.jsx';

export default function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Dashboard />} />
    <Route path="/itinerary/:tripId" element={<ItineraryView />} />
    <Route path="/itinerary-builder/:tripId" element={<ItineraryBuilder />} />
    <Route path="/budget/:tripId" element={<Budget />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
