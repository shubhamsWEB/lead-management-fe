import { useState, useCallback } from 'react';
import api from '../lib/api';
import { Lead, LeadFilters, LeadFormData, PaginationState } from '../lib/types';

/**
 * Custom hook for managing leads data and operations
 */
export function useLeads() {
  // State for leads data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  
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
  
  // Filtering and sorting state
  const [filters, setFilters] = useState<LeadFilters>({
    search: '',
    sort: 'updatedAt',
    sortOrder: 'desc',
  });

  /**
   * Fetch leads with current pagination and filters
   */
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getLeads(pagination.page, pagination.limit, filters);
      
      if (response.success) {
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
      
      const response = await api.createLead(data);
      
      if (response.success) {
        // Refresh the lead list
        await fetchLeads();
        return true;
      }
      return false;
    } catch (error) {
      setError('Failed to create lead');
      console.error('Error creating lead:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchLeads]);

  /**
   * Update an existing lead
   */
  const updateLead = useCallback(async (id: string, data: Partial<LeadFormData>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.updateLead(id, data);
      
      if (response.success) {
        // Update the lead in the current list to avoid refetching
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead._id === id ? { ...lead, ...response.data } : lead
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      setError('Failed to update lead');
      console.error('Error updating lead:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a lead
   */
  const deleteLead = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.deleteLead(id);
      
      if (response.success) {
        // Remove the lead from the current list
        setLeads(prevLeads => prevLeads.filter(lead => lead._id !== id));
        // Also remove from selected if selected
        setSelectedLeads(prev => prev.filter(leadId => leadId !== id));
        return true;
      }
      return false;
    } catch (error) {
      setError('Failed to delete lead');
      console.error('Error deleting lead:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Export leads as CSV
   */
  const exportLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const blob = await api.exportLeads();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      setError('Failed to export leads');
      console.error('Error exporting leads:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

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
   * Set search filter
   */
  const setSearchFilter = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, page: 1 }));
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