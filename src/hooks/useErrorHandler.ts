import { useState, useCallback } from 'react';
import { useSnackbar } from '@/contexts/snackbarContext';
import { formatApiError } from '@/lib/errorUtils';

export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);
  const { showSnackbar } = useSnackbar();

  const handleError = useCallback((error: any) => {
    // Set the error state for the Error Boundary to catch
    setError(error);

    // Handle API errors for snackbar display
    if (error && error.success === false) {
      showSnackbar(formatApiError(error), 'error');
    } else {
      showSnackbar('An unexpected error occurred', 'error');
      console.error('Error:', error);
    }
  }, [showSnackbar]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    resetError
  };
} 