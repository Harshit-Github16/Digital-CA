// API utility for making authenticated requests
import { store } from './store';

interface ApiOptions extends RequestInit {
    requireAuth?: boolean;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string = '/api') {
        this.baseURL = baseURL;
    }

    private getToken(): string | null {
        if (typeof window === 'undefined') return null;

        // Try to get token from Redux store first
        const state = store.getState();
        if (state.auth.token) {
            return state.auth.token;
        }

        // Fallback to localStorage
        return localStorage.getItem('token');
    }

    private async request<T>(
        endpoint: string,
        options: ApiOptions = {}
    ): Promise<T> {
        const { requireAuth = true, headers = {}, ...restOptions } = options;

        const url = `${this.baseURL}${endpoint}`;

        // Prepare headers
        const requestHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(headers as Record<string, string>),
        };

        // Add authorization header if required
        if (requireAuth) {
            const token = this.getToken();
            if (token) {
                requestHeaders['Authorization'] = `Bearer ${token}`;
            } else {
                throw new Error('No authentication token found');
            }
        }

        try {
            const response = await fetch(url, {
                ...restOptions,
                headers: requestHeaders,
            });

            // Handle different response types
            const contentType = response.headers.get('content-type');
            let data: any;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                // Handle 401 Unauthorized
                if (response.status === 401) {
                    // Clear token and redirect to login
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                        // Dispatch logout action if needed
                        window.location.href = '/auth/login';
                    }
                    throw new Error(data.error || 'Unauthorized');
                }

                throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error(`API Error [${options.method || 'GET'} ${url}]:`, error);
            throw error;
        }
    }

    // HTTP Methods
    async get<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any, options: ApiOptions = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: any, options: ApiOptions = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async patch<T>(endpoint: string, data?: any, options: ApiOptions = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }

    // Public methods (no auth required)
    async publicGet<T>(endpoint: string, options: Omit<ApiOptions, 'requireAuth'> = {}): Promise<T> {
        return this.get<T>(endpoint, { ...options, requireAuth: false });
    }

    async publicPost<T>(endpoint: string, data?: any, options: Omit<ApiOptions, 'requireAuth'> = {}): Promise<T> {
        return this.post<T>(endpoint, data, { ...options, requireAuth: false });
    }
}

// Create and export API client instance
export const api = new ApiClient();

// Export types
export type { ApiOptions };

// Convenience functions for common operations
export const apiClient = {
    // Auth endpoints
    login: (credentials: { email: string; password: string }) =>
        api.publicPost('/auth/login', credentials),

    register: (userData: any) =>
        api.publicPost('/auth/register', userData),

    verifyToken: () =>
        api.get('/auth/verify'),

    // Client endpoints
    getClients: (params?: { page?: number; limit?: number; search?: string }) => {
        const queryString = params ? '?' + new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== undefined) acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString() : '';
        return api.get(`/clients${queryString}`);
    },

    createClient: (clientData: any) =>
        api.post('/clients', clientData),

    getClient: (id: string) =>
        api.get(`/clients/${id}`),

    updateClient: (id: string, clientData: any) =>
        api.put(`/clients/${id}`, clientData),

    deleteClient: (id: string) =>
        api.delete(`/clients/${id}`),

    // Invoice endpoints
    getInvoices: (params?: { page?: number; limit?: number; status?: string; clientId?: string }) => {
        const queryString = params ? '?' + new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== undefined) acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString() : '';
        return api.get(`/invoices${queryString}`);
    },

    createInvoice: (invoiceData: any) =>
        api.post('/invoices', invoiceData),

    getInvoice: (id: string) =>
        api.get(`/invoices/${id}`),

    updateInvoice: (id: string, invoiceData: any) =>
        api.put(`/invoices/${id}`, invoiceData),

    deleteInvoice: (id: string) =>
        api.delete(`/invoices/${id}`),

    // GST Filing endpoints
    getGSTFilings: (params?: { page?: number; limit?: number; status?: string; filingType?: string; clientId?: string }) => {
        const queryString = params ? '?' + new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== undefined) acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString() : '';
        return api.get(`/gst-filings${queryString}`);
    },

    createGSTFiling: (filingData: any) =>
        api.post('/gst-filings', filingData),

    getGSTFiling: (id: string) =>
        api.get(`/gst-filings/${id}`),

    updateGSTFiling: (id: string, filingData: any) =>
        api.put(`/gst-filings/${id}`, filingData),

    deleteGSTFiling: (id: string) =>
        api.delete(`/gst-filings/${id}`),

    // Tax Compliance endpoints
    getTaxCompliance: (params?: { page?: number; limit?: number; status?: string; taxType?: string }) => {
        const queryString = params ? '?' + new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== undefined) acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString() : '';
        return api.get(`/tax-compliance${queryString}`);
    },

    createTaxCompliance: (complianceData: any) =>
        api.post('/tax-compliance', complianceData),

    getTaxComplianceRecord: (id: string) =>
        api.get(`/tax-compliance/${id}`),

    updateTaxCompliance: (id: string, complianceData: any) =>
        api.put(`/tax-compliance/${id}`, complianceData),

    deleteTaxCompliance: (id: string) =>
        api.delete(`/tax-compliance/${id}`),

    // Dashboard endpoints
    getDashboardStats: () =>
        api.get('/dashboard/stats'),

    getChartData: () =>
        api.get('/dashboard/charts'),
};

export default apiClient;