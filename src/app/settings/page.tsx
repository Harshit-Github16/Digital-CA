'use client';

import { useState, useEffect } from 'react';
import { Save, Building2, Calculator, FileText, Bell, Shield, Download } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('firm');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<any>({});

    const tabs = [
        { id: 'firm', name: 'Firm Details', icon: Building2, description: 'Basic firm information' },
        { id: 'tax', name: 'Tax Settings', icon: Calculator, description: 'GST rates and tax config' },
        { id: 'invoice', name: 'Invoice Setup', icon: FileText, description: 'Invoice format & bank details' },
        { id: 'alerts', name: 'Reminders', icon: Bell, description: 'Due date alerts & notifications' },
        { id: 'backup', name: 'Data Backup', icon: Shield, description: 'Export & backup options' }
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers: any = { 'Content-Type': 'application/json' };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch('/api/settings', { headers });
            const data = await response.json();

            if (data.success) {
                setSettings(data.settings);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (settingsData: any) => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const headers: any = { 'Content-Type': 'application/json' };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch('/api/settings', {
                method: 'POST',
                headers,
                body: JSON.stringify(settingsData)
            });

            const result = await response.json();

            if (result.success) {
                alert('Settings saved successfully!');
            } else {
                alert('Error saving settings: ' + result.error);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading settings...</p>
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
                        <h1 className="text-3xl font-bold text-gray-900">Firm Settings</h1>
                        <p className="text-gray-600">Configure your CA firm's business settings and preferences</p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Settings
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <nav className="space-y-2">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left p-4 rounded-lg transition-all ${activeTab === tab.id
                                            ? 'bg-primary-50 border-l-4 border-primary-500 text-primary-700'
                                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start">
                                            <IconComponent className="w-5 h-5 mr-3 mt-0.5" />
                                            <div>
                                                <div className="font-medium">{tab.name}</div>
                                                <div className="text-xs text-gray-500 mt-1">{tab.description}</div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm border">

                            {/* Firm Details */}
                            {activeTab === 'firm' && (
                                <div className="p-6">
                                    <div className="flex items-center mb-6">
                                        <Building2 className="w-6 h-6 text-primary-600 mr-3" />
                                        <h2 className="text-xl font-semibold">Firm Information</h2>
                                    </div>

                                    <form className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name *</label>
                                                <input
                                                    type="text"
                                                    placeholder="ABC & Associates"
                                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">CA Membership No. *</label>
                                                <input
                                                    type="text"
                                                    placeholder="123456"
                                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                            <textarea
                                                rows={3}
                                                placeholder="123, Business Center, Commercial Street"
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                                <input
                                                    type="text"
                                                    placeholder="Mumbai"
                                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                                <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500">
                                                    <option>Maharashtra</option>
                                                    <option>Delhi</option>
                                                    <option>Karnataka</option>
                                                    <option>Gujarat</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                                                <input
                                                    type="text"
                                                    placeholder="400001"
                                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                                                <input
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                                <input
                                                    type="email"
                                                    placeholder="contact@firm.com"
                                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN</label>
                                                <input
                                                    type="text"
                                                    placeholder="27ABCDE1234F1Z5"
                                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">PAN</label>
                                                <input
                                                    type="text"
                                                    placeholder="ABCDE1234F"
                                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="button"
                                                onClick={() => handleSave({ type: 'firm' })}
                                                disabled={saving}
                                                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                {saving ? 'Saving...' : 'Save Details'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Tax Settings */}
                            {activeTab === 'tax' && (
                                <div className="p-6">
                                    <div className="flex items-center mb-6">
                                        <Calculator className="w-6 h-6 text-primary-600 mr-3" />
                                        <h2 className="text-xl font-semibold">Tax Configuration</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-blue-900 mb-3">Default GST Rates</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-blue-700 mb-1">CGST (%)</label>
                                                    <input
                                                        type="number"
                                                        defaultValue="9"
                                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-blue-700 mb-1">SGST (%)</label>
                                                    <input
                                                        type="number"
                                                        defaultValue="9"
                                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-blue-700 mb-1">IGST (%)</label>
                                                    <input
                                                        type="number"
                                                        defaultValue="18"
                                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-blue-700 mb-1">Cess (%)</label>
                                                    <input
                                                        type="number"
                                                        defaultValue="0"
                                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Default HSN Code</label>
                                            <input
                                                type="text"
                                                defaultValue="998313"
                                                placeholder="998313 (Professional Services)"
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-medium text-gray-900">Tax Calculation Settings</h3>
                                            <div className="space-y-3">
                                                <label className="flex items-center">
                                                    <input type="checkbox" defaultChecked className="mr-3" />
                                                    <span>Auto-calculate tax on invoices</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" defaultChecked className="mr-3" />
                                                    <span>Round off final amounts</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" defaultChecked className="mr-3" />
                                                    <span>Include tax in item prices</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                onClick={handleSave}
                                                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save Tax Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Invoice Settings */}
                            {activeTab === 'invoice' && (
                                <div className="p-6">
                                    <div className="flex items-center mb-6">
                                        <FileText className="w-6 h-6 text-primary-600 mr-3" />
                                        <h2 className="text-xl font-semibold">Invoice Configuration</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Prefix</label>
                                                <input
                                                    type="text"
                                                    defaultValue="INV"
                                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Starting Number</label>
                                                <input
                                                    type="number"
                                                    defaultValue="1"
                                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Default Payment Terms</label>
                                            <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500">
                                                <option>Net 30</option>
                                                <option>Net 15</option>
                                                <option>Net 7</option>
                                                <option>Due on Receipt</option>
                                                <option>Custom</option>
                                            </select>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-green-900 mb-3">Bank Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-green-700 mb-1">Bank Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="State Bank of India"
                                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-green-700 mb-1">Account Number</label>
                                                    <input
                                                        type="text"
                                                        placeholder="1234567890"
                                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-green-700 mb-1">IFSC Code</label>
                                                    <input
                                                        type="text"
                                                        placeholder="SBIN0001234"
                                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-green-700 mb-1">Branch</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Mumbai Main Branch"
                                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Footer Text</label>
                                            <textarea
                                                rows={3}
                                                defaultValue="Thank you for your business! Please remit payment within the specified terms."
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                onClick={handleSave}
                                                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save Invoice Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Alerts & Reminders */}
                            {activeTab === 'alerts' && (
                                <div className="p-6">
                                    <div className="flex items-center mb-6">
                                        <Bell className="w-6 h-6 text-primary-600 mr-3" />
                                        <h2 className="text-xl font-semibold">Alerts & Reminders</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-yellow-900 mb-3">GST Filing Reminders</h3>
                                            <div className="space-y-3">
                                                <label className="flex items-center">
                                                    <input type="checkbox" defaultChecked className="mr-3" />
                                                    <span>GSTR-1 due date alerts (11th of next month)</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" defaultChecked className="mr-3" />
                                                    <span>GSTR-3B due date alerts (20th of next month)</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" defaultChecked className="mr-3" />
                                                    <span>Annual return (GSTR-9) reminders</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-blue-900 mb-3">Invoice Reminders</h3>
                                            <div className="space-y-3">
                                                <label className="flex items-center">
                                                    <input type="checkbox" defaultChecked className="mr-3" />
                                                    <span>Payment due date reminders</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" defaultChecked className="mr-3" />
                                                    <span>Overdue payment alerts</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="mr-3" />
                                                    <span>Send reminders to clients via email</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-red-900 mb-3">Compliance Alerts</h3>
                                            <div className="space-y-3">
                                                <label className="flex items-center">
                                                    <input type="checkbox" defaultChecked className="mr-3" />
                                                    <span>TDS return due dates</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" defaultChecked className="mr-3" />
                                                    <span>Income tax return deadlines</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="mr-3" />
                                                    <span>Audit report submission dates</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Frequency</label>
                                            <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500">
                                                <option>7 days before due date</option>
                                                <option>3 days before due date</option>
                                                <option>1 day before due date</option>
                                                <option>On due date</option>
                                            </select>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                onClick={handleSave}
                                                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save Alert Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Data Backup */}
                            {activeTab === 'backup' && (
                                <div className="p-6">
                                    <div className="flex items-center mb-6">
                                        <Shield className="w-6 h-6 text-primary-600 mr-3" />
                                        <h2 className="text-xl font-semibold">Data Management</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-green-900 mb-3">Export Data</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <button className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:bg-green-100 text-center">
                                                    <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                                    <div className="font-medium">Export Clients</div>
                                                    <div className="text-sm text-gray-600">Download client database</div>
                                                </button>
                                                <button className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:bg-green-100 text-center">
                                                    <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                                    <div className="font-medium">Export Invoices</div>
                                                    <div className="text-sm text-gray-600">Download all invoices</div>
                                                </button>
                                                <button className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:bg-green-100 text-center">
                                                    <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                                    <div className="font-medium">Export GST Data</div>
                                                    <div className="text-sm text-gray-600">Download GST filings</div>
                                                </button>
                                                <button className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:bg-green-100 text-center">
                                                    <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                                    <div className="font-medium">Full Backup</div>
                                                    <div className="text-sm text-gray-600">Complete data export</div>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-blue-900 mb-3">Automatic Backup</h3>
                                            <div className="space-y-3">
                                                <label className="flex items-center">
                                                    <input type="checkbox" defaultChecked className="mr-3" />
                                                    <span>Enable automatic daily backups</span>
                                                </label>
                                                <div className="ml-6">
                                                    <label className="block text-sm font-medium text-blue-700 mb-1">Backup Time</label>
                                                    <select className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                                                        <option>2:00 AM</option>
                                                        <option>3:00 AM</option>
                                                        <option>4:00 AM</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-900 mb-3">Data Retention</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Keep backups for</label>
                                                    <select className="px-3 py-2 border rounded focus:ring-2 focus:ring-primary-500">
                                                        <option>30 days</option>
                                                        <option>90 days</option>
                                                        <option>1 year</option>
                                                        <option>Forever</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                onClick={handleSave}
                                                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save Backup Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}