// Simple API client for making authenticated requests
export class ApiClient {
    private getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('token');
    }

    async request(endpoint: string, options: RequestInit = {}) {
        const token = this.getToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`/api${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Clear token and redirect to login
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    window.location.href = '/auth/login';
                }
            }
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // HTTP methods
    get(endpoint: string) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint: string, data?: any) {
        return this.request(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    put(endpoint: string, data?: any) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    delete(endpoint: string) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Convenience methods
export const api = {
    // Dashboard
    getDashboardStats: () => apiClient.get('/dashboard/stats'),
    getChartData: () => apiClient.get('/dashboard/chart-data'),

    // Clients
    getClients: (params?: Record<string, any>) => {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiClient.get(`/clients${query}`);
    },
    createClient: (data: any) => apiClient.post('/clients', data),
    getClient: (id: string) => apiClient.get(`/clients/${id}`),
    updateClient: (id: string, data: any) => apiClient.put(`/clients/${id}`, data),
    deleteClient: (id: string) => apiClient.delete(`/clients/${id}`),

    // Invoices
    getInvoices: (params?: Record<string, any>) => {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiClient.get(`/invoices${query}`);
    },
    createInvoice: (data: any) => apiClient.post('/invoices', data),
    getInvoice: (id: string) => apiClient.get(`/invoices/${id}`),
    updateInvoice: (id: string, data: any) => apiClient.put(`/invoices/${id}`, data),
    deleteInvoice: (id: string) => apiClient.delete(`/invoices/${id}`),

    // GST Filings
    getGSTFilings: (params?: Record<string, any>) => {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiClient.get(`/gst-filings${query}`);
    },
    createGSTFiling: (data: any) => apiClient.post('/gst-filings', data),
    getGSTFiling: (id: string) => apiClient.get(`/gst-filings/${id}`),
    updateGSTFiling: (id: string, data: any) => apiClient.put(`/gst-filings/${id}`, data),
    deleteGSTFiling: (id: string) => apiClient.delete(`/gst-filings/${id}`),

    // Tax Compliance
    getTaxCompliance: (params?: Record<string, any>) => {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiClient.get(`/tax-compliance${query}`);
    },
    createTaxCompliance: (data: any) => apiClient.post('/tax-compliance', data),
    getTaxComplianceRecord: (id: string) => apiClient.get(`/tax-compliance/${id}`),
    updateTaxCompliance: (id: string, data: any) => apiClient.put(`/tax-compliance/${id}`, data),
    deleteTaxCompliance: (id: string) => apiClient.delete(`/tax-compliance/${id}`),
};

export default api;