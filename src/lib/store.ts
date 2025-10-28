import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import dashboardSlice from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    dashboard: dashboardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
