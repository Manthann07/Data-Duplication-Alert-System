import React from 'react';

const Stats = () => {
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%' },
    { label: 'Revenue', value: '$12,345', change: '+8%' },
    { label: 'Active Projects', value: '45', change: '+5%' },
    { label: 'Completion Rate', value: '92%', change: '+3%' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="glass-card p-6 rounded-xl">
          <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold">{stat.value}</p>
            <span className="ml-2 text-sm font-medium text-green-500">{stat.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats; 