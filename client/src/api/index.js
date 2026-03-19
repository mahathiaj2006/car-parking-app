const API_BASE_URL = 'http://localhost:5000/api';

class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiCall(endpoint, options = {}) {
  const { method = 'GET', body, token } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new APIError(data.message || 'API request failed', response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message || 'Network error', 500);
  }
}

// Auth API
export const authAPI = {
  register: (username, email, password, phone) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: { username, email, password, phone },
    }),

  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
};

// Slots API
export const slotsAPI = {
  getAll: (token) => apiCall('/slots', { token }),
  getById: (id, token) => apiCall(`/slots/${id}`, { token }),
  update: (id, data, token) =>
    apiCall(`/slots/${id}`, {
      method: 'PATCH',
      body: data,
      token,
    }),
  create: (data, token) =>
    apiCall('/slots', {
      method: 'POST',
      body: data,
      token,
    }),
};

// Bookings API
export const bookingsAPI = {
  getMyBookings: (token) => apiCall('/bookings/my', { token }),
  getAllBookings: (token) => apiCall('/bookings', { token }),
  getById: (id, token) => apiCall(`/bookings/${id}`, { token }),
  create: (slot_id, vehicle_number, token) =>
    apiCall('/bookings', {
      method: 'POST',
      body: { slot_id, vehicle_number },
      token,
    }),
  cancel: (id, token) =>
    apiCall(`/bookings/cancel/${id}`, {
      method: 'POST',
      token,
    }),
  checkout: (id, token) =>
    apiCall(`/bookings/checkout/${id}`, {
      method: 'POST',
      token,
    }),
};
