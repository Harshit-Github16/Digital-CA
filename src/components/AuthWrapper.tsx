'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { initializeAuth, clearAuth } from '@/lib/slices/authSlice';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, token } = useSelector((state: RootState) => state.auth);

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const checkAuth = async () => {
      // If user is on login/register page and already authenticated, redirect to dashboard
      if (isPublicRoute && isAuthenticated) {
        router.push('/');
        return;
      }

      // If user is on protected route and not authenticated
      if (!isPublicRoute && !isAuthenticated) {
        // If there's a token, try to verify it
        if (token) {
          try {
            await dispatch(initializeAuth());
          } catch (error) {
            // Token is invalid, clear it and redirect to login
            dispatch(clearAuth());
            router.push('/auth/login');
          }
        } else {
          // No token, redirect to login
          router.push('/auth/login');
        }
      }
    };

    checkAuth();
  }, [dispatch, router, pathname, isAuthenticated, isPublicRoute, token]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow access to public routes
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Allow access to protected routes if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
