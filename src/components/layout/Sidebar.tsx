'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  Users,
  FileText,
  Calculator,
  BarChart3,
  Settings,
  LogOut,
  X,
  Building2,
  UserCheck,
  FileSpreadsheet,
  Shield
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'GST Filing', href: '/gst', icon: Calculator },
  { name: 'Accounting', href: '/accounting', icon: FileSpreadsheet },
  { name: 'Payroll', href: '/payroll', icon: UserCheck },
  { name: 'Tax Compliance', href: '/tax', icon: Shield },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose, user, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-secondary-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none lg:border-r lg:border-secondary-200/50
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">Digital CA</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl hover:bg-secondary-100 active:bg-secondary-200 transition-all duration-200"
            >
              <X className="w-4 h-4 text-secondary-600" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-5 border-b border-secondary-200/50 bg-secondary-50/30">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-secondary-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-secondary-500 truncate font-medium">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group ${isActive
                    ? 'sidebar-item-active'
                    : 'sidebar-item'
                    }`}
                  onClick={onClose}
                >
                  <item.icon className={`w-5 h-5 mr-3 transition-colors duration-200 ${isActive ? 'text-primary-600' : 'text-secondary-500 group-hover:text-secondary-700'
                    }`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-secondary-200/50 bg-secondary-50/30">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-secondary-600 rounded-xl hover:bg-secondary-100 hover:text-secondary-900 transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 mr-3 text-secondary-500 group-hover:text-secondary-700" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
