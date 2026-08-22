export default function TripCard({ title, dates, cities, emoji }) {
  return (
    <article className="trip-card">
      <div className="trip-card-image" aria-hidden="true">{emoji}</div>
      <div className="trip-card-content">
        <p className="trip-card-dates">{dates}</p>
        <h3>{title}</h3>
        <p>{cities} destinations</p>
        <button type="button">View itinerary →</button>
      </div>
    </article>
  );
}
