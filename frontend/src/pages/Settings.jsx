import React, { useState, useEffect } from 'react';
import { toast } from '../components/ui/use-toast';

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    dailyReports: false,
    weeklyReports: false,
    matchingThreshold: 80,
    nameWeight: 70,
    emailWeight: 90,
    phoneWeight: 60,
    addressWeight: 50,
    autoMerge: false,
    autoMergeThreshold: 95,
    fuzzyMatching: true,
    caseSensitive: false,
    ignoreSpaces: true,
    notifyAdmin: true
  });

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save to backend (you can implement this API endpoint)
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Failed to save settings');

      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      toast({
        title: "Success",
        description: "Settings saved successfully",
        duration: 3000,
      });
      setHasChanges(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="mt-1 text-sm text-gray-600">Configure your duplicate detection preferences and notification settings.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white 
              ${hasChanges ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
              transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Duplicate Detection Settings */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-base font-medium text-gray-900">Duplicate Detection Settings</h2>
              <p className="mt-1 text-sm text-gray-600">Adjust how the system identifies and handles duplicate records.</p>
            </div>

            <div className="p-4 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-900">Matching Threshold</label>
                <p className="text-sm text-gray-600 mb-2">Records with similarity above this threshold will be flagged as potential duplicates.</p>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.matchingThreshold}
                    onChange={(e) => handleChange('matchingThreshold', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900 min-w-[3rem]">{settings.matchingThreshold}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-900">Field Weights</label>
                <p className="text-sm text-gray-600">Adjust the importance of each field in duplicate detection.</p>
                
                {[
                  { label: 'Name', key: 'nameWeight' },
                  { label: 'Email', key: 'emailWeight' },
                  { label: 'Phone', key: 'phoneWeight' },
                  { label: 'Address', key: 'addressWeight' }
                ].map(field => (
                  <div key={field.key} className="group">
                    <div className="flex justify-between mb-1">
                      <label className="text-sm text-gray-600">{field.label}</label>
                      <span className="text-sm text-gray-900">{settings[field.key]}%</span>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity"></div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings[field.key]}
                        onChange={(e) => handleChange(field.key, parseInt(e.target.value))}
                        className="relative w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Auto-Merge Duplicates</label>
                    <p className="text-sm text-gray-600">Automatically merge records with very high similarity.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('autoMerge', !settings.autoMerge)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      settings.autoMerge ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.autoMerge ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {settings.autoMerge && (
                  <div>
                    <label className="text-sm font-medium text-gray-900">Auto-Merge Threshold</label>
                    <p className="text-sm text-gray-600 mb-2">Only auto-merge records with similarity above this threshold.</p>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="80"
                        max="100"
                        value={settings.autoMergeThreshold}
                        onChange={(e) => handleChange('autoMergeThreshold', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <span className="text-sm font-medium text-gray-900 min-w-[3rem]">{settings.autoMergeThreshold}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Advanced Settings & Notifications */}
          <div className="space-y-6">
            {/* Advanced Settings */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-base font-medium text-gray-900">Advanced Settings</h2>
                <p className="mt-1 text-sm text-gray-600">Configure advanced duplicate detection options.</p>
              </div>

              <div className="p-4 space-y-4">
                {[
                  { key: 'fuzzyMatching', label: 'Fuzzy Matching', description: 'Enable approximate string matching for better duplicate detection' },
                  { key: 'caseSensitive', label: 'Case Sensitive', description: 'Make duplicate detection case sensitive' },
                  { key: 'ignoreSpaces', label: 'Ignore Spaces', description: 'Ignore extra spaces when comparing values' }
                ].map(setting => (
                  <div key={setting.key} className="flex items-center justify-between py-2">
                    <div>
                      <label className="text-sm font-medium text-gray-900">{setting.label}</label>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange(setting.key, !settings[setting.key])}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings[setting.key] ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-base font-medium text-gray-900">Notification Preferences</h2>
                <p className="mt-1 text-sm text-gray-600">Choose how you want to be notified about duplicate records.</p>
              </div>

              <div className="p-4 space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Get notified when new duplicates are found' },
                  { key: 'dailyReports', label: 'Daily Reports', description: 'Receive a daily summary of duplicate activity' },
                  { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive a weekly analysis and statistics' },
                  { key: 'notifyAdmin', label: 'Admin Notifications', description: 'Notify administrators of critical duplicate issues' }
                ].map(notification => (
                  <div key={notification.key} className="flex items-center justify-between py-2">
                    <div>
                      <label className="text-sm font-medium text-gray-900">{notification.label}</label>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange(notification.key, !settings[notification.key])}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        settings[notification.key] ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings[notification.key] ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 