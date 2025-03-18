import React, { useState } from 'react';
import { Lead } from '@/lib/types';
import LeadItem from './item';
import LeadOptions from './options';
import Checkbox from '../common/checkbox';
import Button from '../common/button';
import Pagination from '../common/pagination';

interface LeadListProps {
  leads: Lead[];
  selectedLeads: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  onSelectLead: (id: string) => void;
  onSelectAll: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

/**
 * Lead list component that renders the entire table of leads
 * 
 * This matches the table in the UI mockup
 */
export default function LeadList({
  leads,
  selectedLeads,
  pagination,
  loading,
  onSelectLead,
  onSelectAll,
  onEditLead,
  onDeleteLead,
  onPageChange,
  onLimitChange,
}: LeadListProps) {
  const [activeOptions, setActiveOptions] = useState<Lead | null>(null);
  
  // Check if all leads are selected
  const allSelected = leads.length > 0 && selectedLeads.length === leads.length;
  
  // Handle options menu click
  const handleOptionsClick = (lead: Lead) => {
    setActiveOptions(lead);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-purple-600"></div>
          <span className="ml-2 text-sm text-gray-500">Loading leads...</span>
        </div>
      ) : leads.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">No leads found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Checkbox
                      checked={allSelected}
                      onChange={onSelectAll}
                      aria-label="Select all leads"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engaged
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Contacted
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <LeadItem
                  key={lead._id}
                  lead={lead}
                  isSelected={selectedLeads.includes(lead._id)}
                  onSelect={onSelectLead}
                  onEditLead={onEditLead}
                  onDeleteLead={onDeleteLead}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
              itemsPerPage={pagination.limit}
              onItemsPerPageChange={onLimitChange}
            />
          </div>
        </>
      )}
    </div>
  );
}