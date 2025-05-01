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
          <div className="inline-flex items-center px-6 py-2 rounded-full text-base font-medium bg-primary/10 text-primary mb-8 animate-bounce">
            <span className="mr-2 text-xl">•</span>
            Eliminate Duplicate Data
          </div>
          <h1 className="text-6xl font-extrabold tracking-tight sm:text-7xl md:text-8xl">
            <span className="block mb-2 text-gray-900">Data Duplication</span>
            <span className="block bg-gradient-to-r from-blue-600 to-primary bg-clip-text text-transparent">Alert System</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base text-gray-500 sm:text-lg md:mt-6 md:text-xl md:max-w-3xl">
            Detect and remove duplicate data automatically, saving storage and improving data quality with our powerful management system.
          </p>
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
            <div className="rounded-md shadow-lg">
              <Link
                to="/signup"
                className="w-full flex items-center justify-center px-10 py-4 border border-transparent text-xl font-semibold rounded-lg text-white bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300 transform hover:scale-105 md:py-5 md:text-2xl md:px-12"
              >
                Get Started
              </Link>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4">
              <Link
                to="/signin"
                className="w-full flex items-center justify-center px-10 py-4 border-2 border-primary text-xl font-semibold rounded-lg text-primary bg-white hover:bg-primary/5 transition-all duration-300 transform hover:scale-105 md:py-5 md:text-2xl md:px-12"
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

          <div className="mt-16 flex flex-col lg:flex-row gap-8 overflow-x-auto pb-4">
            <div className="flex-1 min-w-[280px] bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Duplicate Detection</h3>
              <p className="text-gray-600">Automatically scan and identify duplicate records across your datasets using advanced matching algorithms.</p>
            </div>

            <div className="flex-1 min-w-[280px] bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Insights</h3>
              <p className="text-gray-600">Gain clear insights through interactive charts and graphs showing data duplication patterns.</p>
            </div>

            <div className="flex-1 min-w-[280px] bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CSV & Excel Support</h3>
              <p className="text-gray-600">Seamlessly import and export data from various file formats including CSV, Excel and more.</p>
            </div>

            <div className="flex-1 min-w-[280px] bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl p-6">
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

        {/* User Stats Dashboard */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Real-Time User Analytics
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Monitor user engagement and platform growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
              <div className="flex items-center mt-2">
                <span className="text-4xl font-bold text-gray-900">12,847</span>
                <span className="ml-2 text-sm text-green-500 font-semibold">+15.3%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
                <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-gray-500 text-sm font-medium">Active Users</h3>
              <div className="flex items-center mt-2">
                <span className="text-4xl font-bold text-gray-900">8,392</span>
                <span className="ml-2 text-sm text-green-500 font-semibold">+8.2%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
                <div className="bg-green-500 h-2.5 rounded-full animate-pulse" style={{ width: '67%' }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-gray-500 text-sm font-medium">New Users Today</h3>
              <div className="flex items-center mt-2">
                <span className="text-4xl font-bold text-gray-900">156</span>
                <span className="ml-2 text-sm text-green-500 font-semibold">+12.4%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4">
                <div className="bg-yellow-500 h-2.5 rounded-full animate-pulse" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>

          {/* User Growth Graph */}
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth Trends</h3>
              <div className="h-64 relative">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 0.2 }} />
                      <stop offset="100%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>

                  {/* Wave Path with Gradient Fill */}
                  <path
                    d="M0,100 C150,80 300,140 450,100 C600,60 750,120 900,100 L900,250 L0,250 Z"
                    fill="url(#gradient)"
                    className="animate-wave"
                  />

                  {/* Main Line */}
                  <path
                    d="M0,100 C150,80 300,140 450,100 C600,60 750,120 900,100"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    className="animate-wave"
                  />

                  {/* Animated Data Points */}
                  {[100, 80, 140, 100, 60, 120, 100].map((y, i) => (
                    <circle
                      key={i}
                      cx={i * 150}
                      cy={y}
                      r="4"
                      fill="#3B82F6"
                      className="animate-pulse"
                    />
                  ))}
                </svg>

                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 py-2">
                  <span>15K</span>
                  <span>12K</span>
                  <span>9K</span>
                  <span>6K</span>
                  <span>3K</span>
                  <span>0</span>
                </div>

                {/* X-axis Labels */}
                <div className="absolute bottom-0 left-12 right-0 flex justify-between px-2 pt-2 border-t border-gray-200">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={i} className="text-xs text-gray-500">{day}</div>
                  ))}
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