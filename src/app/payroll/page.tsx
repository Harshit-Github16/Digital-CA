'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Users, DollarSign, Calendar, FileText } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface Employee {
  _id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  employeeId: string;
  salary: {
    basic: number;
    hra: number;
    allowances: number;
    total: number;
  };
}

interface Payroll {
  _id: string;
  employee: Employee;
  month: string;
  year: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  grossSalary: number;
  deductions: {
    tds: number;
    pf: number;
    esi: number;
    professionalTax: number;
    other: number;
    total: number;
  };
  netSalary: number;
  status: 'draft' | 'approved' | 'paid';
  paymentDate?: string;
  payslipGenerated: boolean;
}

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // Ensure employees is always an array
  const safeEmployees = Array.isArray(employees) ? employees : [];
  
  // Debug logging
  console.log('Employees state:', employees);
  console.log('Safe employees:', safeEmployees);
  const [showForm, setShowForm] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    employee: '',
    month: '',
    year: new Date().getFullYear(),
    basicSalary: 0,
    hra: 0,
    allowances: 0,
    deductions: {
      tds: 0,
      pf: 0,
      esi: 0,
      professionalTax: 0,
      other: 0
    }
  });

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const response = await fetch('/api/payroll');
      const data = await response.json();
      setPayrolls(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched employees data:', data);
      
      if (Array.isArray(data) && data.length === 0) {
        // Initialize default employees if none exist
        await fetch('/api/employees/setup', { method: 'POST' });
        const newResponse = await fetch('/api/employees');
        const newData = await newResponse.json();
        console.log('New employees data after setup:', newData);
        setEmployees(Array.isArray(newData) ? newData : []);
      } else {
        setEmployees(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payrollData = {
      ...formData,
      grossSalary: formData.basicSalary + formData.hra + formData.allowances,
      deductions: {
        ...formData.deductions,
        total: formData.deductions.tds + formData.deductions.pf + formData.deductions.esi + 
               formData.deductions.professionalTax + formData.deductions.other
      },
      netSalary: (formData.basicSalary + formData.hra + formData.allowances) - 
                 (formData.deductions.tds + formData.deductions.pf + formData.deductions.esi + 
                  formData.deductions.professionalTax + formData.deductions.other)
    };

    try {
      const url = editingPayroll ? `/api/payroll/${editingPayroll._id}` : '/api/payroll';
      const method = editingPayroll ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payrollData)
      });

      if (response.ok) {
        fetchPayrolls();
        setShowForm(false);
        setEditingPayroll(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving payroll:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      employee: '',
      month: '',
      year: new Date().getFullYear(),
      basicSalary: 0,
      hra: 0,
      allowances: 0,
      deductions: {
        tds: 0,
        pf: 0,
        esi: 0,
        professionalTax: 0,
        other: 0
      }
    });
  };

  const editPayroll = (payroll: Payroll) => {
    setEditingPayroll(payroll);
    setFormData({
      employee: payroll.employee._id,
      month: payroll.month,
      year: payroll.year,
      basicSalary: payroll.basicSalary,
      hra: payroll.hra,
      allowances: payroll.allowances,
      deductions: payroll.deductions
    });
    setShowForm(true);
  };

  const deletePayroll = async (id: string) => {
    if (confirm('Are you sure you want to delete this payroll record?')) {
      try {
        await fetch(`/api/payroll/${id}`, { method: 'DELETE' });
        fetchPayrolls();
      } catch (error) {
        console.error('Error deleting payroll:', error);
      }
    }
  };

  const generatePayslip = async (id: string) => {
    try {
      const response = await fetch(`/api/payroll/${id}/payslip`, { method: 'POST' });
      if (response.ok) {
        fetchPayrolls();
      }
    } catch (error) {
      console.error('Error generating payslip:', error);
    }
  };

  const filteredPayrolls = (payrolls || []).filter(payroll => {
    const matchesSearch = payroll.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payroll.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payroll.status === statusFilter;
    const matchesMonth = monthFilter === 'all' || payroll.month === monthFilter;
    return matchesSearch && matchesStatus && matchesMonth;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      approved: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const calculateTotals = () => {
    const totalGross = payrolls.reduce((sum, p) => sum + p.grossSalary, 0);
    const totalDeductions = payrolls.reduce((sum, p) => sum + p.deductions.total, 0);
    const totalNet = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
    return { totalGross, totalDeductions, totalNet };
  };

  const totals = calculateTotals();

  const months = [
    '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
    '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
            <p className="text-gray-600">Manage employee salaries and payroll processing</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              // Ensure employees are loaded
              if (safeEmployees.length === 0) {
                fetchEmployees();
              }
              setShowForm(true);
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Payroll
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{safeEmployees.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Gross</p>
                <p className="text-2xl font-bold text-gray-900">₹{totals.totalGross.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Deductions</p>
                <p className="text-2xl font-bold text-gray-900">₹{totals.totalDeductions.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net Pay</p>
                <p className="text-2xl font-bold text-gray-900">₹{totals.totalNet.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
            </select>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Months</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Payroll Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingPayroll ? 'Edit Payroll' : 'Create New Payroll'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                    <select
                      value={formData.employee}
                      onChange={(e) => {
                        const selectedEmployee = safeEmployees.find(emp => emp._id === e.target.value);
                        setFormData({ 
                          ...formData, 
                          employee: e.target.value,
                          basicSalary: selectedEmployee?.salary.basic || 0,
                          hra: selectedEmployee?.salary.hra || 0,
                          allowances: selectedEmployee?.salary.allowances || 0
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Employee</option>
                      {safeEmployees && safeEmployees.length > 0 ? safeEmployees.map(employee => (
                        <option key={employee._id} value={employee._id}>{employee.name}</option>
                      )) : <option disabled>Loading employees...</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Month (YYYY-MM)</label>
                    <input
                      type="text"
                      placeholder="2024-01"
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="2020"
                    max="2030"
                    required
                  />
                </div>

                {/* Salary Components */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Salary Components</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
                      <input
                        type="number"
                        value={formData.basicSalary}
                        onChange={(e) => setFormData({ ...formData, basicSalary: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">HRA</label>
                      <input
                        type="number"
                        value={formData.hra}
                        onChange={(e) => setFormData({ ...formData, hra: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
                      <input
                        type="number"
                        value={formData.allowances}
                        onChange={(e) => setFormData({ ...formData, allowances: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Deductions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">TDS</label>
                      <input
                        type="number"
                        value={formData.deductions.tds}
                        onChange={(e) => setFormData({
                          ...formData,
                          deductions: { ...formData.deductions, tds: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PF</label>
                      <input
                        type="number"
                        value={formData.deductions.pf}
                        onChange={(e) => setFormData({
                          ...formData,
                          deductions: { ...formData.deductions, pf: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ESI</label>
                      <input
                        type="number"
                        value={formData.deductions.esi}
                        onChange={(e) => setFormData({
                          ...formData,
                          deductions: { ...formData.deductions, esi: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Professional Tax</label>
                      <input
                        type="number"
                        value={formData.deductions.professionalTax}
                        onChange={(e) => setFormData({
                          ...formData,
                          deductions: { ...formData.deductions, professionalTax: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Other</label>
                      <input
                        type="number"
                        value={formData.deductions.other}
                        onChange={(e) => setFormData({
                          ...formData,
                          deductions: { ...formData.deductions, other: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Payroll Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Gross Salary:</span>
                      <span>₹{(formData.basicSalary + formData.hra + formData.allowances).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Deductions:</span>
                      <span>₹{(formData.deductions.tds + formData.deductions.pf + formData.deductions.esi + 
                            formData.deductions.professionalTax + formData.deductions.other).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 col-span-2">
                      <span>Net Salary:</span>
                      <span>₹{((formData.basicSalary + formData.hra + formData.allowances) - 
                            (formData.deductions.tds + formData.deductions.pf + formData.deductions.esi + 
                             formData.deductions.professionalTax + formData.deductions.other)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPayroll(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    {editingPayroll ? 'Update Payroll' : 'Create Payroll'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payroll Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayrolls.map((payroll) => (
                    <tr key={payroll._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payroll.employee.name}</div>
                        <div className="text-sm text-gray-500">{payroll.employee.employeeId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payroll.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{payroll.grossSalary.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{payroll?.deductions?.total?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{payroll.netSalary.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payroll.status)}`}>
                          {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editPayroll(payroll)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {!payroll.payslipGenerated && (
                            <button
                              onClick={() => generatePayslip(payroll._id)}
                              className="text-green-600 hover:text-green-900"
                              title="Generate Payslip"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deletePayroll(payroll._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredPayrolls.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No payroll records found. Create your first payroll record to get started.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
