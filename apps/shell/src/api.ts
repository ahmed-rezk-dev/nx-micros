import { useAuthStore } from './stores/auth.store';
import { useUIStore } from './stores/ui.store';

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // Base delay in ms (exponential backoff)
  retryCondition: (error: any) => {
    // Retry on network errors or 5xx status codes
    return (
      error.code === 'NETWORK_ERROR' ||
      error.name === 'TypeError' ||
      (error.status >= 500 && error.status < 600) ||
      error.status === 429 // Rate limiting
    );
  },
};

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit & RequestOptions,
    retryCount = 0,
  ): Promise<T> {
    const {
      headers,
      timeout = 10000,
      retries = RETRY_CONFIG.maxRetries,
      ...fetchOptions
    } = options;

    // Get auth token from store
    const token = useAuthStore.getState().token;

    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers,
    };

    // Add auth header if token exists
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Set loading state
      const loadingKey = `${options.method || 'GET'} ${url}`;
      useUIStore.getState().setLoading(loadingKey, true);

      const response = await fetch(`${this.baseURL}${url}`, {
        ...fetchOptions,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Unknown error' }));
        const error = new Error(
          (errorData as any).message || `HTTP ${response.status}`,
        );
        (error as any).status = response.status;
        (error as any).data = errorData;

        // Check if we should retry
        if (retryCount < retries && RETRY_CONFIG.retryCondition(error)) {
          const delay = RETRY_CONFIG.retryDelay * Math.pow(2, retryCount);
          console.warn(
            `Request failed, retrying in ${delay}ms... (${retryCount + 1}/${retries})`,
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.makeRequest<T>(url, options, retryCount + 1);
        }

        throw error;
      }

      const data = await response.json();
      return data as T;
    } catch (error: any) {
      clearTimeout(timeoutId);

      // Handle network errors with retry
      if (retryCount < retries && RETRY_CONFIG.retryCondition(error)) {
        const delay = RETRY_CONFIG.retryDelay * Math.pow(2, retryCount);
        console.warn(
          `Network error, retrying in ${delay}ms... (${retryCount + 1}/${retries})`,
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.makeRequest<T>(url, options, retryCount + 1);
      }

      // Handle auth errors
      if (error.status === 401) {
        useAuthStore.getState().logout();
      }

      throw error;
    } finally {
      // Clear loading state
      const loadingKey = `${options.method || 'GET'} ${url}`;
      useUIStore.getState().setLoading(loadingKey, false);
    }
  }

  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.makeRequest<T>(url, { method: 'GET', ...options });
  }

  async post<T>(
    url: string,
    data?: any,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.makeRequest<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put<T>(
    url: string,
    data?: any,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.makeRequest<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async patch<T>(
    url: string,
    data?: any,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.makeRequest<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.makeRequest<T>(url, { method: 'DELETE', ...options });
  }

  // Utility methods
  setAuthToken(token: string): void {
    useAuthStore.getState().refreshToken(token);
  }

  clearAuthToken(): void {
    useAuthStore.getState().logout();
  }

  isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated;
  }

  getAuthToken(): string | null {
    return useAuthStore.getState().token;
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export React Hook Form utilities
export { useForm, useController, useFormContext } from 'react-hook-form';
export { zodResolver } from '@hookform/resolvers/zod';
