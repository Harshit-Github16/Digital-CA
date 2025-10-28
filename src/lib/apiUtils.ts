// Simple API utilities for authenticated requests

/**
 * Get the current JWT token from localStorage
 */
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

/**
 * Create headers with authentication
 */
export function createAuthHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T = any>(
    endpoint: string,
    options: RequestInit & { requireAuth?: boolean } = {}
): Promise<T> {
    const { requireAuth = true, ...requestOptions } = options;

    // Prepare URL
    const url = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;

    // Prepare headers
    const headers = createAuthHeaders(requireAuth);

    // Merge with any existing headers
    if (requestOptions.headers) {
        Object.assign(headers, requestOptions.headers);
    }

    try {
        const response = await fetch(url, {
            ...requestOptions,
            headers,
        });

        // Handle authentication errors
        if (response.status === 401) {
            // Clear token and redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/auth/login';
            }
            throw new Error('Authentication required');
        }

        // Parse response
        const contentType = response.headers.get('content-type');
        let data: any;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        console.error(`API Error [${requestOptions.method || 'GET'} ${url}]:`, error);
        throw error;
    }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
    get: <T = any>(endpoint: string, requireAuth = true): Promise<T> =>
        apiRequest<T>(endpoint, { method: 'GET', requireAuth }),

    post: <T = any>(endpoint: string, data?: any, requireAuth = true): Promise<T> =>
        apiRequest<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            requireAuth,
        }),

    put: <T = any>(endpoint: string, data?: any, requireAuth = true): Promise<T> =>
        apiRequest<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            requireAuth,
        }),

    patch: <T = any>(endpoint: string, data?: any, requireAuth = true): Promise<T> =>
        apiRequest<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
            requireAuth,
        }),

    delete: <T = any>(endpoint: string, requireAuth = true): Promise<T> =>
        apiRequest<T>(endpoint, { method: 'DELETE', requireAuth }),
};

/**
 * Specific API endpoints
 */
export const apiEndpoints = {
    // Authentication
    login: (credentials: { email: string; password: string }) =>
        api.post('/auth/login', credentials, false),

    register: (userData: any) =>
        api.post('/auth/register', userData, false),

    verifyToken: () =>
        api.get('/auth/verify'),

    // Dashboard
    getDashboardStats: () =>
        api.get('/dashboard/stats'),

    getChartData: () =>
        api.get('/dashboard/chart-data'),

    // Clients
    getClients: (params?: Record<string, any>) => {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return api.get(`/clients${query}`);
    },

    createClient: (clientData: any) =>
        api.post('/clients', clientData),

    getClient: (id: string) =>
        api.get(`/clients/${id}`),

    updateClient: (id: string, clientData: any) =>
        api.put(`/clients/${id}`, clientData),

    deleteClient: (id: string) =>
        api.delete(`/clients/${id}`),

    // Invoices
    getInvoices: (params?: Record<string, any>) => {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return api.get(`/invoices${query}`);
    },

    createInvoice: (invoiceData: any) =>
        api.post('/invoices', invoiceData),

    getInvoice: (id: string) =>
        api.get(`/invoices/${id}`),

    updateInvoice: (id: string, invoiceData: any) =>
        api.put(`/invoices/${id}`, invoiceData),

    deleteInvoice: (id: string) =>
        api.delete(`/invoices/${id}`),

    // GST Filings
    getGSTFilings: (params?: Record<string, any>) => {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return api.get(`/gst-filings${query}`);
    },

    createGSTFiling: (filingData: any) =>
        api.post('/gst-filings', filingData),

    getGSTFiling: (id: string) =>
        api.get(`/gst-filings/${id}`),

    updateGSTFiling: (id: string, filingData: any) =>
        api.put(`/gst-filings/${id}`, filingData),

    deleteGSTFiling: (id: string) =>
        api.delete(`/gst-filings/${id}`),

    // Tax Compliance
    getTaxCompliance: (params?: Record<string, any>) => {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return api.get(`/tax-compliance${query}`);
    },

    createTaxCompliance: (complianceData: any) =>
        api.post('/tax-compliance', complianceData),

    getTaxComplianceRecord: (id: string) =>
        api.get(`/tax-compliance/${id}`),

    updateTaxCompliance: (id: string, complianceData: any) =>
        api.put(`/tax-compliance/${id}`, complianceData),

    deleteTaxCompliance: (id: string) =>
        api.delete(`/tax-compliance/${id}`),
};

export default apiEndpoints;