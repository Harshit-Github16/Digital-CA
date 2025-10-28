'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Save, ArrowLeft } from 'lucide-react';
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

interface Client {
  _id: string;
  name: string;
  email: string;
  gstin?: string;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    client: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, rate: 0, taxRate: 18, hsnCode: '' }],
    paymentTerms: 'Net 30',
    notes: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const invoiceData = {
      ...formData,
      items: formData.items.map(item => ({
        ...item,
        amount: item.quantity * item.rate,
        taxAmount: (item.quantity * item.rate * item.taxRate) / 100
      }))
    };

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });

      if (response.ok) {
        router.push('/invoices');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Invoice</h1>
              <p className="text-gray-600">Generate a new GST-compliant invoice</p>
            </div>
          </div>
        </div>

        {/* Invoice Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Client and Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                <input
                  type="text"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
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
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 border border-gray-200 rounded-lg">
                    <div className="col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <input
                        type="text"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
                      <input
                        type="text"
                        placeholder="HSN"
                        value={item.hsnCode}
                        onChange={(e) => updateItem(index, 'hsnCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax %</label>
                      <input
                        type="number"
                        value={item.taxRate}
                        onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                        ₹{(item.quantity * item.rate).toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal:</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tax:</span>
                <span>₹{totals.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Additional notes or terms..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Creating...' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
