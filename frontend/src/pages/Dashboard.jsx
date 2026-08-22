import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import TripCard from '../components/TripCard.jsx';
import '../styles/dashboard.css';

const demoTrips = [
  { title: 'Golden Triangle Escape', dates: '12 Sep – 18 Sep 2026', cities: 3, emoji: '🕌' },
  { title: 'Goa Beach Break', dates: '10 Oct – 14 Oct 2026', cities: 2, emoji: '🌊' },
];

const destinations = [
  { name: 'Jaipur', country: 'India', emoji: '🏰' },
  { name: 'Goa', country: 'India', emoji: '🏖️' },
  { name: 'Tokyo', country: 'Japan', emoji: '🗼' },
  { name: 'Paris', country: 'France', emoji: '🗼' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem('globetrotter_user') || '{}');
  const userName = savedUser.name || 'Traveller';

  return (
    <div className="app-shell">
      <Navbar />
      <main className="dashboard-page">
        <section className="dashboard-hero">
          <div>
            <p className="eyebrow">YOUR TRAVEL HUB</p>
            <h1>Welcome back, {userName}!</h1>
            <p>Where would you like to explore next?</p>
          </div>
          <button className="primary-button" onClick={() => navigate('/create-trip')} type="button">+ Plan New Trip</button>
        </section>

        <section className="content-section" aria-labelledby="upcoming-trips">
          <div className="section-heading"><div><h2 id="upcoming-trips">Your upcoming trips</h2><p>Keep your plans organised in one place.</p></div><Link to="/my-trips">View all trips</Link></div>
          <div className="trip-grid">{demoTrips.map((trip) => <TripCard key={trip.title} {...trip} />)}</div>
        </section>

        <section className="content-section" aria-labelledby="popular-destinations">
          <div className="section-heading"><div><h2 id="popular-destinations">Popular destinations</h2><p>Get inspired for your next adventure.</p></div></div>
          <div className="destination-grid">
            {destinations.map((destination) => <article className="destination-card" key={destination.name}><span aria-hidden="true">{destination.emoji}</span><div><h3>{destination.name}</h3><p>{destination.country}</p></div></article>)}
          </div>
        </section>
      </main>
    </div>
  );
}
