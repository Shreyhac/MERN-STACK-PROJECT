// Google Analytics tracking utility
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Event categories
export const EVENT_CATEGORIES = {
  USER_ENGAGEMENT: 'user_engagement',
  NAVIGATION: 'navigation',
  FEATURE_USAGE: 'feature_usage',
  ERROR: 'error',
  CONVERSION: 'conversion',
} as const;

// Event actions
export const EVENT_ACTIONS = {
  // User engagement
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  LINK_CLICK: 'link_click',
  
  
  // Feature usage
  CAPTURE_CREATED: 'capture_created',
  CAPTURE_COPIED: 'capture_copied',
  MCP_CONFIG_COPIED: 'mcp_config_copied',
  CURSOR_SETUP_VIEWED: 'cursor_setup_viewed',
  CLAUDE_SETUP_VIEWED: 'claude_setup_viewed',
  
  // Navigation
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
  DASHBOARD_ACCESSED: 'dashboard_accessed',
  
  // Errors
  ERROR_OCCURRED: 'error_occurred',
  API_ERROR: 'api_error',
} as const;

// Event labels
export const EVENT_LABELS = {
  // Features
  UNLIMITED_CAPTURES: 'unlimited_captures',
  MCP_INTEGRATION: 'mcp_integration',
  PRIORITY_SUPPORT: 'priority_support',
  
  // Error types
  NETWORK_ERROR: 'network_error',
  VALIDATION_ERROR: 'validation_error',
} as const;

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    // GA is already initialized in root.tsx
    console.log('Google Analytics already initialized');
  }
};

// Track page views
export const trackPageView = (page_title: string, page_location?: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title,
      page_location: page_location || window.location.href,
      send_to: 'G-LMJEZZWNZ7'
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string = EVENT_CATEGORIES.USER_ENGAGEMENT,
  label?: string,
  value?: number,
  customParameters?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    const eventData: any = {
      event_category: category,
      event_label: label,
      send_to: 'G-LMJEZZWNZ7'
    };

    if (value !== undefined) {
      eventData.value = value;
    }

    if (customParameters) {
      Object.assign(eventData, customParameters);
    }

    window.gtag('event', action, eventData);
  }
};


// Feature usage tracking
export const trackCaptureCreated = (websiteUrl: string, tokenCount: number) => {
  trackEvent(
    EVENT_ACTIONS.CAPTURE_CREATED,
    EVENT_CATEGORIES.FEATURE_USAGE,
    EVENT_LABELS.UNLIMITED_CAPTURES,
    tokenCount,
    {
      website_url: websiteUrl,
      token_count: tokenCount
    }
  );
};

export const trackCaptureCopied = (captureSlug: string) => {
  trackEvent(
    EVENT_ACTIONS.CAPTURE_COPIED,
    EVENT_CATEGORIES.FEATURE_USAGE,
    'capture_copied',
    undefined,
    {
      capture_slug: captureSlug
    }
  );
};

export const trackMcpConfigCopied = (configType: 'cursor' | 'claude') => {
  trackEvent(
    EVENT_ACTIONS.MCP_CONFIG_COPIED,
    EVENT_CATEGORIES.FEATURE_USAGE,
    EVENT_LABELS.MCP_INTEGRATION,
    undefined,
    {
      config_type: configType
    }
  );
};

export const trackSetupViewed = (setupType: 'cursor' | 'claude') => {
  trackEvent(
    setupType === 'cursor' ? EVENT_ACTIONS.CURSOR_SETUP_VIEWED : EVENT_ACTIONS.CLAUDE_SETUP_VIEWED,
    EVENT_CATEGORIES.FEATURE_USAGE,
    EVENT_LABELS.MCP_INTEGRATION,
    undefined,
    {
      setup_type: setupType
    }
  );
};

// User engagement tracking
export const trackLogin = (method?: string) => {
  trackEvent(
    EVENT_ACTIONS.LOGIN,
    EVENT_CATEGORIES.USER_ENGAGEMENT,
    'user_login',
    undefined,
    {
      login_method: method || 'unknown'
    }
  );
};

export const trackLogout = () => {
  trackEvent(
    EVENT_ACTIONS.LOGOUT,
    EVENT_CATEGORIES.USER_ENGAGEMENT,
    'user_logout'
  );
};

export const trackSignup = (method?: string) => {
  trackEvent(
    EVENT_ACTIONS.SIGNUP,
    EVENT_CATEGORIES.CONVERSION,
    'user_signup',
    undefined,
    {
      signup_method: method || 'unknown'
    }
  );
};

export const trackDashboardAccessed = () => {
  trackEvent(
    EVENT_ACTIONS.DASHBOARD_ACCESSED,
    EVENT_CATEGORIES.USER_ENGAGEMENT,
    'dashboard_viewed'
  );
};

// Error tracking
export const trackError = (errorType: string, errorMessage: string, errorContext?: string) => {
  trackEvent(
    EVENT_ACTIONS.ERROR_OCCURRED,
    EVENT_CATEGORIES.ERROR,
    errorType,
    undefined,
    {
      error_message: errorMessage,
      error_context: errorContext
    }
  );
};


export const trackApiError = (endpoint: string, errorMessage: string, statusCode?: number) => {
  trackEvent(
    EVENT_ACTIONS.API_ERROR,
    EVENT_CATEGORIES.ERROR,
    'api_error',
    statusCode,
    {
      endpoint: endpoint,
      error_message: errorMessage,
      status_code: statusCode
    }
  );
};

// Utility function to track button clicks
export const trackButtonClick = (buttonName: string, buttonContext?: string) => {
  trackEvent(
    EVENT_ACTIONS.BUTTON_CLICK,
    EVENT_CATEGORIES.USER_ENGAGEMENT,
    buttonName,
    undefined,
    {
      button_context: buttonContext
    }
  );
};

// Utility function to track link clicks
export const trackLinkClick = (linkName: string, linkUrl?: string) => {
  trackEvent(
    EVENT_ACTIONS.LINK_CLICK,
    EVENT_CATEGORIES.NAVIGATION,
    linkName,
    undefined,
    {
      link_url: linkUrl
    }
  );
}; 