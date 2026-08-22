const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
export async function api(path, options = {}) {
  const token = localStorage.getItem('globetrotter_token');
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }, ...options });
  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || 'Request failed');
  return payload;
}
