import { useState, useCallback, useEffect, useMemo } from 'react';
import { Lead, LeadFilters, LeadFormData, PaginationState } from '../lib/types';
import { useSnackbar } from '@/contexts/snackbarContext';
import { useDebounce } from './useDebounce';
import { useCreateLeadMutation, useUpdateLeadMutation, useDeleteLeadMutation, useExportLeadsMutation, useLeadsQuery, leadKeys } from './useLeadsQuery';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook for managing leads data and operations
 */
export function useLeads() {
  // Reduce state variables by combining related states
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const { showSnackbar } = useSnackbar();
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  
  // Search term state (for immediate UI updates)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Filtering and sorting state
  const [filters, setFilters] = useState<LeadFilters>({
    search: '',
    sort: 'updatedAt',
    sortOrder: 'desc',
  });
  
  // React Query hooks
  const { 
    data, 
    isLoading, 
    isError, 
    error: queryError 
  } = useLeadsQuery(filters, pagination);
  
  const createLeadMutation = useCreateLeadMutation();
  const updateLeadMutation = useUpdateLeadMutation();
  const deleteLeadMutation = useDeleteLeadMutation();
  const exportLeadsMutation = useExportLeadsMutation();
  
  const queryClient = useQueryClient();
  
  // Update filters when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== filters.search) {
      // Batch the state updates by updating both filters and pagination in one go
      const newFilters = { ...filters, search: debouncedSearchTerm };
      setFilters(newFilters);
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [debouncedSearchTerm, filters]);
  
  // Memoize leads data to avoid unnecessary re-renders
  const leads = useMemo(() => data?.leads || [], [data?.leads]);
  
  // Update pagination from React Query data
  useEffect(() => {
    if (data?.pagination) {
      setPagination(prev => {
        // Only update if values have changed
        return JSON.stringify(prev) !== JSON.stringify(data.pagination) 
          ? data.pagination 
          : prev;
      });
    }
  }, [data?.pagination]);

  // Simplified CRUD operations with better error handling
  const createLead = useCallback(async (data: LeadFormData) => {
    try {
      const response = await createLeadMutation.mutateAsync(data);
      
      showSnackbar(
        response?.success ? 'Lead created successfully' : (response?.message || 'Failed to create lead'),
        response?.success ? 'success' : 'error'
      );
      
      return response?.success || false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showSnackbar(`Error creating lead: ${errorMessage}`, 'error');
      console.error('Error creating lead:', error);
      return false;
    }
  }, [createLeadMutation, showSnackbar]);

  /**
   * Update an existing lead
   */
  const updateLead = useCallback(async (id: string, data: Partial<LeadFormData>) => {
    try {
      const response = await updateLeadMutation.mutateAsync({ id, data });
      
      showSnackbar(
        response?.success ? 'Lead updated successfully' : (response?.message || 'Failed to update lead'),
        response?.success ? 'success' : 'error'
      );
      
      return response?.success || false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showSnackbar(`Error updating lead: ${errorMessage}`, 'error');
      console.error('Error updating lead:', error);
      return false;
    }
  }, [updateLeadMutation, showSnackbar]);

  /**
   * Delete a lead
   */
  const deleteLead = useCallback(async (id: string) => {
    try {
      const response = await deleteLeadMutation.mutateAsync(id);
      
      if (response?.success) {
        // Remove from selected if selected
        setSelectedLeads(prev => prev.filter(leadId => leadId !== id));
        showSnackbar('Lead deleted successfully', 'success');
        return true;
      }
      
      showSnackbar(response?.message || 'Failed to delete lead', 'error');
      return false;
    } catch (error) {
      showSnackbar(`Error deleting lead: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      console.error('Error deleting lead:', error);
      return false;
    }
  }, [deleteLeadMutation, showSnackbar]);

  /**
   * Export leads as CSV
   */
  const exportLeads = useCallback(async () => {
    try {
      const blob = await exportLeadsMutation.mutateAsync({
        pagination,
        filters,
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSnackbar('Leads exported successfully', 'success');
      return true;
    } catch (error) {
      showSnackbar(`Error exporting leads: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      console.error('Error exporting leads:', error);
      return false;
    }
  }, [pagination, filters, exportLeadsMutation, showSnackbar]);

  /**
   * Toggle lead selection
   */
  const toggleSelectLead = useCallback((id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) 
        ? prev.filter(leadId => leadId !== id) 
        : [...prev, id]
    );
  }, []);

  /**
   * Toggle select all leads
   */
  const toggleSelectAll = useCallback(() => {
    setSelectedLeads(prev => prev.length === leads.length ? [] : leads.map((lead: Lead) => lead._id));
  }, [leads]);

  /**
   * Set search filter (updates immediately for UI, but API calls are debounced)
   */
  const setSearchFilter = useCallback((search: string) => {
    setSearchTerm(search);
  }, []);

  /**
   * Set page in pagination
   */
  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  /**
   * Set items per page
   */
  const setLimit = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  // Replace the separate filter and pagination setters with combined functions
  const setFilterAndPage = useCallback((newFilters: LeadFilters, page: number = 1) => {
    // Update both states at once without manually invalidating the query
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page }));
    
    // Remove the manual invalidation
    // The query will automatically refetch when the filters or pagination change
    // because they're part of the query key
  }, []);

  return {
    leads,
    loading: isLoading,
    error: isError ? (queryError?.message || 'Failed to fetch leads') : null,
    pagination,
    filters,
    selectedLeads,
    searchTerm,
    createLead,
    updateLead,
    deleteLead,
    exportLeads,
    toggleSelectLead,
    toggleSelectAll,
    setSearchFilter,
    setFilters,
    setPage,
    setLimit,
    setFilterAndPage,
  };
}
