import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../components/ui/use-toast';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';
import authService from '../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // Initialize from authService
    const userData = authService.getUser();
    if (!userData) {
      console.log('No user data found in localStorage');
    }
    console.log('Initial user data:', userData);
    return userData;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check if we have valid local data
        const localUser = authService.getUser();
        if (localUser && localUser.name && localUser.email) {
          console.log('Using valid local user data:', localUser);
          setUser(localUser);
          setIsLoading(false);
          return;
        }

        if (!authService.isAuthenticated()) {
          console.log('User not authenticated, redirecting to login');
          navigate('/signin');
          return;
        }

        // Try to refresh user data from the server
        const userData = await authService.refreshUserData();
        console.log('Refreshed user data from server:', userData);
        if (userData && userData.name && userData.email) {
          setUser(userData);
          // Update local storage
          authService.updateUserData(userData);
        } else {
          throw new Error('Invalid user data received from server');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        
        // Final check for valid local data
        const localUser = authService.getUser();
        if (localUser && localUser.name && localUser.email) {
          console.log('Falling back to cached user data:', localUser);
          setUser(localUser);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile data. Please try logging in again.",
          });
          authService.logout();
          navigate('/signin');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match",
      });
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      setShowChangePassword(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to change password",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !user.name || !user.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Data Unavailable</h2>
          <p className="text-gray-600 mb-4">Unable to load your profile data. Please try signing in again.</p>
          <button
            onClick={() => {
              authService.logout();
              navigate('/signin');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-16 left-8">
              <div className="flex items-center">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-600">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="mt-20 px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Personal Info & Activity */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900">{user.name || 'Loading...'}</h1>
                  <p className="text-gray-500">{user.email || 'Loading...'}</p>
                </div>

                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                  <div className="bg-gray-50 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                      <p className="text-gray-900 font-medium">{user.name || 'Not available'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                      <p className="text-gray-900 font-medium">{user.email || 'Not available'}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                          <span className="text-gray-900">Logged in successfully</span>
                        </div>
                        <span className="text-sm text-gray-500">Just now</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column - Settings */}
              <div>
                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4">
                      <button
                        onClick={() => setShowChangePassword(!showChangePassword)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between shadow-sm"
                      >
                        <span className="font-medium">Change Password</span>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {showChangePassword && (
                        <form onSubmit={handlePasswordChange} className="mt-4 space-y-4 bg-white p-4 rounded-lg border border-gray-200">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                              Current Password
                            </label>
                            <input
                              type="password"
                              id="currentPassword"
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="newPassword"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirmPassword"
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setShowChangePassword(false)}
                              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                              Change Password
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 