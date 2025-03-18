/**
 * User related types
 */
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }
  
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  /**
   * Lead related types
   */
  export interface Lead {
    _id: string;
    name: string;
    email: string;
    company: string;
    stage: StageType;
    engaged: boolean;
    lastContacted: string | null;
    initials: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export type StageType = 'I' | 'II' | 'III' | 'IIII';
  
  export interface LeadFormData {
    name: string;
    email: string;
    company: string;
    stage: StageType;
    engaged: boolean;
    lastContacted?: string | null;
  }
  
  /**
   * Filter and sort types
   */
  export interface LeadFilters {
    search?: string;
    stage?: StageType;
    engaged?: boolean;
    sort?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  /**
   * Pagination types
   */
  export interface PaginationState {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
  
  /**
   * API response types
   */
  export interface ApiResponse<T> {
    token?: string;
    success: boolean;
    user?: User;
    message?: string;
    data?: T;
  }
  
  export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
  }
  
  export interface ApiError {
    success: false;
    message?: string;
    errors?: Array<{
      type?: string;
      value?: string;
      msg: string;
      path?: string;
      location?: string;
    }>;
  }