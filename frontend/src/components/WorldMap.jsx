import { useEffect, useState } from 'react';
import { getItinerary } from '../services/tripService.js';

function project(latitude, longitude) {
  return { left: `${((Number(longitude) + 180) / 360) * 100}%`, top: `${((90 - Number(latitude)) / 180) * 100}%` };
}
export default function WorldMap({ tripId, stops: providedStops = [], onSelect }) {
  const [stops, setStops] = useState(providedStops);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (!tripId) return;
    getItinerary(tripId).then((data) => setStops(data.stops || [])).catch(() => setStops([]));
  }, [tripId]);
  const mappedStops = stops.filter((stop) => Number.isFinite(Number(stop.city?.latitude)) && Number.isFinite(Number(stop.city?.longitude)));
  return <section className="world-map" aria-label="World map of itinerary stops">
    <div className="world-map-grid" aria-hidden="true" />
    <div className="world-map-lines" aria-hidden="true">{mappedStops.slice(1).map((stop, index) => <span key={`${stop.id}-line-${index}`} style={{ left: project(mappedStops[index].city.latitude, mappedStops[index].city.longitude).left, top: project(mappedStops[index].city.latitude, mappedStops[index].city.longitude).top }} />)}</div>
    {mappedStops.map((stop, index) => <button className="world-map-marker" key={stop.id} type="button" style={project(stop.city.latitude, stop.city.longitude)} onClick={() => { setSelected(stop); onSelect?.(stop); }} title={`${stop.city.name}, ${stop.city.country}`}><span>{index + 1}</span><strong>{stop.city.name}</strong></button>)}
    {mappedStops.length === 0 && <p className="world-map-empty">Add cities with map coordinates to see your route.</p>}
    <div className="world-map-legend"><span>{mappedStops.length} stops</span><small>Click a marker for details</small></div>
    {selected && <div className="world-map-detail"><strong>{selected.city.name}</strong><span>{selected.city.country}</span><small>{selected.startDate} - {selected.endDate} · {selected.activities?.length || 0} activities</small></div>}
  </section>;
}

