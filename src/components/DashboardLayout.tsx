'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { logoutUser } from '@/lib/slices/authSlice';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import NotificationPanel from './layout/NotificationPanel';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen bg-secondary-50/30">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onNotificationClick={() => setNotificationOpen(true)}
          user={user}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </div>
  );
}
