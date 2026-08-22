const TRIPS_KEY = 'globetrotter_trips';

export function getStoredTrips() {
  try {
    return JSON.parse(localStorage.getItem(TRIPS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addStoredTrip(trip) {
  const trips = getStoredTrips();
  localStorage.setItem(TRIPS_KEY, JSON.stringify([trip, ...trips]));
}

export function removeStoredTrip(id) {
  const trips = getStoredTrips().filter((trip) => trip.id !== id);
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  return trips;
}
