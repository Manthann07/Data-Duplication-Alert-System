import React from 'react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'completed task',
      target: 'Project Setup',
      time: '2 hours ago'
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'commented on',
      target: 'Design Review',
      time: '4 hours ago'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'created',
      target: 'New Feature',
      time: '6 hours ago'
    },
    {
      id: 4,
      user: 'Sarah Wilson',
      action: 'updated',
      target: 'Documentation',
      time: '8 hours ago'
    }
  ];

  return (
    <div className="glass-card rounded-xl p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-background/40 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              {activity.user.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>
                {' '}
                <span className="text-muted-foreground">{activity.action}</span>
                {' '}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity; 