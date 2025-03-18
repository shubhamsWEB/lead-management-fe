import React from 'react';
import { useForm } from 'react-hook-form';
import { ApiError, Lead, LeadFormData, StageType } from '@/lib/types';
import Input from '../common/input';
import Button from '../common/button';
import { useApiErrorHandler } from '@/lib/errorUtils';
import { useSnackbar } from '@/contexts/snackbarContext';
import { formatApiError } from '@/lib/errorUtils';

interface LeadFormProps {
  lead?: Lead; // If provided, we're editing; otherwise, creating
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

/**
 * Form for creating or editing a lead
 */
export default function LeadForm({
  lead,
  onSubmit,
  onCancel,
  isSubmitting,
}: LeadFormProps) {
  const { showSnackbar } = useSnackbar();
  
  // Initialize the form with default values or existing lead data
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    defaultValues: lead
      ? {
          name: lead.name,
          email: lead.email,
          company: lead.company,
          stage: lead.stage,
          engaged: lead.engaged,
          lastContacted: lead.lastContacted 
            ? new Date(lead.lastContacted).toISOString().split('T')[0]
            : undefined,
        }
      : {
          stage: 'I',
          engaged: false,
        },
  });

  // Form submission handler
  const handleFormSubmit = async (data: LeadFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      if (error) {
        showSnackbar(formatApiError(error as ApiError), 'error');
      } else {
        showSnackbar('An unexpected error occurred', 'error');
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Name field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <Input
            id="name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <Input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />
        </div>
      </div>

      {/* Company field */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
          Company *
        </label>
        <Input
          id="company"
          {...register('company', { required: 'Company is required' })}
          error={errors.company?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Stage field */}
        <div>
          <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
            Stage
          </label>
          <select
            id="stage"
            {...register('stage')}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="I">Initial Contact</option>
            <option value="II">Meeting Scheduled</option>
            <option value="III">Proposal Sent</option>
            <option value="IIII">Negotiation</option>
          </select>
        </div>

        {/* Last contacted field */}
        <div>
          <label htmlFor="lastContacted" className="block text-sm font-medium text-gray-700 mb-1">
            Last Contacted
          </label>
          <Input
            id="lastContacted"
            type="date"
            {...register('lastContacted')}
          />
        </div>
      </div>

      {/* Engaged checkbox */}
      <div className="flex items-center">
        <input
          id="engaged"
          type="checkbox"
          {...register('engaged')}
          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <label htmlFor="engaged" className="ml-2 block text-sm text-gray-700">
          Engaged
        </label>
      </div>

      {/* Form actions */}
      <div className="mt-6 flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
        >
          {lead ? 'Update Lead' : 'Add Lead'}
        </Button>
      </div>
    </form>
  );
}