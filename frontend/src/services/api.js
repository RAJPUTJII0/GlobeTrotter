const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
export async function api(path, options = {}) {
  const token = options.token ?? localStorage.getItem('token') ?? localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const { token: _token, ...requestOptions } = options;
  const response = await fetch(`${API_URL}${path}`, { ...requestOptions, headers });
  if (!response.ok) throw new Error('Request failed');
  if (response.status === 204) return null;
  return response.json();
}
