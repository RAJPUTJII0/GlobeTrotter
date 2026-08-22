import { api } from './api.js';
export const getTrips = () => api('/trips');
export const getCities = (search = '') => api(`/cities${search ? `?search=${encodeURIComponent(search)}` : ''}`);
export const getTripStops = (tripId) => api(`/trips/${tripId}/stops`);
export const createTripStop = (tripId, data) => api(`/trips/${tripId}/stops`, { method: 'POST', body: JSON.stringify(data) });
export const deleteTripStop = (tripId, stopId) => api(`/trips/${tripId}/stops/${stopId}`, { method: 'DELETE' });
