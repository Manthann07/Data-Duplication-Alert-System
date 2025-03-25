import { API_ENDPOINTS, API_CONFIG, handleApiError } from '../config/api';

const API_URL = 'http://localhost:5000/api';

// Hardcoded users for demo
let DEMO_USERS = [
  {
    id: 1,
    email: '23it007@charusat.edu.in',
    password: '********', // Using the password you entered
    name: '23IT007' // Changed from Demo User to match student ID
  }
];

export const signup = async (name, email, password) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.LOGIN}/register`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create account');
    }

    // Store auth data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.LOGIN}/login`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Invalid credentials');
    }

    // Store auth data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Verify token expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp < Date.now() / 1000) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}; 