import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface DashboardStats {
  totalSales: number;
  taxLiability: number;
  itc: number;
  pendingReturns: number;
  totalClients: number;
  activeInvoices: number;
  monthlyGrowth: number;
  revenue: number;
}

export interface ChartData {
  month: string;
  sales: number;
  tax: number;
  itc: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  chartData: ChartData[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  chartData: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { apiEndpoints } = await import('@/lib/apiUtils');
      return await apiEndpoints.getDashboardStats();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchChartData = createAsyncThunk(
  'dashboard/fetchChartData',
  async (_, { rejectWithValue }) => {
    try {
      const { apiEndpoints } = await import('@/lib/apiUtils');
      return await apiEndpoints.getChartData();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch chart data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateStats: (state, action: PayloadAction<Partial<DashboardStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Chart Data
      .addCase(fetchChartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.chartData = action.payload;
        state.error = null;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateStats } = dashboardSlice.actions;
export default dashboardSlice.reducer;
