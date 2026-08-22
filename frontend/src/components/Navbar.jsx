import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('globetrotter_user');
    localStorage.removeItem('globetrotter_token');
    navigate('/login');
  }

  return (
    <header className="navbar">
      <Link className="nav-brand" to="/dashboard"><span aria-hidden="true">✦</span> GlobeTrotter</Link>
      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/my-trips">My Trips</NavLink>
        <Link className="new-trip-link" to="/create-trip">+ Plan New Trip</Link>
        <button className="logout-button" onClick={handleLogout} type="button">Logout</button>
      </nav>
    </header>
  );
}
