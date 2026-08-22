import { api } from './api.js';
export const signup = (data) => api('/auth/signup', { method: 'POST', body: JSON.stringify(data) });
export const login = (data) => api('/auth/login', { method: 'POST', body: JSON.stringify(data) });
