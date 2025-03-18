import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { 
  ApiError, 
  ApiResponse, 
  Lead, 
  LeadFilters, 
  LeadFormData,
  LoginFormData,
  PaginatedResponse,
  RegisterFormData,
  User 
} from './types';

// API base URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Custom API client built on axios
 */
class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for adding token
    this.client.interceptors.request.use(
      (config) => {
        // Get token from localStorage on client-side
        if (typeof window !== 'undefined') {
          this.token = localStorage.getItem('token');
        }
        
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for handling errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        // Handle token expiration
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Set auth token
  setToken(token: string): void {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      // Set in localStorage
      localStorage.setItem('token', token);
      
      // Set in cookies with secure flags
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Strict; ${location.protocol === 'https:' ? 'Secure;' : ''}`;
    }
  }

  // Remove auth token
  removeToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      // Remove from localStorage
      localStorage.removeItem('token');
      
      // Remove from cookies
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Throw the API error response for handling by the caller
        throw error.response.data;
      }
      throw error;
    }
  }

  // Auth API methods
  async login(data: LoginFormData): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await this.request<ApiResponse<{ token: string; user: User }>>({
      method: 'POST',
      url: '/auth/login',
      data,
    });
    if (response.success && response?.token) {
      this.setToken(response?.token);
    }
    return response;
  }

  async register(data: RegisterFormData): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await this.request<ApiResponse<{ token: string; user: User }>>({
      method: 'POST',
      url: '/auth/register',
      data,
    });
    
    if (response.success && response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse<null>> {
    const response = await this.request<ApiResponse<null>>({
      method: 'GET',
      url: '/auth/logout',
    });
    
    this.removeToken();
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>({
      method: 'GET',
      url: '/auth/me',
    });
  }

  // Leads API methods
  async getLeads(page = 1, limit = 10, filters?: LeadFilters): Promise<PaginatedResponse<Lead>> {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<PaginatedResponse<Lead>>({
      method: 'GET',
      url: `/leads?${queryParams.toString()}`,
    });
  }

  async getLead(id: string): Promise<ApiResponse<Lead>> {
    return this.request<ApiResponse<Lead>>({
      method: 'GET',
      url: `/leads/${id}`,
    });
  }

  async createLead(data: LeadFormData): Promise<ApiResponse<Lead>> {
    return this.request<ApiResponse<Lead>>({
      method: 'POST',
      url: '/leads',
      data,
    });
  }

  async updateLead(id: string, data: Partial<LeadFormData>): Promise<ApiResponse<Lead>> {
    return this.request<ApiResponse<Lead>>({
      method: 'PUT',
      url: `/leads/${id}`,
      data,
    });
  }

  async deleteLead(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>({
      method: 'DELETE',
      url: `/leads/${id}`,
    });
  }

  async exportLeads(): Promise<Blob> {
    const response = await this.client({
      method: 'GET',
      url: '/leads/export',
      responseType: 'blob',
    });
    
    return response.data;
  }
}

// Create and export a singleton instance
const api = new ApiClient();
export default api;