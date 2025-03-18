'use client';

import React, { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useLeads } from '@/hooks/useLeads';
import { Lead, LeadFormData } from '@/lib/types';
import Button from '@/components/common/button';
import LeadList from '@/components/leads/list';
import LeadFilters from '@/components/leads/filters';
import Dialog from '@/components/common/dialog';
import LeadForm from '@/components/leads/form';
import { useApiErrorHandler } from '@/lib/errorUtils';
import { useSnackbar } from '@/contexts/snackbarContext';
import { formatApiError } from '@/lib/errorUtils';

/**
 * Leads page that implements the UI from the mockup
 */
export default function LeadsPage() {
  // Get leads data and actions from our custom hook
  const {
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
  } = useLeads();

  const { showSnackbar } = useSnackbar();

  // Local state for UI interactions
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to handle API errors
  const handleApiError = (error: any) => {
    console.log("🚀 ~ handleApiError ~ error:", error);
    if (error && error.success === false) {
      showSnackbar(formatApiError(error), 'error');
    } else {
      showSnackbar('An unexpected error occurred', 'error');
      console.error('API Error:', error);
    }
  };

  // Fetch leads on initial load
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handle adding a new lead
  const handleAddLead = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      const success = await createLead(data);
      if (success) {
        setShowAddModal(false);
        showSnackbar('Lead created successfully', 'success');
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle editing a lead
  const handleEditLead = (lead: Lead) => {
    setCurrentLead(lead);
    setShowEditModal(true);
  };

  // Handle updating a lead
  const handleUpdateLead = async (data: LeadFormData) => {
    if (!currentLead) return;
    
    setIsSubmitting(true);
    try {
      const success = await updateLead(currentLead._id, data);
      if (success) {
        setShowEditModal(false);
        showSnackbar('Lead updated successfully', 'success');
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a lead
  const handleDeleteClick = (id: string) => {
    // Find the lead to be deleted
    const lead = leads.find(lead => lead._id === id);
    if (lead) {
      setCurrentLead(lead);
      setShowDeleteModal(true);
    }
  };

  // Confirm and execute lead deletion
  const handleDeleteConfirm = async () => {
    if (!currentLead) return;
    
    setIsSubmitting(true);
    try {
      const success = await deleteLead(currentLead._id);
      if (success) {
        setShowDeleteModal(false);
        showSnackbar('Lead deleted successfully', 'success');
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle exporting leads
  const handleExportLeads = async () => {
    try {
      await exportLeads();
    } catch (err) {
      showSnackbar('Failed to export leads', 'error');
      console.error('Failed to export leads:', err);
    }
  };

  // Reset filters to default
  const handleClearFilters = () => {
    setFilters({
      search: '',
      sort: 'updatedAt',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with title and buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <div className="mt-4 flex space-x-3 sm:mt-0">
          <Button
            variant="primary"
            leftIcon={<PlusIcon className="h-5 w-5" />}
            onClick={() => setShowAddModal(true)}
          >
            Add Lead
          </Button>
          <Button
            variant="outline"
            onClick={handleExportLeads}
          >
            Export All
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <LeadFilters
        filters={filters}
        onFilterChange={setFilters}
        onSearchChange={setSearchFilter}
        onClearFilters={handleClearFilters}
        setPage={setPage}
      />

      {/* Leads count info */}
      <div className="text-sm text-gray-500">
        Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}-
        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} leads
      </div>

      {/* Leads table */}
      <LeadList
        leads={leads}
        selectedLeads={selectedLeads}
        pagination={pagination}
        loading={loading}
        onSelectLead={toggleSelectLead}
        onSelectAll={toggleSelectAll}
        onEditLead={handleEditLead}
        onDeleteLead={handleDeleteClick}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {/* Add lead modal */}
      {showAddModal && (
        <Dialog
          title="Add New Lead"
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        >
          <LeadForm
            onSubmit={handleAddLead}
            onCancel={() => setShowAddModal(false)}
            isSubmitting={isSubmitting}
          />
        </Dialog>
      )}

      {/* Edit lead modal */}
      {showEditModal && currentLead && (
        <Dialog
          title={`Edit Lead: ${currentLead.name}`}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        >
          <LeadForm
            lead={currentLead}
            onSubmit={handleUpdateLead}
            onCancel={() => setShowEditModal(false)}
            isSubmitting={isSubmitting}
          />
        </Dialog>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && currentLead && (
        <Dialog
          title="Delete Lead"
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete <span className="font-medium">{currentLead.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                isLoading={isSubmitting}
              >
                Delete
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}