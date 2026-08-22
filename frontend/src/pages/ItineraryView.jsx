import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getItinerary } from '../services/tripService.js';

export default function ItineraryView() {
  const { tripId } = useParams(); const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { getItinerary(tripId).then(setData).catch((e) => setError(e.message)); }, [tripId]);
  if (error) return <main><p role="alert">{error}</p></main>;
  if (!data) return <main><p>Loading itinerary...</p></main>;
  return <main style={{ maxWidth: 760, margin: '0 auto', padding: 32 }}><h1>{data.trip.title}</h1><p>{data.trip.startDate} to {data.trip.endDate}</p><Link to={`/itinerary-builder/${tripId}`}>Edit itinerary</Link>{data.stops.length === 0 ? <p>No city stops added yet.</p> : data.stops.map((stop) => <section key={stop.id} style={{ border: '1px solid #d9dee7', borderRadius: 6, marginTop: 16, padding: 16 }}><h2>{stop.city.name}, {stop.city.country}</h2><p>{stop.startDate} to {stop.endDate}</p>{stop.activities.length === 0 ? <p>No activities planned.</p> : <ul>{stop.activities.map((a) => <li key={a.id}><strong>{a.name}</strong> — {a.scheduledDate || 'Unscheduled'} {a.scheduledTime || ''} · {a.durationHours}h · ₹{a.cost}</li>)}</ul>}</section>)}</main>;
}
