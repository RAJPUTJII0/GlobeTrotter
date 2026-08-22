import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import '../styles/my-trips.css';
import { deleteTrip, getTrips, shareTrip } from '../services/tripService.js';

function formatDate(date) {
  if (!date) return 'Date not set';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`));
}

export default function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    let isMounted = true;
    getTrips()
      .then((items) => {
        if (isMounted) setTrips(items);
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  async function handleDelete(id) {
    const trip = trips.find((item) => item.id === id);
    if (!trip || deletingId || !window.confirm(`Delete "${trip.title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    setError('');
    try {
      await deleteTrip(id);
      setTrips((current) => current.filter((item) => item.id !== id));
      setNotice('Trip deleted successfully.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId('');
    }
  }

  async function handleShare(id) {
    try { const { shareSlug } = await shareTrip(id); await navigator.clipboard?.writeText(`${window.location.origin}/public/${shareSlug}`); setNotice('Share link copied to clipboard.'); }
    catch (requestError) { setError(requestError.message); }
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
        {error && <p className="form-error" role="alert">{error}</p>}

        {isLoading ? <p role="status">Loading your trips...</p> : trips.length === 0 ? (
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
                  <p className="destination-count">📍 {trip.destinationCount} destinations</p>
                  <div className="trip-actions">
                    <button className="view-button" onClick={() => navigate(`/itinerary/${trip.id}`)} type="button">View itinerary</button>
                    <button onClick={() => navigate(`/itinerary-builder/${trip.id}`)} type="button">Edit</button>
                    <button onClick={() => handleShare(trip.id)} type="button">Share</button>
                    <button className="delete-button" disabled={deletingId === trip.id} onClick={() => handleDelete(trip.id)} type="button">{deletingId === trip.id ? 'Deleting...' : 'Delete'}</button>
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
