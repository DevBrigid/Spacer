export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function apiFetch(path, options = {}, token = null) {
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const data = await response.json();
      errorMessage = data?.detail || data?.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
