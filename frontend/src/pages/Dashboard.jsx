import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import TripCard from '../components/TripCard.jsx';
import '../styles/dashboard.css';
import { getStoredTrips } from '../utils/tripStorage.js';

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
  const trips = getStoredTrips();

  function formatDates(trip) {
    const formatter = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${formatter.format(new Date(`${trip.startDate}T00:00:00`))} — ${formatter.format(new Date(`${trip.endDate}T00:00:00`))}`;
  }

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
          {trips.length > 0 ? (
            <div className="trip-grid">{trips.slice(0, 2).map((trip) => <TripCard key={trip.id} title={trip.title} dates={formatDates(trip)} cities={trip.stops?.length || 0} emoji="✈️" onView={() => navigate('/my-trips')} />)}</div>
          ) : (
            <div className="dashboard-empty"><span aria-hidden="true">🧭</span><div><h3>No trips planned yet</h3><p>Create your first trip and start building your itinerary.</p></div><Link to="/create-trip">Plan a trip</Link></div>
          )}
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
