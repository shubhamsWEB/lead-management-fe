import { ApiError } from './types';

/**
 * Formats API error messages for display
 * @param error The API error object
 * @returns A formatted error message
 */
export function formatApiError(error: ApiError): string {
  // If there's a general message, use it
  if (error.message) {
    return error.message;
  }
  
  // If there are field-specific errors, format them
  if (error.errors && error.errors.length > 0) {
    // Get the first error message
    const firstError = error.errors[0];
    
    // If it has a path and msg, format it nicely
    if (firstError.path && firstError.msg) {
      // Convert camelCase field names to readable format
      const fieldName = firstError.path
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
      
      return `${fieldName}: ${firstError.msg}`;
    }
    
    // Otherwise just return the message
    return firstError.msg || 'An error occurred';
  }
  
  // Default error message
  return 'An unexpected error occurred';
}

/**
 * Hook to handle API errors and display them in a snackbar
 * Must be used within components that have access to the SnackbarContext
 */
export function useApiErrorHandler() {
  // Import useSnackbar here to ensure it's only called within a component
  const { useSnackbar } = require('@/contexts/snackbarContext');
  const { showSnackbar } = useSnackbar();
  
  const handleApiError = (error: any) => {
    // Check if it's an API error with our expected structure
    if (error && error.success === false) {
      const errorMessage = formatApiError(error);
      showSnackbar(errorMessage, 'error');
      return;
    }
    
    // Handle unexpected errors
    console.error('API Error:', error);
    showSnackbar('An unexpected error occurred', 'error');
  };
  
  return { handleApiError };
} 