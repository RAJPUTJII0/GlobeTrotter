import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import '../styles/my-trips.css';
import { getStoredTrips, removeStoredTrip } from '../utils/tripStorage.js';

function formatDate(date) {
  if (!date) return 'Date not set';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`));
}

export default function MyTrips() {
  const [trips, setTrips] = useState(getStoredTrips);
  const [notice, setNotice] = useState('');

  function deleteTrip(id) {
    const trip = trips.find((item) => item.id === id);
    if (!trip || !window.confirm(`Delete "${trip.title}"? This cannot be undone.`)) return;
    const updatedTrips = removeStoredTrip(id);
    setTrips(updatedTrips);
    setNotice('Trip deleted successfully.');
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="my-trips-page">
        <section className="my-trips-heading">
          <div><p className="eyebrow">YOUR JOURNEYS</p><h1>My trips</h1><p>All your travel plans, ready whenever you are.</p></div>
          <Link className="primary-button" to="/create-trip">+ Plan New Trip</Link>
        </section>

        {notice && <p className="trip-notice" role="status">{notice}</p>}

        {trips.length === 0 ? (
          <section className="empty-trips"><span aria-hidden="true">🧭</span><h2>No trips planned yet</h2><p>Your next adventure is waiting. Start creating your first itinerary.</p><Link className="primary-button" to="/create-trip">+ Plan Your First Trip</Link></section>
        ) : (
          <section className="saved-trips-grid" aria-label="Saved trips">
            {trips.map((trip) => (
              <article className="saved-trip-card" key={trip.id}>
                <div className="saved-trip-icon" aria-hidden="true">✈️</div>
                <div className="saved-trip-details">
                  <p className="saved-trip-dates">{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</p>
                  <h2>{trip.title}</h2>
                  <p className="trip-description">{trip.description || 'No description added yet.'}</p>
                  <p className="destination-count">📍 {trip.stops?.length || 0} destinations</p>
                  <div className="trip-actions">
                    <button className="view-button" onClick={() => setNotice('Itinerary view will be connected when Member 2 completes the builder.')} type="button">View itinerary</button>
                    <button onClick={() => setNotice('Editing will be available with the itinerary builder.')} type="button">Edit</button>
                    <button className="delete-button" onClick={() => deleteTrip(trip.id)} type="button">Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
