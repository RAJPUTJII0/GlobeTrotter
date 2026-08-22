import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const user = localStorage.getItem('globetrotter_user');
  const token = localStorage.getItem('globetrotter_token');

  if (!user || !token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
