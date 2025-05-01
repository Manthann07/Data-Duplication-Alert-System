import { API_ENDPOINTS } from '../config/api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const validateUserData = (user) => {
  return user && typeof user === 'object' && user.name && user.email;
};

const persistUserData = (data) => {
  if (data.token && data.user && validateUserData(data.user)) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    console.log('Stored auth token and user data:', { token: data.token, user: data.user });
    return true;
  }
  console.error('Invalid user data format:', data);
  return false;
};

const authService = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser: () => {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      if (!validateUserData(user)) {
        console.error('Invalid user data in localStorage:', user);
        localStorage.removeItem(USER_KEY);
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = authService.getUser(); // Use getUser to validate the data
    return !!(token && user);
  },

  signup: async (name, email, password) => {
    try {
      console.log('Attempting signup with:', { name, email });
      const response = await fetch(API_ENDPOINTS.SIGN_UP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      console.log('Signup response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account');
      }

      if (!persistUserData(data)) {
        throw new Error('Invalid response data');
      }

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      console.log('Attempting login with email:', email);
      
      const response = await fetch(API_ENDPOINTS.SIGN_IN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Login response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      if (!persistUserData(data)) {
        throw new Error('Invalid response data');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    console.log('User logged out, cleared auth data');
  },

  updateUserData: (userData) => {
    if (validateUserData(userData)) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      console.log('Updated user data in localStorage:', userData);
      return true;
    }
    console.error('Invalid user data format for update:', userData);
    return false;
  },

  refreshUserData: async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(API_ENDPOINTS.GET_ME, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Refresh user data response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to refresh user data');
      }

      if (data.success && validateUserData(data.user)) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      } else {
        console.error('Invalid user data in refresh response:', data);
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      throw error;
    }
  },

  resendVerificationEmail: async (email) => {
    try {
      const response = await fetch(API_ENDPOINTS.RESEND_VERIFICATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification email');
      }

      return data;
    } catch (error) {
      console.error('Error resending verification:', error);
      throw error;
    }
  }
};

export default authService;