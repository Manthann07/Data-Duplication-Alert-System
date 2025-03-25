import React, { useEffect, useState } from 'react';
import Sidebar from './dashboard/Sidebar';
import Header from './dashboard/Header';
import Stats from './dashboard/Stats';
import Chart from './dashboard/Chart';
import RecentActivity from './dashboard/RecentActivity';

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`min-h-screen flex bg-gradient-to-br from-background to-background/95 opacity-0 ${loaded ? 'animate-fade-in opacity-100' : ''}`}>
      <Sidebar className="w-20 flex-shrink-0 border-r border-border/40" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto p-6 subtle-scroll">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h5 className="text-sm font-medium text-muted-foreground">Dashboard</h5>
                <h1 className="text-3xl font-bold text-foreground">Analytics Overview</h1>
              </div>
              
              <div className="flex space-x-3">
                <button className="px-4 py-2 text-sm font-medium border border-border/40 rounded-lg hover:bg-accent/50 transition-colors">
                  Export Report
                </button>
                <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  + Add New
                </button>
              </div>
            </div>
            
            <Stats />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Chart />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
