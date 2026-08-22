import { api } from './api.js';

export const getActivities = (cityId) => api(`/activities?cityId=${encodeURIComponent(cityId)}`);
export const addActivity = (stopId, data) => api(`/stops/${stopId}/activities`, {
	method: 'POST',
	body: JSON.stringify(data),
});
export const deleteActivity = (stopActivityId) => api(`/stop-activities/${stopActivityId}`, {
	method: 'DELETE',
});
