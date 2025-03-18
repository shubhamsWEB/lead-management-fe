import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { apiLogin, apiRegister, apiGetMe, apiLogout } from '../services/utils/apiHelperClient';
import { AuthState, LoginFormData, RegisterFormData, User } from '../lib/types';
import { setToken, getToken, removeToken } from '../lib/utils';
import { useSnackbar } from '@/contexts/snackbarContext';
export function useAuth() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
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
        const token = getToken();
        if (!token) {
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
          return;
        }

        // Try to get current user with the token
        // const response = await api.getCurrentUser();
        const response = await apiGetMe();
        if (response.success) {
          setState({
            user: response.data || null,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } catch (error) {
        // Clear invalid token
        removeToken();
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
      // const response = await api.login(data);
      const response = await apiLogin(data);
      if (response?.data?.success) {
        setToken(response?.data?.token);

        setState({
          user: response?.data?.user || null,
          token: response?.data?.token || null,
          isAuthenticated: true,
          isLoading: false,
        });
        showSnackbar('Login successful', 'success');
        return true;
      }
      showSnackbar(`${response?.message}`, 'error');
      return false;
    } catch (error) {
      showSnackbar(`Error creating lead: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  /**
   * Register function
   */
  const register = useCallback(async (data: RegisterFormData) => {
    console.log("🚀 ~ register ~ data:", data);

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      // const response = await api.register(data);
      const response = await apiRegister(data);
      
      if (response?.data?.success) {
        setToken(response?.data?.token);
        setState({
          user: response?.data?.user || null,
          token: response?.data?.token || null,
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
      await apiLogout();
      removeToken();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
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