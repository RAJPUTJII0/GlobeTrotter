import { Navigate, Route, Routes } from 'react-router-dom';
import CreateTrip from '../pages/CreateTrip.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Login from '../pages/Login.jsx';
import MyTrips from '../pages/MyTrips.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-trip" element={<CreateTrip />} />
      <Route path="/my-trips" element={<MyTrips />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
