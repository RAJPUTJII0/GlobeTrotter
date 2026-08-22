import { api } from './api.js';
function normalizeTrip(trip) {
	if (!trip) return trip;
	return {
		...trip,
		startDate: trip.startDate ?? trip.start_date,
		endDate: trip.endDate ?? trip.end_date,
		destinationCount: trip.destinationCount ?? trip.destination_count ?? 0,
	};
}

export async function getTrips() {
	const response = await api('/trips');
	return (response?.trips || []).map(normalizeTrip);
}

export async function createTrip(trip) {
	const response = await api('/trips', { method: 'POST', body: JSON.stringify(trip) });
	return normalizeTrip(response?.trip || response);
}

export const deleteTrip = (tripId) => api(`/trips/${tripId}`, { method: 'DELETE' });
export const getCities = (search = '') => api(`/cities${search ? `?search=${encodeURIComponent(search)}` : ''}`);
export const getTripStops = (tripId) => api(`/trips/${tripId}/stops`);
export const createTripStop = (tripId, data) => api(`/trips/${tripId}/stops`, { method: 'POST', body: JSON.stringify(data) });
export const deleteTripStop = (tripId, stopId) => api(`/trips/${tripId}/stops/${stopId}`, { method: 'DELETE' });
