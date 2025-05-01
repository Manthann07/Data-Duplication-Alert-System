// API Configuration
export const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  SIGN_IN: `${API_BASE_URL}/auth/login`,
  SIGN_UP: `${API_BASE_URL}/auth/register`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
  RESEND_VERIFICATION: `${API_BASE_URL}/auth/resend-verification`,
  CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
  GET_ME: `${API_BASE_URL}/auth/me`,
  
  // File endpoints
  UPLOAD_FILE: `${API_BASE_URL}/files/upload`,
  GET_FILES: `${API_BASE_URL}/files`,
  GET_FILE: `${API_BASE_URL}/files/:id`,
  DOWNLOAD_FILE: `${API_BASE_URL}/files/download/:id/:format`,
  DELETE_FILE: `${API_BASE_URL}/files/:id`,
  CHECK_DUPLICATES: `${API_BASE_URL}/files/:id/check-duplicates`,
  ANALYZE_FILE: `${API_BASE_URL}/files/analyze`,
  HEALTH: `${API_BASE_URL}/health`,
  STATS: `${API_BASE_URL}/stats`
};

export const API_CONFIG = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  mode: 'cors',
  credentials: 'include'
};

// Get auth headers with token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  if (token) {
    console.log('Adding auth token to headers:', token);
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('No authentication token found');
  }

  return headers;
};

// Helper function to handle API errors
export const handleApiError = async (response) => {
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'API request failed');
  }
  return response;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Helper function to check if the server is running
export const checkServerHealth = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH, {
      ...API_CONFIG,
      method: 'GET',
    });
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};
