'use client';

import { TrendingUp, TrendingDown, DollarSign, FileText, Users, Calculator } from 'lucide-react';

interface StatsCardsProps {
  stats: any;
  loading: boolean;
}

const statCards = [
  {
    title: 'Total Sales',
    key: 'totalSales',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'text-success-600',
    bgColor: 'bg-success-50',
    gradient: 'from-success-500 to-success-600',
  },
  {
    title: 'Tax Liability',
    key: 'taxLiability',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: Calculator,
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    title: 'ITC Available',
    key: 'itc',
    change: '+15.3%',
    changeType: 'positive' as const,
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Pending Returns',
    key: 'pendingReturns',
    change: '-5.1%',
    changeType: 'negative' as const,
    icon: FileText,
    color: 'text-warning-600',
    bgColor: 'bg-warning-50',
    gradient: 'from-warning-500 to-warning-600',
  },
  {
    title: 'Total Clients',
    key: 'totalClients',
    change: '+3.2%',
    changeType: 'positive' as const,
    icon: Users,
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    title: 'Active Invoices',
    key: 'activeInvoices',
    change: '+7.8%',
    changeType: 'positive' as const,
    icon: FileText,
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-50',
    gradient: 'from-secondary-500 to-secondary-600',
  },
];

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 loading-pulse w-24"></div>
                <div className="h-8 loading-pulse w-20"></div>
                <div className="h-3 loading-pulse w-16"></div>
              </div>
              <div className="w-14 h-14 loading-pulse rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const value = stats?.[stat.key] || 0;
        const formattedValue = typeof value === 'number'
          ? value.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
          })
          : value;

        return (
          <div key={index} className="stat-card group">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="stat-label">{stat.title}</p>
                <p className="stat-value">{formattedValue}</p>
                <div className="flex items-center space-x-2">
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="w-4 h-4 text-success-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-error-600" />
                  )}
                  <span className={stat.changeType === 'positive' ? 'stat-change-positive' : 'stat-change-negative'}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-sm group-hover:shadow-md transition-all duration-200`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
