// =============================================================================
// Admin Service
// Backend URL is read from VITE_BACKEND_URL in .env
// =============================================================================

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

const getToken = () => localStorage.getItem('admin_token') || '';

const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || `Error: ${response.status}`);
  }
  return data;
};

// Auth
export const adminLogin = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Invalid admin credentials');
  // Store the token in localStorage so subsequent calls use it
  if (data.token) {
    localStorage.setItem('admin_token', data.token);
  }
  return data.admin || data;
};

// Properties
export const getAllProperties = async () => {
  return apiCall('/admin/properties');
};

export const createAdminProperty = async (data) => {
  return apiCall('/admin/properties', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const deleteAdminProperty = async (id) => {
  return apiCall(`/admin/properties/${id}`, {
    method: 'DELETE',
  });
};

export const getPendingProperties = async () => {
  const all = await getAllProperties();
  return Array.isArray(all) ? all.filter(p => p.status === 'pending') : [];
};

export const approveProperty = async (id) => {
  return apiCall(`/admin/properties/${id}/approve`, { method: 'PUT' });
};

export const rejectProperty = async (id, reason) => {
  return apiCall(`/admin/properties/${id}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  });
};

// Users
export const getAllUsers = async () => {
  return apiCall('/admin/landlords');
};

// Transactions
export const getAllTransactions = async () => {
  return apiCall('/admin/transactions');
};

// Statistics
export const getStatistics = async () => {
  return apiCall('/admin/statistics');
};

// Settings
export const getConnectionFee = async () => {
  const response = await fetch(`${API_BASE}/settings/connection-fee`);
  return response.json();
};

export const updateConnectionFee = async (fee) => {
  return apiCall('/settings/connection-fee', {
    method: 'PUT',
    body: JSON.stringify({ connection_fee: fee }),
  });
};

// Messages
export const getMessages = async () => {
  return apiCall('/admin/messages');
};

export const markMessageAsRead = async (id) => {
  return apiCall(`/admin/messages/${id}/read`, { method: 'PUT' });
};

export const deleteMessage = async (id) => {
  return apiCall(`/admin/messages/${id}`, { method: 'DELETE' });
};

// Testimonials
export const getTestimonials = async () => {
  return apiCall('/admin/testimonials');
};

export const createTestimonial = async (data) => {
  return apiCall('/admin/testimonials', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateTestimonial = async (id, data) => {
  return apiCall(`/admin/testimonials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteTestimonial = async (id) => {
  return apiCall(`/admin/testimonials/${id}`, { method: 'DELETE' });
};

// Newsletter Subscribers
export const getSubscribers = async () => {
  return apiCall('/admin/newsletter/subscribers');
};

export const removeSubscriber = async (id) => {
  return apiCall(`/admin/newsletter/subscribers/${id}`, { method: 'DELETE' });
};

export const changeAdminPassword = async (current_password, new_password) => {
  return apiCall('/admin/change-password', {
    method: 'PUT',
    body: JSON.stringify({ current_password, new_password }),
  });
};
