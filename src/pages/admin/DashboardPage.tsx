import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { RadioIcon, UsersIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react';
import { DatabaseStatus } from '../../components/DatabaseStatus';

export const DashboardPage = (): JSX.Element => {
  const stats = [
    {
      name: 'Total Programs',
      value: '3',
      icon: RadioIcon,
      color: 'bg-blue-500',
      description: 'Active radio programs'
    },
    {
      name: 'Staff Members',
      value: '6',
      icon: UsersIcon,
      color: 'bg-green-500',
      description: 'Organization members'
    },
    {
      name: 'Upcoming Events',
      value: '2',
      icon: CalendarIcon,
      color: 'bg-purple-500',
      description: 'Scheduled events'
    },
    {
      name: 'Total Schedules',
      value: '24',
      icon: TrendingUpIcon,
      color: 'bg-orange-500',
      description: 'Active schedules'
    },
  ];

  const recentActivity = [
    { action: 'New schedule added', program: 'Pro 1', time: '2 hours ago' },
    { action: 'Event updated', program: 'Festival Musik', time: '4 hours ago' },
    { action: 'Staff member added', program: 'Organization', time: '1 day ago' },
    { action: 'Program schedule modified', program: 'Pro 2', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to RRI Jambi Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Status */}
        <div className="lg:col-span-2">
          <DatabaseStatus />
        </div>

        {/* Recent Activity */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.program}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="font-medium text-blue-900">Add New Schedule</div>
                <div className="text-sm text-blue-600">Create a new program schedule</div>
              </button>
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="font-medium text-green-900">Create Event</div>
                <div className="text-sm text-green-600">Add a new upcoming event</div>
              </button>
              <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <div className="font-medium text-purple-900">Manage Staff</div>
                <div className="text-sm text-purple-600">Update organization structure</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Database: Online</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">API: Operational</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Streaming: Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};