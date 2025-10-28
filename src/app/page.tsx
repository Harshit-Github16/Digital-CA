'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Home } from 'lucide-react';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchDashboardStats, fetchChartData } from '@/lib/slices/dashboardSlice';
import { verifyToken } from '@/lib/slices/authSlice';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import RevenueChart from '@/components/dashboard/RevenueChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { stats, chartData, loading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    // Verify token on app initialization
    dispatch(verifyToken());
  }, [dispatch]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated) {
      dispatch(fetchDashboardStats());
      dispatch(fetchChartData());
    }
  }, [isAuthenticated, authLoading, router, dispatch]);

  // Show loading while verifying authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50/30">
        <div className="text-center space-y-4">
          <div className="loading-spinner h-12 w-12 mx-auto"></div>
          <p className="text-secondary-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <div className="gradient-primary rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-primary-100 text-lg">
                Here's what's happening with your business today.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Home className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} loading={loading} />

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <RevenueChart data={chartData} loading={loading} />
          </div>
          <div className="xl:col-span-1">
            <RecentActivity />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </DashboardLayout>
  );
}
