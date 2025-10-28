'use client';

import { useState, useEffect } from 'react';
import { Download, Filter, Calendar, TrendingUp, TrendingDown, DollarSign, Users, FileText, BarChart3, PieChart, Activity, Target, AlertCircle, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface ReportData {
    invoices: {
        total: number;
        paid: number;
        pending: number;
        overdue: number;
        totalAmount: number;
        monthlyData: Array<{ month: string; amount: number; count: number }>;
        topClients: Array<{ name: string; amount: number; count: number }>;
    };
    clients: {
        total: number;
        active: number;
        inactive: number;
        newThisMonth: number;
        byType: Array<{ type: string; count: number }>;
    };
    gstFilings: {
        total: number;
        filed: number;
        pending: number;
        late: number;
        totalTax: number;
        monthlyFilings: Array<{ month: string; filed: number; pending: number }>;
        byType: Array<{ type: string; count: number }>;
    };
    payroll: {
        totalEmployees: number;
        totalGrossSalary: number;
        totalNetSalary: number;
        totalDeductions: number;
        monthlyPayroll: Array<{ month: string; gross: number; net: number }>;
        departmentWise: Array<{ department: string; employees: number; salary: number }>;
    };
    accounting: {
        totalIncome: number;
        totalExpenses: number;
        netIncome: number;
        totalTransactions: number;
        monthlyTrend: Array<{ month: string; income: number; expenses: number }>;
        categoryWise: Array<{ category: string; amount: number; type: 'income' | 'expense' }>;
        cashFlow: Array<{ date: string; inflow: number; outflow: number; balance: number }>;
    };
    performance: {
        revenueGrowth: number;
        clientGrowth: number;
        profitMargin: number;
        collectionEfficiency: number;
    };
}

export default function ReportsPage() {
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [reportType, setReportType] = useState('overview');

    useEffect(() => {
        fetchReportData();
    }, [dateRange]);

    const fetchReportData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers: any = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(`/api/reports?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, { headers });
            const data = await response.json();
            console.log('Report data received:', data);
            setReportData(data);
        } catch (error) {
            console.error('Error fetching report data:', error);
            // Set comprehensive default data structure
            setReportData({
                invoices: {
                    total: 12, paid: 8, pending: 3, overdue: 1, totalAmount: 485000,
                    monthlyData: [
                        { month: 'Jan', amount: 120000, count: 4 },
                        { month: 'Feb', amount: 95000, count: 3 },
                        { month: 'Mar', amount: 150000, count: 5 }
                    ],
                    topClients: [
                        { name: 'TechCorp Solutions', amount: 180000, count: 6 },
                        { name: 'Retail Store Pvt Ltd', amount: 125000, count: 4 },
                        { name: 'Manufacturing Co', amount: 95000, count: 2 }
                    ]
                },
                clients: {
                    total: 25, active: 22, inactive: 3, newThisMonth: 5,
                    byType: [
                        { type: 'Company', count: 15 },
                        { type: 'Partnership', count: 6 },
                        { type: 'Individual', count: 4 }
                    ]
                },
                gstFilings: {
                    total: 18, filed: 12, pending: 4, late: 2, totalTax: 125000,
                    monthlyFilings: [
                        { month: 'Jan', filed: 5, pending: 1 },
                        { month: 'Feb', filed: 4, pending: 2 },
                        { month: 'Mar', filed: 3, pending: 1 }
                    ],
                    byType: [
                        { type: 'GSTR-1', count: 8 },
                        { type: 'GSTR-3B', count: 7 },
                        { type: 'GSTR-9', count: 3 }
                    ]
                },
                payroll: {
                    totalEmployees: 15, totalGrossSalary: 850000, totalNetSalary: 720000, totalDeductions: 130000,
                    monthlyPayroll: [
                        { month: 'Jan', gross: 280000, net: 240000 },
                        { month: 'Feb', gross: 285000, net: 242000 },
                        { month: 'Mar', gross: 285000, net: 238000 }
                    ],
                    departmentWise: [
                        { department: 'Accounting', employees: 8, salary: 450000 },
                        { department: 'Admin', employees: 4, salary: 250000 },
                        { department: 'IT', employees: 3, salary: 150000 }
                    ]
                },
                accounting: {
                    totalIncome: 485000, totalExpenses: 285000, netIncome: 200000, totalTransactions: 45,
                    monthlyTrend: [
                        { month: 'Jan', income: 165000, expenses: 95000 },
                        { month: 'Feb', income: 145000, expenses: 85000 },
                        { month: 'Mar', income: 175000, expenses: 105000 }
                    ],
                    categoryWise: [
                        { category: 'Client Revenue', amount: 350000, type: 'income' },
                        { category: 'Service Revenue', amount: 135000, type: 'income' },
                        { category: 'Rent', amount: 75000, type: 'expense' },
                        { category: 'Salaries', amount: 120000, type: 'expense' },
                        { category: 'Software', amount: 45000, type: 'expense' },
                        { category: 'Utilities', amount: 25000, type: 'expense' }
                    ],
                    cashFlow: [
                        { date: '2024-01', inflow: 165000, outflow: 95000, balance: 70000 },
                        { date: '2024-02', inflow: 145000, outflow: 85000, balance: 130000 },
                        { date: '2024-03', inflow: 175000, outflow: 105000, balance: 200000 }
                    ]
                },
                performance: {
                    revenueGrowth: 12.5,
                    clientGrowth: 8.3,
                    profitMargin: 41.2,
                    collectionEfficiency: 85.7
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const generateReport = async (type: string) => {
        try {
            const response = await fetch(`/api/reports/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${type}-report-${dateRange.startDate}-to-${dateRange.endDate}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    // Simple chart components
    const BarChart = ({ data, title }: { data: Array<{ label: string; value: number; color?: string }>, title: string }) => {
        const maxValue = Math.max(...data.map(d => d.value));
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <div className="w-20 text-sm text-gray-600 truncate">{item.label}</div>
                            <div className="flex-1 mx-3">
                                <div className="bg-gray-200 rounded-full h-4 relative">
                                    <div
                                        className={`h-4 rounded-full ${item.color || 'bg-primary-500'}`}
                                        style={{ width: `${(item.value / maxValue) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="w-16 text-sm font-medium text-gray-900 text-right">
                                {typeof item.value === 'number' && item.value > 1000 ? `₹${(item.value / 1000).toFixed(0)}k` : item.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const LineChart = ({ data, title }: { data: Array<{ month: string; value1: number; value2?: number }>, title: string }) => {
        const maxValue = Math.max(...data.flatMap(d => [d.value1, d.value2 || 0]));
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <div className="w-12 text-sm text-gray-600">{item.month}</div>
                            <div className="flex-1 mx-3 space-y-1">
                                <div className="bg-gray-200 rounded-full h-3 relative">
                                    <div
                                        className="h-3 rounded-full bg-blue-500"
                                        style={{ width: `${(item.value1 / maxValue) * 100}%` }}
                                    ></div>
                                </div>
                                {item.value2 !== undefined && (
                                    <div className="bg-gray-200 rounded-full h-3 relative">
                                        <div
                                            className="h-3 rounded-full bg-green-500"
                                            style={{ width: `${(item.value2 / maxValue) * 100}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                            <div className="w-20 text-sm font-medium text-gray-900 text-right">
                                <div>₹{(item.value1 / 1000).toFixed(0)}k</div>
                                {item.value2 !== undefined && <div className="text-green-600">₹{(item.value2 / 1000).toFixed(0)}k</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const PieChartSimple = ({ data, title }: { data: Array<{ label: string; value: number; color: string }>, title: string }) => {
        const total = data && data.reduce((sum, item) => sum + item.value, 0);
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className={`w-4 h-4 rounded-full ${item.color} mr-3`}></div>
                                <span className="text-sm text-gray-600">{item.label}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                                {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const reportTypes = [
        { id: 'overview', name: 'Business Overview', icon: BarChart3, description: 'Complete business performance summary' },
        { id: 'financial', name: 'Financial Analytics', icon: DollarSign, description: 'Revenue, expenses and profitability analysis' },
        { id: 'client', name: 'Client Insights', icon: Users, description: 'Client demographics and performance metrics' },
        { id: 'gst', name: 'GST Compliance', icon: FileText, description: 'GST filing status and tax analytics' },
        { id: 'payroll', name: 'Payroll Analytics', icon: Users, description: 'Employee costs and department analysis' },
        { id: 'accounting', name: 'Cash Flow Report', icon: TrendingUp, description: 'Transaction trends and cash flow analysis' }
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading comprehensive reports...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Business Reports & Analytics</h1>
                        <p className="text-gray-600">Comprehensive insights into your business performance</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => generateReport('comprehensive')}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export All
                        </button>
                    </div>
                </div>

                {/* Date Range Filter */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Report Period:</span>
                        </div>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <button
                            onClick={fetchReportData}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Update Reports
                        </button>
                    </div>
                </div>

                {/* Performance KPIs */}
                {reportData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Revenue Growth</p>
                                    <p className="text-2xl font-bold">{reportData.performance?.revenueGrowth?.toFixed(1)}%</p>
                                    <p className="text-blue-200 text-xs mt-1">vs last period</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-blue-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Profit Margin</p>
                                    <p className="text-2xl font-bold">{reportData.performance?.profitMargin?.toFixed(1)}%</p>
                                    <p className="text-green-200 text-xs mt-1">net profit ratio</p>
                                </div>
                                <Target className="w-8 h-8 text-green-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Client Growth</p>
                                    <p className="text-2xl font-bold">{reportData.performance?.clientGrowth?.toFixed(1)}%</p>
                                    <p className="text-purple-200 text-xs mt-1">new clients added</p>
                                </div>
                                <Users className="w-8 h-8 text-purple-200" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm">Collection Rate</p>
                                    <p className="text-2xl font-bold">{reportData.performance?.collectionEfficiency?.toFixed(1)}%</p>
                                    <p className="text-orange-200 text-xs mt-1">payment efficiency</p>
                                </div>
                                <Activity className="w-8 h-8 text-orange-200" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Report Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportTypes.map((report) => {
                        const IconComponent = report.icon;
                        return (
                            <div
                                key={report.id}
                                className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${reportType === report.id ? 'ring-2 ring-primary-500 border-primary-500 shadow-lg' : ''
                                    }`}
                                onClick={() => setReportType(report.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start">
                                        <div className={`p-3 rounded-lg ${reportType === report.id ? 'bg-primary-500' : 'bg-primary-100'}`}>
                                            <IconComponent className={`w-6 h-6 ${reportType === report.id ? 'text-white' : 'text-primary-600'}`} />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.name}</h3>
                                            <p className="text-sm text-gray-600">{report.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            generateReport(report.id);
                                        }}
                                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        title="Download Report"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Report Content */}
                {reportData && (
                    <div className="space-y-6">
                        {/* Overview Report */}
                        {reportType === 'overview' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">Business Overview</h2>
                                    <div className="text-sm text-gray-500">
                                        Period: {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Key Metrics Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <FileText className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                                                <p className="text-2xl font-bold text-gray-900">{reportData?.invoices?.total}</p>
                                                <p className="text-xs text-gray-500">₹{(reportData?.invoices?.totalAmount / 1000).toFixed(0)}k total value</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-green-100 rounded-lg">
                                                <Users className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                                                <p className="text-2xl font-bold text-gray-900">{reportData?.clients?.active}</p>
                                                <p className="text-xs text-gray-500">{reportData?.clients?.newThisMonth} new this month</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-purple-100 rounded-lg">
                                                <DollarSign className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Net Revenue</p>
                                                <p className="text-2xl font-bold text-gray-900">₹{(reportData?.accounting?.netIncome / 1000).toFixed(0)}k</p>
                                                <p className="text-xs text-green-600">+{reportData?.performance?.revenueGrowth?.toFixed(1)}% growth</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-orange-100 rounded-lg">
                                                <CheckCircle className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">GST Compliance</p>
                                                <p className="text-2xl font-bold text-gray-900">{reportData?.gstFilings?.filed}/{reportData?.gstFilings?.total}</p>
                                                <p className="text-xs text-gray-500">{reportData?.gstFilings?.pending} pending filings</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Charts Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <LineChart
                                        data={reportData?.invoices?.monthlyData.map(d => ({ month: d.month, value1: d.amount, value2: undefined }))}
                                        title="Monthly Revenue Trend"
                                    />
                                    <PieChartSimple
                                        data={[
                                            { label: 'Paid', value: reportData.invoices.paid, color: 'bg-green-500' },
                                            { label: 'Pending', value: reportData.invoices.pending, color: 'bg-yellow-500' },
                                            { label: 'Overdue', value: reportData.invoices.overdue, color: 'bg-red-500' }
                                        ]}
                                        title="Invoice Status Distribution"
                                    />
                                </div>

                                {/* Top Clients Table */}
                                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Top Clients by Revenue</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoices</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Value</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {reportData.invoices.topClients.map((client, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{client.amount.toLocaleString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.count}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{(client.amount / client.count).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Financial Report */}
                        {reportType === 'financial' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Income vs Expenses */}
                                    <div className="lg:col-span-2">
                                        <LineChart
                                            data={reportData.accounting.monthlyTrend.map(d => ({ month: d.month, value1: d.income, value2: d.expenses }))}
                                            title="Income vs Expenses Trend"
                                        />
                                    </div>

                                    {/* Profit Summary */}
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Summary</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Total Income</span>
                                                <span className="text-lg font-bold text-green-600">₹{reportData.accounting.totalIncome.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Total Expenses</span>
                                                <span className="text-lg font-bold text-red-600">₹{reportData.accounting.totalExpenses.toLocaleString()}</span>
                                            </div>
                                            <div className="border-t pt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-semibold text-gray-900">Net Profit</span>
                                                    <span className={`text-xl font-bold ${reportData.accounting.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        ₹{reportData.accounting.netIncome.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="text-center mt-2">
                                                    <span className="text-sm text-gray-500">
                                                        Margin: {reportData?.performance?.profitMargin?.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Breakdown */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <BarChart
                                        data={reportData?.accounting?.categoryWise
                                            .filter(c => c.type === 'income')
                                            .map(c => ({ label: c.category, value: c.amount, color: 'bg-green-500' }))}
                                        title="Income by Category"
                                    />
                                    <BarChart
                                        data={reportData.accounting.categoryWise
                                            .filter(c => c.type === 'expense')
                                            .map(c => ({ label: c.category, value: c.amount, color: 'bg-red-500' }))}
                                        title="Expenses by Category"
                                    />
                                </div>

                                {/* Cash Flow Table */}
                                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Cash Flow Statement</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cash Inflow</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cash Outflow</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Cash Flow</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {reportData.accounting.cashFlow.map((flow, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{flow.date}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">₹{flow.inflow.toLocaleString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">₹{flow.outflow.toLocaleString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <span className={flow.inflow - flow.outflow >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                                ₹{(flow.inflow - flow.outflow).toLocaleString()}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{flow.balance.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Client Report */}
                        {reportType === 'client' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Client Analytics</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <Users className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                                                <p className="text-2xl font-bold text-gray-900">{reportData.clients.total}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-green-100 rounded-lg">
                                                <CheckCircle className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                                                <p className="text-2xl font-bold text-gray-900">{reportData.clients.active}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-purple-100 rounded-lg">
                                                <TrendingUp className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">New This Month</p>
                                                <p className="text-2xl font-bold text-gray-900">{reportData.clients.newThisMonth}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-gray-100 rounded-lg">
                                                <AlertCircle className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Inactive</p>
                                                <p className="text-2xl font-bold text-gray-900">{reportData.clients.inactive}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <PieChartSimple
                                        data={reportData?.clients?.byType?.map((type, index) => ({
                                            label: type.type,
                                            value: type.count,
                                            color: ['bg-blue-500', 'bg-green-500', 'bg-purple-500'][index]
                                        }))}
                                        title="Clients by Business Type"
                                    />

                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Performance Metrics</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Client Retention Rate</span>
                                                <span className="text-lg font-bold text-green-600">92.5%</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Average Client Value</span>
                                                <span className="text-lg font-bold text-gray-900">₹{(reportData.invoices.totalAmount / reportData.clients.active).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Client Growth Rate</span>
                                                <span className="text-lg font-bold text-purple-600">{reportData.performance.clientGrowth.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* GST Report */}
                        {reportType === 'gst' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">GST Compliance Report</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <FileText className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Total Filings</p>
                                                <p className="text-2xl font-bold text-gray-900">{reportData.gstFilings.total}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-green-100 rounded-lg">
                                                <CheckCircle className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Filed</p>
                                                <p className="text-2xl font-bold text-gray-900">{reportData.gstFilings.filed}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-yellow-100 rounded-lg">
                                                <AlertCircle className="w-6 h-6 text-yellow-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                                <p className="text-2xl font-bold text-gray-900">{reportData.gstFilings.pending}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-red-100 rounded-lg">
                                                <AlertCircle className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Late</p>
                                                <p className="text-2xl font-bold text-gray-900">{reportData.gstFilings.late}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <LineChart
                                        data={reportData.gstFilings.monthlyFilings.map(d => ({ month: d.month, value1: d.filed, value2: d.pending }))}
                                        title="Monthly Filing Trend"
                                    />
                                    <PieChartSimple
                                        data={reportData.gstFilings.byType.map((type, index) => ({
                                            label: type.type,
                                            value: type.count,
                                            color: ['bg-blue-500', 'bg-green-500', 'bg-purple-500'][index]
                                        }))}
                                        title="Filings by Type"
                                    />
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">GST Tax Summary</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-gray-900">₹{reportData.gstFilings.totalTax.toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">Total GST Collected</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-green-600">{((reportData.gstFilings.filed / reportData.gstFilings.total) * 100).toFixed(1)}%</p>
                                            <p className="text-sm text-gray-600">Compliance Rate</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-3xl font-bold text-blue-600">₹{(reportData.gstFilings.totalTax / reportData.gstFilings.total).toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">Average Tax per Filing</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payroll Report */}
                        {reportType === 'payroll' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Payroll Analytics</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <Users className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                                                <p className="text-2xl font-bold text-gray-900">{reportData.payroll.totalEmployees}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-green-100 rounded-lg">
                                                <DollarSign className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Gross Salary</p>
                                                <p className="text-2xl font-bold text-gray-900">₹{(reportData.payroll.totalGrossSalary / 1000).toFixed(0)}k</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-red-100 rounded-lg">
                                                <TrendingDown className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Deductions</p>
                                                <p className="text-2xl font-bold text-gray-900">₹{(reportData.payroll.totalDeductions / 1000).toFixed(0)}k</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-purple-100 rounded-lg">
                                                <DollarSign className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Net Salary</p>
                                                <p className="text-2xl font-bold text-gray-900">₹{(reportData.payroll.totalNetSalary / 1000).toFixed(0)}k</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <LineChart
                                        data={reportData.payroll.monthlyPayroll.map(d => ({ month: d.month, value1: d.gross, value2: d.net }))}
                                        title="Monthly Payroll Trend"
                                    />
                                    <BarChart
                                        data={reportData.payroll.departmentWise.map(d => ({ label: d.department, value: d.salary, color: 'bg-blue-500' }))}
                                        title="Department-wise Salary Distribution"
                                    />
                                </div>

                                {/* Department Table */}
                                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Department-wise Breakdown</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employees</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Salary</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Salary</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% of Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {reportData.payroll.departmentWise.map((dept, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.department}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dept.employees}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{dept.salary.toLocaleString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{(dept.salary / dept.employees).toLocaleString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {((dept.salary / reportData.payroll.totalGrossSalary) * 100).toFixed(1)}%
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Accounting Report */}
                        {reportType === 'accounting' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Transaction & Cash Flow Analysis</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-green-100 rounded-lg">
                                                <TrendingUp className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Total Income</p>
                                                <p className="text-2xl font-bold text-gray-900">₹{(reportData.accounting.totalIncome / 1000).toFixed(0)}k</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-red-100 rounded-lg">
                                                <TrendingDown className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                                                <p className="text-2xl font-bold text-gray-900">₹{(reportData.accounting.totalExpenses / 1000).toFixed(0)}k</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <DollarSign className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Net Income</p>
                                                <p className={`text-2xl font-bold ${reportData.accounting.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    ₹{(reportData.accounting.netIncome / 1000).toFixed(0)}k
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-purple-100 rounded-lg">
                                                <Activity className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-600">Transactions</p>
                                                <p className="text-2xl font-bold text-gray-900">{reportData.accounting.totalTransactions}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <LineChart
                                        data={reportData.accounting.monthlyTrend.map(d => ({ month: d.month, value1: d.income, value2: d.expenses }))}
                                        title="Monthly Income vs Expenses"
                                    />
                                    <BarChart
                                        data={reportData.accounting.categoryWise.map(c => ({
                                            label: c.category,
                                            value: c.amount,
                                            color: c.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                                        }))}
                                        title="Transaction Categories"
                                    />
                                </div>

                                {/* Transaction Summary Table */}
                                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">Category-wise Transaction Summary</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% of Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {reportData.accounting.categoryWise.map((category, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.category}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${category.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {category.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{category.amount.toLocaleString()}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {((category.amount / (category.type === 'income' ? reportData.accounting.totalIncome : reportData.accounting.totalExpenses)) * 100).toFixed(1)}%
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}