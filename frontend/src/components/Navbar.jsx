import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem('globetrotter_user');
    localStorage.removeItem('globetrotter_token');
    navigate('/login');
  }

  return (
    <header className={`navbar ${open ? 'menu-open' : ''}`}>
      <Link className="nav-brand" to="/dashboard"><span aria-hidden="true">✦</span> GlobeTrotter</Link>
      <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)} type="button"><span /><span /><span /></button>
      <nav className="nav-links" aria-label="Main navigation" onClick={() => setOpen(false)}>
        <NavLink to="/dashboard">Dashboard</NavLink><NavLink to="/my-trips">My Trips</NavLink><NavLink to="/create-trip">Plan Trip</NavLink><NavLink to="/explore">Explore</NavLink><NavLink to="/profile">Profile</NavLink>
        <Link className="new-trip-link" to="/create-trip">+ Plan New Trip</Link><button className="logout-button" onClick={handleLogout} type="button">Logout</button>
      </nav>
    </header>
  );
}
