import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { FileText, Home, Database, Search, Settings, Upload, LogOut, Bell, User, AlertTriangle, CheckCircle, Info, Menu, X, ChevronLeft, Shield, Copy } from 'lucide-react';
import { toast } from './ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Logo = ({ isMinimized = false }) => (
  <div className={`flex items-center ${isMinimized ? 'justify-center' : ''} w-full`}>
    <motion.div
      className={`relative ${isMinimized ? 'w-8 h-8' : 'w-9 h-9'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-400 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ 
            rotate: 360,
            transition: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }
          }}
          className="relative w-full h-full p-2"
        >
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Shield className="w-4 h-4 text-white/30" strokeWidth={1.5} />
          </motion.div>
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [1, 0.9, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Copy className="w-4 h-4 text-white" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
    {!isMinimized && (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="ml-3 flex items-center"
      >
        <div className="relative group">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent">
            DDAS
          </span>
          <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </motion.div>
    )}
  </div>
);

const NotificationCard = ({ notification, onClose, onAction }) => {
  const iconMap = {
    warning: AlertTriangle,
    success: CheckCircle,
    info: Info,
    download: FileText
  };
  
  const colorMap = {
    warning: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    success: 'bg-green-50 border-green-200 hover:bg-green-100',
    info: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    download: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
  };

  const iconColorMap = {
    warning: 'text-amber-500',
    success: 'text-green-500',
    info: 'text-blue-500',
    download: 'text-purple-500'
  };

  const Icon = iconMap[notification.type];

  const handleClick = () => {
    if (notification.type === 'download') {
      return; // Don't close for download notifications
    }
    onClose(notification.id);
    onAction(notification);
    
    toast({
      title: notification.message,
      description: `Action taken for notification from ${notification.time}`,
      variant: notification.type === 'warning' ? 'destructive' : 'default',
    });
  };

  const handleDownload = (e) => {
    e.stopPropagation(); // Prevent card click
    if (notification.downloadUrl) {
      window.open(notification.downloadUrl, '_blank');
      toast({
        title: "Download Started",
        description: "Your file download has begun",
        duration: 3000,
      });
    }
  };

  const handleMerge = (e) => {
    e.stopPropagation(); // Prevent card click
    if (notification.mergeAction) {
      notification.mergeAction();
      onClose(notification.id);
      toast({
        title: "Merging Data",
        description: "Starting the merge process",
        duration: 3000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={handleClick}
      className={`p-3 ${colorMap[notification.type]} border rounded-lg mb-2 last:mb-0 cursor-pointer transform transition-all duration-200 hover:scale-[0.99] active:scale-[0.97]`}
    >
      <div className="flex gap-3">
        <div className={`mt-0.5 ${iconColorMap[notification.type]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 mb-0.5">{notification.message}</p>
          <p className="text-xs text-gray-500 mb-2">{notification.time}</p>
          
          {notification.type === 'download' && (
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleDownload}
                className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
              >
                Download
              </button>
              <button
                onClick={handleMerge}
                className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
              >
                Merge
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Layout = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      message: 'New duplicate found in dataset', 
      time: '2 minutes ago',
      type: 'warning',
      action: '/duplicates'
    },
    { 
      id: 2, 
      message: 'Dataset upload completed', 
      time: '1 hour ago',
      type: 'success',
      action: '/repository'
    },
    { 
      id: 3, 
      message: 'System update available', 
      time: '2 hours ago',
      type: 'info',
      action: '/settings'
    },
    {
      id: 4,
      message: 'Unmerged data available for Dataset_001',
      time: '5 minutes ago',
      type: 'download',
      downloadUrl: '/api/downloads/dataset_001',
      mergeAction: () => {
        // Handle merge action
        console.log('Merging dataset_001');
      }
    },
    {
      id: 5,
      message: 'Unmerged records in Dataset_002',
      time: '10 minutes ago',
      type: 'download',
      downloadUrl: '/api/downloads/dataset_002',
      mergeAction: () => {
        // Handle merge action
        console.log('Merging dataset_002');
      }
    }
  ]);
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  // Handle notification actions
  const handleNotificationAction = (notification) => {
    if (notification.action) {
      navigate(notification.action);
    }
    setShowNotifications(false);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications([]);
    toast({
      title: "Success",
      description: "All notifications marked as read",
      duration: 3000,
    });
    setShowNotifications(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/signin');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  if (!localStorage.getItem('token')) {
    return <Navigate to="/signin" />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
    toast({
      title: "Success",
      description: "Logged out successfully",
      duration: 3000,
    });
  };

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Upload className="w-5 h-5" />, label: 'Upload Dataset', path: '/upload' },
    { icon: <Database className="w-5 h-5" />, label: 'Data Repository', path: '/repository' },
    { icon: <Search className="w-5 h-5" />, label: 'Duplicates', path: '/duplicates' },
    { icon: <FileText className="w-5 h-5" />, label: 'Records', path: '/records' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <motion.div 
        className={`fixed lg:relative lg:flex bg-white border-r border-gray-200 h-full z-40 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isSidebarCollapsed ? 'w-[72px]' : 'w-[200px]'}`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className={`${isSidebarCollapsed ? 'py-3 px-2' : 'py-3 px-3'} border-b border-gray-200 flex items-center relative bg-gradient-to-b from-white to-blue-50/30`}>
            <Logo isMinimized={isSidebarCollapsed} />
            <motion.button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`absolute ${
                isSidebarCollapsed 
                  ? '-right-3 top-4 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-blue-50' 
                  : 'right-3 top-4 w-6 h-6 hover:bg-blue-50 rounded-full flex items-center justify-center'
              } transition-all duration-200`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className={`w-4 h-4 text-blue-600 transition-transform duration-200 ${
                isSidebarCollapsed ? 'rotate-180' : ''
              }`} />
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-2">
            <ul className="px-2 space-y-[2px]">
              {navItems.map((item) => (
                <motion.li 
                  key={item.path}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} gap-3 px-2.5 py-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:bg-blue-50/50 hover:text-blue-600'
                      }`
                    }
                  >
                    <div className="w-5 h-5 flex-shrink-0">
                      {item.icon}
                    </div>
                    {!isSidebarCollapsed && <span className="text-[14px] whitespace-nowrap">{item.label}</span>}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className={`${isSidebarCollapsed ? 'px-2' : 'px-3'} py-2 border-t border-gray-200 bg-gradient-to-t from-white to-blue-50/30`}>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} gap-3 px-2.5 py-2 w-full text-gray-600 hover:bg-blue-50/50 hover:text-blue-600 rounded-lg transition-all duration-200`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="text-[14px] whitespace-nowrap">Logout</span>}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="flex-1 flex justify-end items-center gap-4">
            {/* Notification Button */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.length > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-[11px] text-white flex items-center justify-center font-medium shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {notifications.length}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="notifications-container absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {notifications.length === 0 
                              ? "No new notifications" 
                              : `You have ${notifications.length} new notification${notifications.length === 1 ? '' : 's'}`}
                          </p>
                        </div>
                        {notifications.length > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-3">
                      <AnimatePresence>
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <NotificationCard 
                              key={notification.id} 
                              notification={notification}
                              onClose={removeNotification}
                              onAction={handleNotificationAction}
                            />
                          ))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-6 text-center"
                          >
                            <Bell className="w-8 h-8 text-gray-300 mb-2" />
                            <p className="text-sm font-medium text-gray-500">All caught up!</p>
                            <p className="text-xs text-gray-400 mt-1">No new notifications</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Button */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.name || 'User'}
                </span>
              </motion.button>
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="profile-menu-container absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  >
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 flex items-center gap-2 transition-colors"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Your Profile</span>
                    </NavLink>
                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-left flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
