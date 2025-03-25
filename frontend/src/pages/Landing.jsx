import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-semibold text-foreground">DDAS</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/signin" className="text-muted-foreground hover:text-foreground">Sign in</Link>
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-8">
            <span className="mr-2">•</span>
            Eliminate Duplicate Data
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            <span className="block">Manage Data With Intelligence</span>
            <span className="block text-primary">and Precision</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Detect and remove duplicate data automatically, saving storage and improving data quality with our powerful management system.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/signup"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                to="/signin"
                className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Powerful Features for Data Management
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Our comprehensive toolset helps you manage, clean, and optimize your data efficiently.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Duplicate Detection</h3>
                  <p className="text-gray-600">Automatically scan and identify duplicate records across your datasets using advanced matching algorithms.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Insights</h3>
                  <p className="text-gray-600">Gain clear insights through interactive charts and graphs showing data duplication patterns.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">CSV & Excel Support</h3>
                  <p className="text-gray-600">Seamlessly import and export data from various file formats including CSV, Excel and more.</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Suggestions</h3>
                  <p className="text-gray-600">Receive intelligent recommendations for handling duplicates based on your data patterns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Powerful Analytics Dashboard
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Get real-time insights into your data duplication patterns
            </p>
          </div>
          <div className="relative rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-200">
            {/* Mock Dashboard Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Last 7 Days</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Last Month</button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Custom Range</button>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Mock Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50">
              {/* Stats Cards */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 text-sm">Total Duplicates</h3>
                  <span className="text-green-500 text-sm">+12.5%</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mt-2">2,847</p>
                <div className="mt-4 h-2 bg-gray-200 rounded">
                  <div className="h-2 bg-blue-600 rounded" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 text-sm">Resolved</h3>
                  <span className="text-green-500 text-sm">+8.2%</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mt-2">1,923</p>
                <div className="mt-4 h-2 bg-gray-200 rounded">
                  <div className="h-2 bg-green-500 rounded" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 text-sm">Pending</h3>
                  <span className="text-red-500 text-sm">-2.4%</span>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mt-2">924</p>
                <div className="mt-4 h-2 bg-gray-200 rounded">
                  <div className="h-2 bg-yellow-500 rounded" style={{ width: '35%' }}></div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="col-span-3 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Duplicate Detection Trends</h3>
                <div className="h-64 relative">
                  {/* Mock Chart Bars */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-48 px-2">
                    {[65, 45, 75, 50, 60, 70, 40].map((height, index) => (
                      <div key={index} className="w-1/8 mx-1">
                        <div 
                          className="bg-blue-600 rounded-t"
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  {/* X-axis Labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pt-2 border-t border-gray-200">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={index} className="text-xs text-gray-500">{day}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">Data Privacy</h4>
                <p className="mt-2 text-base text-gray-500">Keep your data secure and private with our robust security measures.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">Action History</h4>
                <p className="mt-2 text-base text-gray-500">Track all actions on your data with a comprehensive history log.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">Customizable Rules</h4>
                <p className="mt-2 text-base text-gray-500">Set your own custom duplicate detection rules to match your needs.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">Batch Processing</h4>
                <p className="mt-2 text-base text-gray-500">Handle large datasets efficiently with optimized batch processing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 