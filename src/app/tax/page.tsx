'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Shield, Calculator, FileText, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface TaxCompliance {
  _id: string;
  client: {
    _id: string;
    name: string;
    gstin?: string;
    gstNumber?: string; // For backward compatibility
  };
  taxType: 'Income Tax' | 'TDS' | 'GST' | 'Professional Tax' | 'Service Tax';
  assessmentYear: string;
  dueDate: string;
  filingDate?: string;
  status: 'pending' | 'filed' | 'under_review' | 'completed' | 'late';
  taxAmount: number;
  penalty: number;
  interest: number;
  totalPayable: number;
  formType?: string;
  acknowledgmentNumber?: string;
  remarks?: string;
  notes?: string;
}

export default function TaxCompliancePage() {
  const [compliance, setCompliance] = useState<TaxCompliance[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCompliance, setEditingCompliance] = useState<TaxCompliance | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    client: '',
    taxType: 'Income Tax' as 'Income Tax' | 'TDS' | 'GST' | 'Professional Tax' | 'Service Tax',
    assessmentYear: '',
    dueDate: '',
    filingDate: '',
    taxAmount: 0,
    penalty: 0,
    interest: 0,
    formType: '',
    acknowledgmentNumber: '',
    remarks: ''
  });

  useEffect(() => {
    fetchCompliance();
    fetchClients();
  }, []);

  const fetchCompliance = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: any = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch('/api/tax-compliance', { headers });
      const data = await response.json();
      console.log('Tax Compliance API Response:', data);

      // Handle different response formats
      if (data.taxCompliance && Array.isArray(data.taxCompliance)) {
        setCompliance(data.taxCompliance);
      } else if (Array.isArray(data)) {
        setCompliance(data);
      } else {
        console.log('Unexpected tax compliance data format:', data);
        setCompliance([]);
      }
    } catch (error) {
      console.error('Error fetching tax compliance:', error);
      setCompliance([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: any = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch('/api/clients', { headers });
      const data = await response.json();
      console.log('Clients API Response for Tax:', data);

      // Handle different response formats
      if (data.clients && Array.isArray(data.clients)) {
        setClients(data.clients);
      } else if (Array.isArray(data)) {
        setClients(data);
      } else {
        console.log('Unexpected clients data format:', data);
        setClients([]);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const complianceData = {
      ...formData,
      totalPayable: formData.taxAmount + formData.penalty + formData.interest,
      notes: formData.remarks // Map remarks to notes for API
    };

    try {
      const token = localStorage.getItem('token');
      const url = editingCompliance ? `/api/tax-compliance/${editingCompliance._id}` : '/api/tax-compliance';
      const method = editingCompliance ? 'PUT' : 'POST';

      const headers: any = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(complianceData)
      });

      const result = await response.json();
      console.log('Tax compliance save response:', result);

      if (response.ok) {
        console.log('Tax compliance saved successfully');
        fetchCompliance();
        setShowForm(false);
        setEditingCompliance(null);
        resetForm();
      } else {
        console.error('Tax compliance save failed:', result.error);
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving tax compliance:', error);
      alert('Failed to save tax compliance. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      client: '',
      taxType: 'Income Tax',
      assessmentYear: '',
      dueDate: '',
      filingDate: '',
      taxAmount: 0,
      penalty: 0,
      interest: 0,
      formType: '',
      acknowledgmentNumber: '',
      remarks: ''
    });
  };

  const editCompliance = (compliance: TaxCompliance) => {
    setEditingCompliance(compliance);
    setFormData({
      client: compliance.client._id,
      taxType: compliance.taxType,
      assessmentYear: compliance.assessmentYear,
      dueDate: compliance.dueDate.split('T')[0],
      filingDate: compliance.filingDate ? compliance.filingDate.split('T')[0] : '',
      taxAmount: compliance.taxAmount,
      penalty: compliance.penalty,
      interest: compliance.interest,
      formType: compliance.formType || '',
      acknowledgmentNumber: compliance.acknowledgmentNumber || '',
      remarks: compliance.remarks || ''
    });
    setShowForm(true);
  };

  const deleteCompliance = async (id: string) => {
    if (confirm('Are you sure you want to delete this tax compliance record?')) {
      try {
        await fetch(`/api/tax-compliance/${id}`, { method: 'DELETE' });
        fetchCompliance();
      } catch (error) {
        console.error('Error deleting tax compliance:', error);
      }
    }
  };

  const filteredCompliance = (compliance || []).filter(item => {
    const gstNumber = item.client?.gstin || item.client?.gstNumber || '';
    const matchesSearch = item.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gstNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assessmentYear.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.taxType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      filed: 'bg-blue-100 text-blue-800',
      under_review: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      late: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Income Tax': 'bg-blue-100 text-blue-800',
      'TDS': 'bg-green-100 text-green-800',
      'GST': 'bg-purple-100 text-purple-800',
      'Professional Tax': 'bg-orange-100 text-orange-800',
      'Service Tax': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || colors['Income Tax'];
  };

  const calculateTotals = () => {
    const totalTax = compliance.reduce((sum, c) => sum + c.taxAmount, 0);
    const totalPenalty = compliance.reduce((sum, c) => sum + c.penalty, 0);
    const totalInterest = compliance.reduce((sum, c) => sum + c.interest, 0);
    const totalPayable = compliance.reduce((sum, c) => sum + c.totalPayable, 0);
    return { totalTax, totalPenalty, totalInterest, totalPayable };
  };

  const totals = calculateTotals();

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'completed' && status !== 'filed';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tax Compliance</h1>
            <p className="text-gray-600">Manage tax filings and compliance requirements</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Compliance
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Filings</p>
                <p className="text-2xl font-bold text-gray-900">{compliance.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calculator className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tax</p>
                <p className="text-2xl font-bold text-gray-900">₹{totals.totalTax.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {compliance.filter(c => isOverdue(c.dueDate, c.status)).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {compliance.filter(c => c.status === 'completed').length}
                </p>
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
                  placeholder="Search compliance records..."
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
              <option value="pending">Pending</option>
              <option value="filed">Filed</option>
              <option value="under_review">Under Review</option>
              <option value="completed">Completed</option>
              <option value="late">Late</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="Income Tax">Income Tax</option>
              <option value="TDS">TDS</option>
              <option value="GST">GST</option>
              <option value="Professional Tax">Professional Tax</option>
              <option value="Service Tax">Service Tax</option>
            </select>
          </div>
        </div>

        {/* Tax Compliance Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingCompliance ? 'Edit Tax Compliance' : 'Create New Tax Compliance'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                    <select
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Client</option>
                      {clients.map(client => (
                        <option key={client._id} value={client._id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Type</label>
                    <select
                      value={formData.taxType}
                      onChange={(e) => setFormData({ ...formData, taxType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="Income Tax">Income Tax</option>
                      <option value="TDS">TDS</option>
                      <option value="GST">GST</option>
                      <option value="Professional Tax">Professional Tax</option>
                      <option value="Service Tax">Service Tax</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Year</label>
                    <input
                      type="text"
                      placeholder="2024-25"
                      value={formData.assessmentYear}
                      onChange={(e) => setFormData({ ...formData, assessmentYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filing Date</label>
                    <input
                      type="date"
                      value={formData.filingDate}
                      onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Form Type</label>
                    <input
                      type="text"
                      placeholder="ITR-1, ITR-2, etc."
                      value={formData.formType}
                      onChange={(e) => setFormData({ ...formData, formType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Amount</label>
                    <input
                      type="number"
                      value={formData.taxAmount}
                      onChange={(e) => setFormData({ ...formData, taxAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Penalty</label>
                    <input
                      type="number"
                      value={formData.penalty}
                      onChange={(e) => setFormData({ ...formData, penalty: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest</label>
                    <input
                      type="number"
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Acknowledgment Number</label>
                  <input
                    type="text"
                    value={formData.acknowledgmentNumber}
                    onChange={(e) => setFormData({ ...formData, acknowledgmentNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Summary */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Tax Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Tax Amount:</span>
                      <span>₹{formData.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Penalty:</span>
                      <span>₹{formData.penalty.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest:</span>
                      <span>₹{formData.interest.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total Payable:</span>
                      <span>₹{(formData.taxAmount + formData.penalty + formData.interest).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCompliance(null);
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
                    {editingCompliance ? 'Update Compliance' : 'Create Compliance'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Compliance Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Payable</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompliance.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.client.name}</div>
                        <div className="text-sm text-gray-500">{item.client?.gstin || item.client?.gstNumber || 'No GSTIN'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.taxType)}`}>
                          {item.taxType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.assessmentYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          {new Date(item.dueDate).toLocaleDateString()}
                          {isOverdue(item.dueDate, item.status) && (
                            <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.replace('_', ' ').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{item.totalPayable.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editCompliance(item)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCompliance(item._id)}
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

              {filteredCompliance.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No tax compliance records found. Create your first compliance record to get started.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
