'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxRate: number;
  taxAmount: number;
  hsnCode?: string;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  client: {
    _id: string;
    name: string;
    email: string;
  };
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentTerms: string;
  notes?: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    client: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, rate: 0, taxRate: 18, hsnCode: '' }],
    paymentTerms: 'Net 30',
    notes: ''
  });

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setInvoices([]);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/invoices', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/auth/login';
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Invoices API response:', data);

      // Handle both direct array and object with invoices property
      if (Array.isArray(data)) {
        setInvoices(data);
      } else if (data.invoices && Array.isArray(data.invoices)) {
        setInvoices(data.invoices);
      } else {
        console.warn('Unexpected API response format:', data);
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setClients([]);
        return;
      }

      const response = await fetch('/api/clients', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Failed to fetch clients:', response.status);
        setClients([]);
        return;
      }

      const data = await response.json();

      // Handle both direct array and object with clients property
      if (Array.isArray(data)) {
        setClients(data);
      } else if (data.clients && Array.isArray(data.clients)) {
        setClients(data.clients);
      } else {
        console.warn('Unexpected clients API response format:', data);
        setClients([]);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }

    const invoiceData = {
      ...formData,
      items: formData.items.map(item => ({
        ...item,
        amount: item.quantity * item.rate,
        taxAmount: (item.quantity * item.rate * item.taxRate) / 100
      }))
    };

    try {
      const url = editingInvoice ? `/api/invoices/${editingInvoice._id}` : '/api/invoices';
      const method = editingInvoice ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(invoiceData)
      });

      if (response.ok) {
        fetchInvoices();
        setShowForm(false);
        setEditingInvoice(null);
        resetForm();
      } else {
        const errorData = await response.json();
        console.error('Error saving invoice:', errorData);
        alert(`Error: ${errorData.error || 'Failed to save invoice'}`);
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Network error occurred while saving invoice');
    }
  };

  const resetForm = () => {
    setFormData({
      client: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [{ description: '', quantity: 1, rate: 0, taxRate: 18, hsnCode: '' }],
      paymentTerms: 'Net 30',
      notes: ''
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, rate: 0, taxRate: 18, hsnCode: '' }]
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'rate' || field === 'taxRate') {
      const item = newItems[index];
      item.amount = item.quantity * item.rate;
      item.taxAmount = (item.amount * item.taxRate) / 100;
    }

    setFormData({ ...formData, items: newItems });
  };

  const editInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      client: invoice.client._id,
      date: invoice.date.split('T')[0],
      dueDate: invoice.dueDate.split('T')[0],
      items: invoice.items,
      paymentTerms: invoice.paymentTerms,
      notes: invoice.notes || ''
    });
    setShowForm(true);
  };

  const deleteInvoice = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/auth/login';
          return;
        }

        const response = await fetch(`/api/invoices/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchInvoices();
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error || 'Failed to delete invoice'}`);
        }
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Network error occurred while deleting invoice');
      }
    }
  };

  const filteredInvoices = (invoices || []).filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxAmount = formData.items.reduce((sum, item) => sum + ((item.quantity * item.rate * item.taxRate) / 100), 0);
    return { subtotal, taxAmount, total: subtotal + taxAmount };
  };

  const totals = calculateTotals();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600">Manage your invoices and billing</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search invoices..."
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
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Invoice Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
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
                      {Array.isArray(clients) && clients.map(client => (
                        <option key={client._id} value={client._id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                    <input
                      type="text"
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

                {/* Items */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Items</label>
                    <button
                      type="button"
                      onClick={addItem}
                      className="text-primary-600 hover:text-primary-700 text-sm"
                    >
                      + Add Item
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-6 gap-2 items-end">
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Rate"
                            value={item.rate}
                            onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Tax %"
                            value={item.taxRate}
                            onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </div>
                        <div className="flex gap-1">
                          <span className="px-2 py-2 text-sm bg-gray-100 rounded">
                            ₹{(item.quantity * item.rate).toFixed(2)}
                          </span>
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>₹{totals.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{totals.total.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingInvoice(null);
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
                    {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{invoice.client.name}</div>
                        <div className="text-sm text-gray-500">{invoice.client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{invoice.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editInvoice(invoice)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteInvoice(invoice._id)}
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

              {filteredInvoices.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No invoices found. Create your first invoice to get started.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
