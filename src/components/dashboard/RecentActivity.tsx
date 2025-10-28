'use client';

import { Clock, FileText, CheckCircle, AlertTriangle, User } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'invoice',
    title: 'New Invoice Created',
    description: 'Invoice #INV-001234 for ABC Corp',
    time: '2 hours ago',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Received',
    description: '₹25,000 received from XYZ Industries',
    time: '4 hours ago',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 3,
    type: 'gst',
    title: 'GSTR-3B Filed',
    description: 'GSTR-3B for March 2024 submitted',
    time: '1 day ago',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 4,
    type: 'client',
    title: 'New Client Added',
    description: 'DEF Ltd added to client list',
    time: '2 days ago',
    icon: User,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 5,
    type: 'reminder',
    title: 'Due Date Reminder',
    description: 'TDS return due in 3 days',
    time: '3 days ago',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export default function RecentActivity() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${activity.bgColor}`}>
                <Icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                <div className="flex items-center mt-1 space-x-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium py-2 hover:bg-primary-50 rounded-lg transition-colors duration-200">
          Load More Activities
        </button>
      </div>
    </div>
  );
}
