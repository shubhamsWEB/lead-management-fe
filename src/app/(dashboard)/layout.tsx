'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SnackbarProvider } from '@/contexts/snackbarContext';
import ErrorBoundary from '@/components/common/errorBoundary';
import TopNav from '@/components/layout/TopNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token') || 
                 document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  // If still loading auth state, show loading spinner
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-600"></div>
      </div>
    );
  }

  // If not authenticated, don't render content
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SnackbarProvider>
      <ErrorBoundary>
        <div>
          <TopNav />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </ErrorBoundary>
    </SnackbarProvider>
  );
}