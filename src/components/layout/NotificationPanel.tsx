'use client';

import { X, AlertCircle, CheckCircle, Info, Clock } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    type: 'warning',
    title: 'GSTR-3B Due Soon',
    message: 'GSTR-3B for March 2024 is due in 3 days',
    time: '2 hours ago',
    icon: AlertCircle,
  },
  {
    id: 2,
    type: 'success',
    title: 'Invoice Paid',
    message: 'Invoice #INV-001234 has been paid by ABC Corp',
    time: '4 hours ago',
    icon: CheckCircle,
  },
  {
    id: 3,
    type: 'info',
    title: 'New Client Added',
    message: 'XYZ Industries has been added to your client list',
    time: '1 day ago',
    icon: Info,
  },
  {
    id: 4,
    type: 'warning',
    title: 'TDS Return Due',
    message: 'TDS return for Q4 2023-24 is due in 5 days',
    time: '2 days ago',
    icon: Clock,
  },
];

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              const typeColors = {
                warning: 'text-yellow-600 bg-yellow-50',
                success: 'text-green-600 bg-green-50',
                info: 'text-blue-600 bg-blue-50',
              };

              return (
                <div
                  key={notification.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${typeColors[notification.type as keyof typeof typeColors]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
              Mark all as read
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
