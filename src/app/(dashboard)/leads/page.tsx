'use client';

import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Lead, LeadFormData } from '@/lib/types';
import Button from '@/components/common/button';
import LeadList from '@/components/leads/list';
import LeadFiltersComponent from '@/components/leads/filters';
import Dialog from '@/components/common/dialog';
import LeadForm from '@/components/leads/form';
import { useLeads } from '@/hooks/useLeads';
import { useSnackbar } from '@/contexts/snackbarContext';

export default function LeadsPage() {
  // Local state for UI interactions
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const { showSnackbar } = useSnackbar();
  
  // Use the useLeads hook to get all lead-related functionality
  const {
    leads,
    loading,
    error,
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
    setLimit
  } = useLeads();
  
  // Handle adding a new lead
  const handleAddLead = async (data: LeadFormData) => {
    try {
      const success = await createLead(data);
      if (success) {
        setShowAddModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // Handle editing a lead
  const handleEditLead = (lead: Lead) => {
    setCurrentLead(lead);
    setShowEditModal(true);
  };
  
  // Handle updating a lead
  const handleUpdateLead = async (formData: LeadFormData) => {
    if (!currentLead) return;
    
    try {
      const success = await updateLead(currentLead._id, formData);
      if (success) {
        setShowEditModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // Handle deleting a lead
  const handleDeleteClick = (id: string) => {
    const lead = leads.find((lead: Lead) => lead._id === id);
    if (lead) {
      setCurrentLead(lead);
      setShowDeleteModal(true);
    }
  };
  
  // Confirm and execute lead deletion
  const handleDeleteConfirm = async () => {
    if (!currentLead) return;
    
    try {
      const success = await deleteLead(currentLead._id);
      if (success) {
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // Handle exporting leads
  const handleExportLeads = async () => {
    try {
      await exportLeads();
    } catch (error) {
      console.error(error);
    }
  };
  
  // Handle clearing filters
  const handleClearFilters = () => {
    setSearchFilter('');
    setFilters({
      search: '',
      sort: 'updatedAt',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="space-y-4 px-2 md:px-20">
      {/* Header with title and buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <div className="mt-4 flex space-x-3 sm:mt-0">
          <Button
            variant="outline"
            leftIcon={<PlusIcon className="h-5 w-5" />}
            onClick={() => setShowAddModal(true)}
          >
            Add Lead
          </Button>
          <Button
            variant="primary"
            onClick={handleExportLeads}
            isLoading={loading}
          >
            Export All
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <LeadFiltersComponent
        filters={filters}
        onFilterChange={setFilters}
        onSearchChange={setSearchFilter}
        onClearFilters={handleClearFilters}
        setPage={setPage}
        searchTerm={searchTerm}
      />

      {/* Leads count info */}
      <div className="text-sm text-gray-500">
        Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}-
        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} leads
      </div>

      {/* Leads table */}
      <LeadList
        leads={leads || []}
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
            isSubmitting={loading}
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
            isSubmitting={loading}
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
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                isLoading={loading}
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