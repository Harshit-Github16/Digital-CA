'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface RevenueChartProps {
  data: any[];
  loading: boolean;
}

export default function RevenueChart({ data, loading }: RevenueChartProps) {
  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Mock data if no data provided
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', sales: 120000, tax: 18000, itc: 15000 },
    { month: 'Feb', sales: 150000, tax: 22500, itc: 18000 },
    { month: 'Mar', sales: 180000, tax: 27000, itc: 22000 },
    { month: 'Apr', sales: 160000, tax: 24000, itc: 19000 },
    { month: 'May', sales: 200000, tax: 30000, itc: 25000 },
    { month: 'Jun', sales: 220000, tax: 33000, itc: 28000 },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg">
            Sales
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            Tax
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `₹${value.toLocaleString('en-IN')}`,
                name === 'sales' ? 'Sales' : name === 'tax' ? 'Tax' : 'ITC'
              ]}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#0952A1" 
              strokeWidth={3}
              dot={{ fill: '#0952A1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#0952A1', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="tax" 
              stroke="#FAD456" 
              strokeWidth={3}
              dot={{ fill: '#FAD456', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#FAD456', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="itc" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <span className="text-sm text-gray-600">Sales</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-accent-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Tax</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">ITC</span>
        </div>
      </div>
    </div>
  );
}
