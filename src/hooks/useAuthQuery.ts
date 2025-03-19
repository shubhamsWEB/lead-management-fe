import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiLogin, apiRegister, apiGetMe, apiLogout } from '../services/utils/apiHelperClient';
import { LoginFormData, RegisterFormData } from '@/lib/types';
import { setToken, removeToken } from '@/lib/utils';

// Keys for React Query cache
export const authKeys = {
  user: ['user'] as const,
};

// Hook to get current user
export function useUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: apiGetMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for login
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LoginFormData) => apiLogin(data),
    onSuccess: (response) => {
      if (response?.data?.success) {
        setToken(response?.data?.token);
        // Update user data in the cache
        queryClient.setQueryData(authKeys.user, response?.data?.user);
      }
    },
  });
}

// Hook for registration
export function useRegister() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RegisterFormData) => apiRegister(data),
    onSuccess: (response) => {
      if (response?.data?.success) {
        setToken(response?.data?.token);
        // Update user data in the cache
        queryClient.setQueryData(authKeys.user, response?.data?.user);
      }
    },
  });
}

// Hook for logout
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      removeToken();
      // Clear user data from cache
      queryClient.setQueryData(authKeys.user, null);
      // Invalidate all queries
      queryClient.invalidateQueries();
    },
    onError: () => {
      removeToken();
      queryClient.setQueryData(authKeys.user, null);
      queryClient.invalidateQueries();
    },
  });
} 