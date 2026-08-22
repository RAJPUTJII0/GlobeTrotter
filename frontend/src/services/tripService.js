import { api } from './api.js';
export const getTrips = () => api('/trips');
export const createTrip = (trip) => api('/trips', { method: 'POST', body: JSON.stringify(trip) });
export const deleteTrip = (tripId) => api(`/trips/${tripId}`, { method: 'DELETE' });
