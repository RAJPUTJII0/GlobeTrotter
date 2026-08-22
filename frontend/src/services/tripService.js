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
export const reorderTripStop = (tripId, stopId, stopOrder) => api(`/trips/${tripId}/stops/${stopId}`, { method: 'PATCH', body: JSON.stringify({ stopOrder }) });
export const getItinerary = (tripId) => api(`/trips/${tripId}/itinerary`);
export const getExpenses = (tripId) => api(`/trips/${tripId}/expenses`);
export const createExpense = (tripId, data) => api(`/trips/${tripId}/expenses`, { method: 'POST', body: JSON.stringify(data) });
export const deleteExpense = (tripId, expenseId) => api(`/trips/${tripId}/expenses/${expenseId}`, { method: 'DELETE' });
export const getBudget = (tripId) => api(`/trips/${tripId}/budget`);
export const shareTrip = (tripId) => api(`/trips/${tripId}/share`, { method: 'POST' });
export const getPublicTrip = (shareSlug) => api(`/public/trips/${shareSlug}`);
export const copyPublicTrip = (shareSlug) => api(`/public/trips/${shareSlug}/copy`, { method: 'POST' });
