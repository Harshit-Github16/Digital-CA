'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
// import AuthWrapper from '@/components/AuthWrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {/* <AuthWrapper> */}
        {children}
      {/* </AuthWrapper> */}
    </Provider>
  );
}
