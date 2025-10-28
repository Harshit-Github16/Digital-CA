'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Calendar, FileText } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface GSTFiling {
  _id: string;
  client: {
    _id: string;
    name: string;
    gstin?: string;
  };
  filingType: 'GSTR-1' | 'GSTR-3B' | 'GSTR-9' | 'GSTR-9C';
  taxPeriod: string;
  dueDate: string;
  filingDate?: string;
  status: 'pending' | 'filed' | 'late' | 'cancelled';
  totalTaxLiability: number;
  totalITC: number;
  netTaxPayable: number;
  lateFee: number;
  penalty: number;
  filingData: {
    sales: {
      taxable: number;
      exempt: number;
      nilRated: number;
      nonGST: number;
    };
    purchases: {
      taxable: number;
      exempt: number;
      nilRated: number;
      nonGST: number;
    };
    itc: {
      igst: number;
      cgst: number;
      sgst: number;
      cess: number;
    };
    outputTax: {
      igst: number;
      cgst: number;
      sgst: number;
      cess: number;
    };
  };
  arn?: string;
  acknowledgmentNumber?: string;
}

export default function GSTPage() {
  const [filings, setFilings] = useState<GSTFiling[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFiling, setEditingFiling] = useState<GSTFiling | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    client: '',
    filingType: 'GSTR-1' as 'GSTR-1' | 'GSTR-3B' | 'GSTR-9' | 'GSTR-9C',
    taxPeriod: '',
    dueDate: '',
    filingData: {
      sales: { taxable: 0, exempt: 0, nilRated: 0, nonGST: 0 },
      purchases: { taxable: 0, exempt: 0, nilRated: 0, nonGST: 0 },
      itc: { igst: 0, cgst: 0, sgst: 0, cess: 0 },
      outputTax: { igst: 0, cgst: 0, sgst: 0, cess: 0 }
    },
    lateFee: 0,
    penalty: 0
  });

  useEffect(() => {
    fetchFilings();
    fetchClients();
  }, []);

  const fetchFilings = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: any = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch('/api/gst-filings', { headers });
      const data = await response.json();
      console.log('GST Filings API Response:', data);

      // Handle different response formats
      if (data.gstFilings && Array.isArray(data.gstFilings)) {
        setFilings(data.gstFilings);
      } else if (Array.isArray(data)) {
        setFilings(data);
      } else {
        console.log('Unexpected data format:', data);
        setFilings([]);
      }
    } catch (error) {
      console.error('Error fetching GST filings:', error);
      setFilings([]);
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
      console.log('Clients API Response:', data);

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

    const filingData = {
      ...formData,
      totalTaxLiability: calculateTotalTaxLiability(),
      totalITC: calculateTotalITC()
    };

    try {
      const token = localStorage.getItem('token');
      const url = editingFiling ? `/api/gst-filings/${editingFiling._id}` : '/api/gst-filings';
      const method = editingFiling ? 'PUT' : 'POST';

      const headers: any = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(filingData)
      });

      if (response.ok) {
        fetchFilings();
        setShowForm(false);
        setEditingFiling(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving GST filing:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      client: '',
      filingType: 'GSTR-1',
      taxPeriod: '',
      dueDate: '',
      filingData: {
        sales: { taxable: 0, exempt: 0, nilRated: 0, nonGST: 0 },
        purchases: { taxable: 0, exempt: 0, nilRated: 0, nonGST: 0 },
        itc: { igst: 0, cgst: 0, sgst: 0, cess: 0 },
        outputTax: { igst: 0, cgst: 0, sgst: 0, cess: 0 }
      },
      lateFee: 0,
      penalty: 0
    });
  };

  const calculateTotalTaxLiability = () => {
    const { outputTax } = formData.filingData;
    return outputTax.igst + outputTax.cgst + outputTax.sgst + outputTax.cess;
  };

  const calculateTotalITC = () => {
    const { itc } = formData.filingData;
    return itc.igst + itc.cgst + itc.sgst + itc.cess;
  };

  const calculateNetTaxPayable = () => {
    return calculateTotalTaxLiability() - calculateTotalITC() + formData.lateFee + formData.penalty;
  };

  const editFiling = (filing: GSTFiling) => {
    setEditingFiling(filing);
    setFormData({
      client: filing.client._id,
      filingType: filing.filingType,
      taxPeriod: filing.taxPeriod,
      dueDate: filing.dueDate.split('T')[0],
      filingData: filing.filingData || {
        sales: { taxable: 0, exempt: 0, nilRated: 0, nonGST: 0 },
        purchases: { taxable: 0, exempt: 0, nilRated: 0, nonGST: 0 },
        itc: { igst: 0, cgst: 0, sgst: 0, cess: 0 },
        outputTax: { igst: 0, cgst: 0, sgst: 0, cess: 0 }
      },
      lateFee: filing.lateFee,
      penalty: filing.penalty
    });
    setShowForm(true);
  };

  const deleteFiling = async (id: string) => {
    if (confirm('Are you sure you want to delete this GST filing?')) {
      try {
        await fetch(`/api/gst-filings/${id}`, { method: 'DELETE' });
        fetchFilings();
      } catch (error) {
        console.error('Error deleting GST filing:', error);
      }
    }
  };

  const filteredFilings = (filings || []).filter(filing => {
    const matchesSearch = filing.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (filing.client.gstin && filing.client.gstin.toLowerCase().includes(searchTerm.toLowerCase())) ||
      filing.taxPeriod.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || filing.status === statusFilter;
    const matchesType = typeFilter === 'all' || filing.filingType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      filed: 'bg-green-100 text-green-800',
      late: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getFilingTypeColor = (type: string) => {
    const colors = {
      'GSTR-1': 'bg-blue-100 text-blue-800',
      'GSTR-3B': 'bg-purple-100 text-purple-800',
      'GSTR-9': 'bg-green-100 text-green-800',
      'GSTR-9C': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || colors['GSTR-1'];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">GST Filing</h1>
            <p className="text-gray-600">Manage GST returns and compliance</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Filing
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Filings</p>
                <p className="text-2xl font-bold text-gray-900">{filings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Filed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filings.filter(f => f.status === 'filed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filings.filter(f => f.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filings.filter(f => f.status === 'late').length}
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
                  placeholder="Search filings..."
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
              <option value="late">Late</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="GSTR-1">GSTR-1</option>
              <option value="GSTR-3B">GSTR-3B</option>
              <option value="GSTR-9">GSTR-9</option>
              <option value="GSTR-9C">GSTR-9C</option>
            </select>
          </div>
        </div>

        {/* GST Filing Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingFiling ? 'Edit GST Filing' : 'Create New GST Filing'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      {Array.isArray(clients) && clients.map(client => (
                        <option key={client._id} value={client._id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filing Type</label>
                    <select
                      value={formData.filingType}
                      onChange={(e) => setFormData({ ...formData, filingType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="GSTR-1">GSTR-1</option>
                      <option value="GSTR-3B">GSTR-3B</option>
                      <option value="GSTR-9">GSTR-9</option>
                      <option value="GSTR-9C">GSTR-9C</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Period (YYYY-MM)</label>
                    <input
                      type="text"
                      placeholder="2024-01"
                      value={formData.taxPeriod}
                      onChange={(e) => setFormData({ ...formData, taxPeriod: e.target.value })}
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

                {/* Sales Data */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Sales Data</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Taxable Sales</label>
                      <input
                        type="number"
                        value={formData.filingData.sales.taxable}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            sales: { ...formData.filingData.sales, taxable: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exempt Sales</label>
                      <input
                        type="number"
                        value={formData.filingData.sales.exempt}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            sales: { ...formData.filingData.sales, exempt: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nil Rated</label>
                      <input
                        type="number"
                        value={formData.filingData.sales.nilRated}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            sales: { ...formData.filingData.sales, nilRated: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Non-GST</label>
                      <input
                        type="number"
                        value={formData.filingData.sales.nonGST}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            sales: { ...formData.filingData.sales, nonGST: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Purchases Data */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Purchases Data</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Taxable Purchases</label>
                      <input
                        type="number"
                        value={formData.filingData.purchases.taxable}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            purchases: { ...formData.filingData.purchases, taxable: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exempt Purchases</label>
                      <input
                        type="number"
                        value={formData.filingData.purchases.exempt}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            purchases: { ...formData.filingData.purchases, exempt: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nil Rated</label>
                      <input
                        type="number"
                        value={formData.filingData.purchases.nilRated}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            purchases: { ...formData.filingData.purchases, nilRated: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Non-GST</label>
                      <input
                        type="number"
                        value={formData.filingData.purchases.nonGST}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            purchases: { ...formData.filingData.purchases, nonGST: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* ITC Data */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Input Tax Credit (ITC)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IGST</label>
                      <input
                        type="number"
                        value={formData.filingData.itc.igst}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            itc: { ...formData.filingData.itc, igst: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CGST</label>
                      <input
                        type="number"
                        value={formData.filingData.itc.cgst}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            itc: { ...formData.filingData.itc, cgst: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SGST</label>
                      <input
                        type="number"
                        value={formData.filingData.itc.sgst}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            itc: { ...formData.filingData.itc, sgst: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cess</label>
                      <input
                        type="number"
                        value={formData.filingData.itc.cess}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            itc: { ...formData.filingData.itc, cess: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Output Tax Data */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Output Tax</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IGST</label>
                      <input
                        type="number"
                        value={formData.filingData.outputTax.igst}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            outputTax: { ...formData.filingData.outputTax, igst: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CGST</label>
                      <input
                        type="number"
                        value={formData.filingData.outputTax.cgst}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            outputTax: { ...formData.filingData.outputTax, cgst: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SGST</label>
                      <input
                        type="number"
                        value={formData.filingData.outputTax.sgst}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            outputTax: { ...formData.filingData.outputTax, sgst: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cess</label>
                      <input
                        type="number"
                        value={formData.filingData.outputTax.cess}
                        onChange={(e) => setFormData({
                          ...formData,
                          filingData: {
                            ...formData.filingData,
                            outputTax: { ...formData.filingData.outputTax, cess: parseFloat(e.target.value) || 0 }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Penalties */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Late Fee</label>
                    <input
                      type="number"
                      value={formData.lateFee}
                      onChange={(e) => setFormData({ ...formData, lateFee: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="0"
                      step="0.01"
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
                </div>

                {/* Summary */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Tax Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Total Tax Liability:</span>
                      <span>₹{calculateTotalTaxLiability().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total ITC:</span>
                      <span>₹{calculateTotalITC().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late Fee:</span>
                      <span>₹{formData.lateFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Penalty:</span>
                      <span>₹{formData.penalty.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 col-span-2">
                      <span>Net Tax Payable:</span>
                      <span>₹{calculateNetTaxPayable().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingFiling(null);
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
                    {editingFiling ? 'Update Filing' : 'Create Filing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filings Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Tax</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFilings.map((filing) => (
                    <tr key={filing._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{filing.client.name}</div>
                        <div className="text-sm text-gray-500">{filing.client.gstin || 'No GSTIN'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFilingTypeColor(filing.filingType)}`}>
                          {filing.filingType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {filing.taxPeriod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(filing.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(filing.status)}`}>
                          {filing.status.charAt(0).toUpperCase() + filing.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{filing?.netTaxPayable?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editFiling(filing)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteFiling(filing._id)}
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

              {filteredFilings.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No GST filings found. Create your first filing to get started.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
