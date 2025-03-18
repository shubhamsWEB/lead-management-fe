import { useState, useCallback, useEffect } from 'react';
import { apiGetAllLeads, apiCreateLead, apiUpdateLead, apiDeleteLead, apiExportLeads } from '../services/utils/apiHelperClient';
import { Lead, LeadFilters, LeadFormData, PaginationState } from '../lib/types';
import { useSnackbar } from '@/contexts/snackbarContext';
import { useDebounce } from './useDebounce';
/**
 * Custom hook for managing leads data and operations
 */
export function useLeads() {
  // State for leads data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const { showSnackbar } = useSnackbar();
  // Loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
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

  // Update filters when debounced search term changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearchTerm }));
    // Reset to first page when search term changes
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearchTerm]);

  /**
   * Fetch leads with current pagination and filters
   */
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiGetAllLeads({page:pagination.page, limit:pagination.limit, ...filters});
      
      if (response?.success) {
        setLeads(response.data || []);
        setPagination({
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        });
      }
    } catch (error) {
      setError('Failed to fetch leads');
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  /**
   * Create a new lead
   */
  const createLead = useCallback(async (data: LeadFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCreateLead(data);
      
      // Check if the response indicates an error despite the 200 status code
      if (response?.success === false) {
        // This is an error response with a 200 status code
        showSnackbar(response?.message, 'error');
        setError('Failed to create lead');
        return false;
      }
      
      if (response?.success) {
        // Add the new lead to the list and refresh
        showSnackbar('Lead created successfully', 'success');
        await fetchLeads();
        return true;
      }
      
      // If we get here, something unexpected happened
      showSnackbar('Failed to create lead', 'error');
      return false;
    } catch (error) {
      // This will only catch network errors or other exceptions
      showSnackbar(`Error creating lead: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      setError('Failed to create lead');
      console.error('Error creating lead:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchLeads, showSnackbar]);

  /**
   * Update an existing lead
   */
  const updateLead = useCallback(async (id: string, data: Partial<LeadFormData>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiUpdateLead({...data,id});
      
      if (response?.success) {
        // Update the lead in the current list to avoid refetching
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead._id === id ? { ...lead, ...response.data } : lead
          )
        );
        showSnackbar('Lead updated successfully', 'success');
        return true;
      }
      showSnackbar(response?.message || 'Failed to update lead', 'error');
      return false;
    } catch (error) {
      showSnackbar(`Error updating lead: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      setError('Failed to update lead');
      console.error('Error updating lead:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  /**
   * Delete a lead
   */
  const deleteLead = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiDeleteLead(id);
      console.log("🚀 ~ deleteLead ~ response:", response);
      
      if (response?.success) {
        // Remove the lead from the current list
        setLeads(prevLeads => prevLeads.filter(lead => lead._id !== id));
        // Also remove from selected if selected
        setSelectedLeads(prev => prev.filter(leadId => leadId !== id));
        showSnackbar('Lead deleted successfully', 'success');
        return true;
      }
      showSnackbar(response?.message || 'Failed to delete lead', 'error');
      return false;
    } catch (error) {
      showSnackbar(`Error deleting lead: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      setError('Failed to delete lead');
      console.error('Error deleting lead:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  /**
   * Export leads as CSV
   */
  const exportLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const blob = await apiExportLeads({...pagination, ...filters});
      
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
      setError('Failed to export leads');
      return false;
    } finally {
      setLoading(false);
    }
  }, [pagination, filters, showSnackbar]);

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
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead._id));
    }
  }, [leads, selectedLeads.length]);

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

  return {
    leads,
    loading,
    error,
    pagination,
    filters,
    selectedLeads,
    searchTerm,
    fetchLeads,
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
  };
}