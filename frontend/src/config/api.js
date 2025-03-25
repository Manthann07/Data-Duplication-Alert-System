// API Configuration
export const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth`,
  HEALTH: `${API_BASE_URL}/api/health`,
  STATS: `${API_BASE_URL}/api/stats`,
  UPLOAD: `${API_BASE_URL}/api/records`,
  EXPORT: `${API_BASE_URL}/api/records`,
  DUPLICATES: `${API_BASE_URL}/api/records/duplicates`,
  RECORDS: `${API_BASE_URL}/api/records`,
  datasets: `${API_BASE_URL}/api/datasets`,
};

export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  credentials: 'include'
};

// Get auth headers with token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...API_CONFIG.headers,
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Helper function to check if the server is running
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.message || 'An error occurred';
  }
  return error.message || 'Network error occurred';
}; 