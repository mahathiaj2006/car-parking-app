const API = 'http://localhost:5000/api';

export function getToken() { return localStorage.getItem('token'); }
export function getUser() { return JSON.parse(localStorage.getItem('user') || 'null'); }
export function saveAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}
export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
export function requireAuth() {
  if (!getToken()) { window.location.href = '/login.html'; return false; }
  return true;
}
export function requireAdmin() {
  const user = getUser();
  if (!user || user.role !== 'admin') { window.location.href = '/slots.html'; return false; }
  return true;
}

async function req(endpoint, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`;
  const res = await fetch(`${API}${endpoint}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const authAPI = {
  login: (email, password) => req('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  register: (username, email, password, phone) => req('/auth/register', { method: 'POST', body: { username, email, password, phone }, auth: false }),
};

export const slotsAPI = {
  getAll: () => req('/slots'),
  update: (id, data) => req(`/slots/${id}`, { method: 'PATCH', body: data }),
};

export const bookingsAPI = {
  getMy: () => req('/bookings/my'),
  getAll: () => req('/bookings'),
  create: (slot_id, vehicle_number) => req('/bookings', { method: 'POST', body: { slot_id, vehicle_number } }),
  cancel: (id) => req(`/bookings/cancel/${id}`, { method: 'POST' }),
  checkout: (id) => req(`/bookings/checkout/${id}`, { method: 'POST' }),
};
