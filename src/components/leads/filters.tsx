import React from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { LeadFilters as LeadFiltersType, StageType } from '@/lib/types';
import Input from '../common/input';
import Button from '../common/button';

interface LeadFiltersProps {
  filters: LeadFiltersType;
  searchTerm: string;
  onFilterChange: (filters: LeadFiltersType) => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
  setPage: (page: number) => void;
}

export default function LeadFilters({
  filters,
  onFilterChange,
  onSearchChange,
  onClearFilters,
  setPage,
  searchTerm,
}: LeadFiltersProps) {
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);

  // Handle filter changes
  const handleStageChange = (stage: StageType | '') => {
    // Set the entire filter object at once to avoid multiple state updates
    onFilterChange({ 
      ...filters, 
      stage: stage === '' ? undefined : stage as StageType,
    });
  };

  const handleEngagedChange = (engaged: boolean | null) => {
    onFilterChange({ 
      ...filters, 
      engaged: engaged === null ? undefined : engaged,
    });
  };

  const handleSortChange = (field: string) => {
    // If same field, toggle order, otherwise set new field with asc order
    const newOrder = field === filters.sort && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFilterChange({ 
      ...filters, 
      sort: field, 
      sortOrder: newOrder,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        {/* Search input */}
        <div className="flex-grow">
          <Input
            placeholder="Search by lead's name, email or company name"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
            className="w-full"
          />
        </div>

        {/* Filter button */}
        <div className="mt-2 sm:mt-0">
          <Button 
            variant="outline" 
            leftIcon={<FunnelIcon className="h-5 w-5" />}
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            Filter & Sort
          </Button>
        </div>
      </div>

      {/* Filter panel (expanded when filter button is clicked) */}
      {showFilterPanel && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Filters</h3>
            <button 
              onClick={onClearFilters}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Stage filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stage
              </label>
              <select
                value={filters.stage || ''}
                onChange={(e) => handleStageChange(e.target.value as StageType | '')}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="">All stages</option>
                <option value="I">Initial Contact</option>
                <option value="II">Meeting Scheduled</option>
                <option value="III">Proposal Sent</option>
                <option value="IIII">Negotiation</option>
              </select>
            </div>

            {/* Engaged filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Engagement
              </label>
              <select
                value={filters.engaged === undefined ? '' : filters.engaged ? 'true' : 'false'}
                onChange={(e) => {
                  const value = e.target.value;
                  handleEngagedChange(
                    value === '' ? null : value === 'true'
                  );
                }}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="">All</option>
                <option value="true">Engaged</option>
                <option value="false">Not Engaged</option>
              </select>
            </div>

            {/* Sort options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort by
              </label>
              <select
                value={filters.sort || 'updatedAt'}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="name">Name</option>
                <option value="company">Company</option>
                <option value="stage">Stage</option>
                <option value="lastContacted">Last Contacted</option>
                <option value="updatedAt">Recently Updated</option>
              </select>
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-500 mr-2">Order:</span>
                <button
                  onClick={() => 
                    onFilterChange({ 
                      ...filters, 
                      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                    })
                  }
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}