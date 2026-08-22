const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://globetrotter-api-v2.vercel.app/api' : 'http://localhost:5000/api');
export async function api(path, options = {}) {
  const token = options.token ?? localStorage.getItem('globetrotter_token') ?? localStorage.getItem('token') ?? localStorage.getItem('accessToken');
  const { token: _token, ...requestOptions } = options;
  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || 'Request failed');
  return payload;
}
