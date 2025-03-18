import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { AuthState, LoginFormData, RegisterFormData, User } from '../lib/types';

/**
 * Custom hook for authentication logic
 */
export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if we have a token stored
        const token = localStorage.getItem('token');
        if (!token) {
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
          return;
        }

        // Try to get current user with the token
        const response = await api.getCurrentUser();
        if (response.success) {
          setState({
            user: response.user || null,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } catch (error) {
        // Clear invalid token
        localStorage.removeItem('token');
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    };

    loadUser();
  }, []);

  /**
   * Login function
   */
  const login = useCallback(async (data: LoginFormData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await api.login(data);
      
      if (response.success) {
        setState({
          user: response?.user || null,
          token: response?.token || null,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  /**
   * Register function
   */
  const register = useCallback(async (data: RegisterFormData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await api.register(data);
      
      if (response.success) {
        setState({
          user: response.user || null,
          token: response.token || null,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      api.removeToken();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      router.push('/login');
    }
  }, [router]);

  return {
    ...state,
    login,
    register,
    logout,
  };
}