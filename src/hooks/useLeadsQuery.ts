import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  apiGetAllLeads, 
  apiCreateLead, 
  apiUpdateLead, 
  apiDeleteLead, 
  apiExportLeads 
} from '../services/utils/apiHelperClient';
import { Lead, LeadFilters, LeadFormData, PaginationState } from '@/lib/types';

// Create a stable identity for query keys
const LEADS_KEY = 'leads';

// Keys for React Query cache
export const leadKeys = {
  all: [LEADS_KEY] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
  list: (filters: LeadFilters, pagination: Partial<PaginationState>) => {
    // Create a stable query key to prevent unnecessary refetching
    const queryKey = {
      type: 'list',
      filters: {
        ...filters,
      },
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
      }
    };
    return [LEADS_KEY, queryKey];
  },
  details: () => [...leadKeys.all, 'detail'] as const,
  detail: (id: string) => [...leadKeys.details(), id] as const,
};

// Hook to fetch leads with pagination and filters
export function useLeadsQuery(filters: LeadFilters, pagination: Partial<PaginationState>) {
  return useQuery({
    queryKey: leadKeys.list(filters, pagination),
    queryFn: () => apiGetAllLeads({
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      ...filters
    }),
    select: (data) => ({
      leads: data.data || [],
      pagination: {
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      }
    }),
    // Set to false to prevent fetching on mount - we rely on initial render only
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    // Increased stale time to reduce unnecessary fetches
    staleTime: 60 * 1000, // 1 minute
  });
}

// Hook to create a new lead
export function useCreateLeadMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LeadFormData) => apiCreateLead(data),
    onSuccess: () => {
      // Invalidate leads list to trigger refetch
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
    },
  });
}

// Hook to update a lead
export function useUpdateLeadMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<LeadFormData> }) => 
      apiUpdateLead({ ...data, id }),
    onSuccess: (response, variables) => {
      // Update the lead in the cache
      queryClient.setQueryData(
        leadKeys.detail(variables.id),
        response.data
      );
      // Invalidate the list to ensure it's up to date
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
    },
  });
}

// Hook to delete a lead
export function useDeleteLeadMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiDeleteLead(id),
    onSuccess: (_, id) => {
      // Remove the lead from the cache
      queryClient.removeQueries({ queryKey: leadKeys.detail(id) });
      // Invalidate the list to ensure it's up to date
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
    },
  });
}

// Hook to export leads
export function useExportLeadsMutation() {
  return useMutation({
    mutationFn: (params: { pagination: Partial<PaginationState>, filters: LeadFilters }) => 
      apiExportLeads({ ...params.pagination, ...params.filters }),
  });
}