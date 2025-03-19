import { useRouter } from 'next/navigation';
import { useUser, useLogin, useRegister, useLogout } from './useAuthQuery';
import { LoginFormData, RegisterFormData } from '@/lib/types';

export function useAuth() {
  const router = useRouter();
  const { data: user, isLoading, isError } = useUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = async (data: LoginFormData) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      if (response?.data?.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      const response = await registerMutation.mutateAsync(data);
      if (response?.data?.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  return {
    user: user?.data,
    isAuthenticated: !!user?.data,
    isLoading,
    login,
    register,
    logout,
  };
}