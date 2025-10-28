'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { initializeAuth, clearAuth, loginUser } from '@/lib/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, loading, token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      // If we have a token but no user data, try to verify it
      if (token && !user && !isAuthenticated) {
        try {
          await dispatch(initializeAuth());
        } catch (error) {
          // Token is invalid, clear it
          dispatch(clearAuth());
        }
      }
    };

    checkAuth();
  }, [dispatch, token, user, isAuthenticated]);

  const login = (email: string, password: string) => {
    return dispatch(loginUser({ email, password }));
  };

  const logout = () => {
    dispatch(clearAuth());
    router.push('/auth/login');
  };

  return {
    isAuthenticated,
    loading,
    user,
    login,
    logout
  };
}
