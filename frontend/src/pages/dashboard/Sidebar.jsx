import React from 'react';

const Sidebar = ({ className }) => {
  return (
    <aside className={`bg-background p-4 border-r ${className}`}>
      <nav className="space-y-4">
        <div className="flex items-center justify-center mb-8">
          <span className="text-2xl font-bold">Logo</span>
        </div>
        
        {/* Navigation Items */}
        <div className="space-y-2">
          <button className="w-full p-2 rounded-lg hover:bg-accent flex items-center justify-center">
            <span className="sr-only">Dashboard</span>
            📊
          </button>
          <button className="w-full p-2 rounded-lg hover:bg-accent flex items-center justify-center">
            <span className="sr-only">Settings</span>
            ⚙️
          </button>
          <button className="w-full p-2 rounded-lg hover:bg-accent flex items-center justify-center">
            <span className="sr-only">Profile</span>
            👤
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar; 