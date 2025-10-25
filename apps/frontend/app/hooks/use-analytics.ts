import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { 
  trackPageView, 
  trackEvent, 
  EVENT_CATEGORIES,
  EVENT_ACTIONS,
  EVENT_LABELS,
  trackCaptureCreated,
  trackCaptureCopied,
  trackMcpConfigCopied,
  trackSetupViewed,
  trackLogin,
  trackLogout,
  trackSignup,
  trackDashboardAccessed,
  trackError,
  trackApiError,
  trackButtonClick,
  trackLinkClick
} from '~/lib/analytics';

// Hook to automatically track page views
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Get page title from document or use pathname
    const pageTitle = document.title || location.pathname;
    trackPageView(pageTitle, window.location.href);
  }, [location]);
};

// Re-export all analytics functions for easy access
export {
  trackPageView,
  trackEvent,
  EVENT_CATEGORIES,
  EVENT_ACTIONS,
  EVENT_LABELS,
  trackCaptureCreated,
  trackCaptureCopied,
  trackMcpConfigCopied,
  trackSetupViewed,
  trackLogin,
  trackLogout,
  trackSignup,
  trackDashboardAccessed,
  trackError,
  trackApiError,
  trackButtonClick,
  trackLinkClick
};

// Hook for tracking form submissions
export const useFormTracking = (formName: string) => {
  const trackFormSubmit = (formData?: Record<string, any>) => {
    trackEvent(
      EVENT_ACTIONS.FORM_SUBMIT,
      EVENT_CATEGORIES.USER_ENGAGEMENT,
      formName,
      undefined,
      formData
    );
  };

  return { trackFormSubmit };
};

// Hook for tracking feature usage
export const useFeatureTracking = () => {
  const trackFeatureUsage = (featureName: string, additionalData?: Record<string, any>) => {
    trackEvent(
      'feature_used',
      EVENT_CATEGORIES.FEATURE_USAGE,
      featureName,
      undefined,
      additionalData
    );
  };

  return { trackFeatureUsage };
};

// Hook for tracking user engagement
export const useEngagementTracking = () => {
  const trackEngagement = (action: string, label?: string, value?: number) => {
    trackEvent(
      action,
      EVENT_CATEGORIES.USER_ENGAGEMENT,
      label,
      value
    );
  };

  return { trackEngagement };
}; 