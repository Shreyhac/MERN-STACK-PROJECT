import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { getCsrfToken, setCsrfToken } from './utils';
import { trackLogin } from './analytics';

interface User {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture?: string;
  mcp_url?: string;
  subscription_status?: string;
  subscription_tier?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Source tracking utilities
const SOURCE_STORAGE_KEY = 'user_source';

const saveSourceToStorage = (source: string) => {
  try {
    if (typeof window !== 'undefined' && source) {
      localStorage.setItem(SOURCE_STORAGE_KEY, source);
    }
  } catch (error) {
    console.warn('Failed to save source to localStorage:', error);
  }
};

const getSourceFromStorage = (): string | null => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SOURCE_STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Failed to get source from localStorage:', error);
  }
  return null;
};

const clearSourceFromStorage = () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SOURCE_STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Failed to clear source from localStorage:', error);
  }
};

const updateUserSource = async (source: string) => {
  try {
    if (!source) return;
    
    const csrfToken = getCsrfToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
    
    await axios.patch('/api/user/source/', 
      { source }, 
      {
        withCredentials: true,
        headers,
      }
    );
    
    // Clear the source from storage after successful update
    clearSourceFromStorage();
  } catch (error) {
    // Ignore errors as per requirements
    console.warn('Failed to update user source:', error);
  }
};

const initializeSourceTracking = () => {
  try {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref');
    
    // Check if we already have a source stored
    const existingSource = getSourceFromStorage();
    
    if (refParam && refParam.trim() && !existingSource) {
      // Save ref parameter as source only if no existing source
      saveSourceToStorage(refParam.trim());
    } else if (!existingSource) {
      // If no ref param and no existing source, check referrer header
      const referrer = document.referrer;
      if (referrer && referrer.trim()) {
        try {
          const referrerUrl = new URL(referrer);
          const referrerDomain = referrerUrl.hostname;
          // Only save external referrers (not our own domain)
          if (referrerDomain !== window.location.hostname) {
            saveSourceToStorage(referrerDomain);
          }
        } catch (error) {
          console.warn('Failed to parse referrer URL:', error);
        }
      }
    }
  } catch (error) {
    console.warn('Failed to initialize source tracking:', error);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      // Only check API on the client side
      if (typeof window !== 'undefined') {
        // Get CSRF token
        const csrfToken = getCsrfToken();
        
        // Prepare headers
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        // Add CSRF token if available
        if (csrfToken) {
          headers['X-CSRFToken'] = csrfToken;
        }
        
        const response = await axios.get('/api/user/', {
          withCredentials: true, // Include cookies for authentication
          headers,
        });

        // Extract CSRF token from response headers if present
        const responseCsrfToken = response.headers['x-csrf-token'];
        if (responseCsrfToken) {
          setCsrfToken(responseCsrfToken);
        }
        
        // Axios automatically throws on 4xx/5xx status codes, so if we reach here, the request was successful
        setUser(response.data);
        
        // Update user source if we have one stored
        const storedSource = getSourceFromStorage();
        if (storedSource) {
          updateUserSource(storedSource);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // User is not authenticated
          setUser(null);
        } else {
          // Handle other errors
          console.error('Auth check failed with status:', error.response?.status);
          setUser(null);
        }
      } else {
        console.error('Auth check failed:', error);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    // Track login intent then redirect to login page for OAuth flow
    trackLogin('google_oauth');
    window.location.href = '/login';
  };

  const logout = async () => {
    try {
      // Get CSRF token
      const csrfToken = getCsrfToken();
      
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add CSRF token if available
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }
      
      // Call logout API endpoint
      await axios.post('/api/auth/logout/', {}, {
        withCredentials: true,
        headers,
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
    }
  };

  useEffect(() => {
    setIsClient(true);
    // Initialize source tracking on client side
    initializeSourceTracking();
    checkAuth();
  }, []);

  // During SSR and initial client render, show loading state
  const shouldShowLoading = isLoading || !isClient;

  const value: AuthContextType = {
    user,
    isLoading: shouldShowLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 