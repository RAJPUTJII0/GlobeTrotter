import { api } from './api.js';
export const signup = (data) => api('/auth/signup', { method: 'POST', body: JSON.stringify(data) });
export const login = (data) => api('/auth/login', { method: 'POST', body: JSON.stringify(data) });
export const getMe = () => api('/auth/me');
export const updateMe = (data) => api('/auth/me', { method: 'PATCH', body: JSON.stringify(data) });
