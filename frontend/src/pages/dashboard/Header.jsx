import React from 'react';

const Header = () => {
  return (
    <header className="border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-accent rounded-full">
            🔔
          </button>
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
            👤
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 