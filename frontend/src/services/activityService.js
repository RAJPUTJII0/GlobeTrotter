import { api } from './api.js';

export const getActivities = (cityId) => api(`/activities?cityId=${encodeURIComponent(cityId)}`);
export const searchActivities = (cityId, filters = {}) => {
	const params = new URLSearchParams({ cityId, ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '' && value != null)) });
	return api(`/activities?${params.toString()}`);
};
export const addActivity = (stopId, data) => api(`/stops/${stopId}/activities`, {
	method: 'POST',
	body: JSON.stringify(data),
});
export const deleteActivity = (stopActivityId) => api(`/stop-activities/${stopActivityId}`, {
	method: 'DELETE',
});
export const reorderActivity = (stopId, stopActivityId, activityOrder) => api(`/stops/${stopId}/activities/${stopActivityId}`, { method: 'PATCH', body: JSON.stringify({ activityOrder }) });
