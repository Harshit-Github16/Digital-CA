'use client';

import { Bell, Menu, Search, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onNotificationClick: () => void;
  user: any;
}

export default function Header({ onMenuClick, onNotificationClick, user }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-secondary-200/50 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-secondary-100 active:bg-secondary-200 transition-all duration-200"
          >
            <Menu className="w-5 h-5 text-secondary-600" />
          </button>

          {/* Search */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="Search clients, invoices, reports..."
              className="input w-80 pl-10 pr-4 py-2.5 bg-secondary-50/50 border-secondary-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-2.5 rounded-xl hover:bg-secondary-100 active:bg-secondary-200 transition-all duration-200 group"
          >
            <Bell className="w-5 h-5 text-secondary-600 group-hover:text-secondary-700" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-3 border-l border-secondary-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-secondary-900">{user?.name}</p>
              <p className="text-xs text-secondary-500 capitalize font-medium">{user?.role}</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
