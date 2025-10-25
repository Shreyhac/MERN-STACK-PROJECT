// API utility functions for the extension

declare const __BACKEND_URL__: string;
declare const __ENVIRONMENT__: string;

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_picture?: string;
  date_of_birth?: string;
  date_joined: string;
  last_login: string;
  mcp_url: string;
  subscription_status: string;
  capture_count: number;
  remaining_free_captures: number;
  can_create_capture: boolean;
  free_capture_limit: number;
}

export interface ApiError {
  error: string;
}

export interface CaptureRequest {
  website_url: string;
  token_count: number;
  html: string;
  png_screenshot: string;
}

export interface CaptureResponse {
  slug: string;
  website_url: string;
  token_count: number;
  created_at: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = __BACKEND_URL__;
  }

  async getCurrentUser(): Promise<User> {
    // Send request to background script
    const response = await browser.runtime.sendMessage({
      action: 'apiRequest',
      endpoint: '/api/user/',
      method: 'GET'
    });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data;
  }

  async createCapture(captureData: CaptureRequest): Promise<CaptureResponse> {
    // Send request to background script
    const response = await browser.runtime.sendMessage({
      action: 'apiRequest',
      endpoint: '/api/captures/create/',
      method: 'POST',
      data: captureData
    });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data;
  }

  getFrontendUrl(): string {
    return __ENVIRONMENT__ === 'production' 
      ? 'https://web-to-mcp.com' 
      : 'http://localhost:5174';
  }
}

export const apiClient = new ApiClient(); 