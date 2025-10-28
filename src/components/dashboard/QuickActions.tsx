'use client';

import { 
  Plus, 
  FileText, 
  Calculator, 
  Users, 
  Receipt, 
  BarChart3,
  Upload,
  Download
} from 'lucide-react';

const quickActions = [
  {
    title: 'Create Invoice',
    description: 'Generate a new GST-compliant invoice',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
    href: '/invoices/new',
  },
  {
    title: 'File GST Return',
    description: 'Submit GSTR-1, GSTR-3B, or GSTR-9',
    icon: Calculator,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100',
    href: '/gst/filing',
  },
  {
    title: 'Add Client',
    description: 'Register a new client to your system',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100',
    href: '/clients/new',
  },
  {
    title: 'Record Expense',
    description: 'Log business expenses with receipts',
    icon: Receipt,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    hoverColor: 'hover:bg-orange-100',
    href: '/accounting/expenses',
  },
  {
    title: 'Generate Report',
    description: 'Create P&L, Balance Sheet, or Tax reports',
    icon: BarChart3,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    hoverColor: 'hover:bg-indigo-100',
    href: '/reports',
  },
  {
    title: 'Import Data',
    description: 'Upload Excel/CSV files for bulk data entry',
    icon: Upload,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    hoverColor: 'hover:bg-pink-100',
    href: '/import',
  },
];

export default function QuickActions() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <a
              key={index}
              href={action.href}
              className={`
                p-4 rounded-lg border border-gray-200 transition-all duration-200
                ${action.bgColor} ${action.hoverColor} hover:shadow-md
                group cursor-pointer
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {action.description}
                  </p>
                </div>
                <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
              <Upload className="w-4 h-4" />
              <span>Bulk Import</span>
            </button>
          </div>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Help & Support
          </button>
        </div>
      </div>
    </div>
  );
}
