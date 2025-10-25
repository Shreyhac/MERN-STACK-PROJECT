# Google Analytics Implementation

This document outlines the comprehensive Google Analytics tracking system implemented for the Web to MCP application.

## Overview

The application uses Google Analytics 4 (GA4) to track user behavior, with a focus on payment-related events and important user actions. The tracking system is built with TypeScript and provides type-safe analytics functions.

## Setup

### Google Analytics Configuration

Google Analytics is already configured in `app/root.tsx` with the tracking ID `G-LMJEZZWNZ7`. The configuration includes:

```typescript
// Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=G-LMJEZZWNZ7"></script>
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-LMJEZZWNZ7');
    `,
  }}
/>
```

## Analytics Structure

### Core Files

1. **`app/lib/analytics.ts`** - Main analytics utility with all tracking functions
2. **`app/hooks/use-analytics.ts`** - React hooks for easy analytics integration
3. **Automatic page tracking** - Integrated in `app/root.tsx`

### Event Categories

The analytics system organizes events into the following categories:

- `user_engagement` - General user interactions
- `payment` - All payment-related events
- `navigation` - Page navigation and routing
- `feature_usage` - Feature-specific interactions
- `error` - Error tracking and debugging
- `conversion` - Conversion and signup events

## Tracked Events

### Payment Events (High Priority)

#### Payment Flow Tracking
- **Payment Started** - When user initiates payment
  ```typescript
  trackPaymentStarted('monthly', 10); // or 'yearly', 60
  ```

- **Payment Success** - When payment completes successfully
  ```typescript
  trackPaymentSuccess('monthly', 10, 'txn_123');
  ```

- **Payment Failed** - When payment fails
  ```typescript
  trackPaymentFailed('monthly', 10, 'insufficient_funds');
  ```

- **Subscription Activated** - When subscription becomes active
  ```typescript
  trackSubscriptionActivated('monthly');
  ```

#### Upgrade and Billing Events
- **Upgrade Clicked** - When user clicks upgrade button
  ```typescript
  trackUpgradeClicked('monthly');
  ```

- **Billing Cycle Changed** - When user switches between monthly/yearly
  ```typescript
  trackBillingCycleChanged('monthly', 'yearly');
  ```

### User Engagement Events

#### Authentication
- **Login** - User login events
  ```typescript
  trackLogin('google_oauth');
  ```

- **Logout** - User logout events
  ```typescript
  trackLogout();
  ```

- **Signup** - New user registration
  ```typescript
  trackSignup('google_oauth');
  ```

#### Navigation
- **Page Views** - Automatic tracking via `usePageTracking()`
- **Dashboard Access** - When user accesses dashboard
  ```typescript
  trackDashboardAccessed();
  ```

### Feature Usage Events

#### Component Captures
- **Capture Created** - When user creates a new capture
  ```typescript
  trackCaptureCreated('https://example.com', 1500);
  ```

- **Capture Copied** - When user copies capture content
  ```typescript
  trackCaptureCopied('capture_slug_123');
  ```

#### MCP Integration
- **MCP Config Copied** - When user copies MCP configuration
  ```typescript
  trackMcpConfigCopied('cursor'); // or 'claude'
  ```

- **Setup Viewed** - When user views setup instructions
  ```typescript
  trackSetupViewed('cursor'); // or 'claude'
  ```

### Error Tracking

#### API Errors
- **API Error** - When API calls fail
  ```typescript
  trackApiError('/api/captures/list/', 'Network error', 500);
  ```

#### Payment Errors
- **Payment Error** - Payment-specific errors
  ```typescript
  trackPaymentError('stripe_error', 'Card declined', 'monthly');
  ```

#### General Errors
- **Error Occurred** - General application errors
  ```typescript
  trackError('validation_error', 'Invalid email format', 'signup_form');
  ```

### Utility Events

#### Button Clicks
- **Button Click** - Track any button interaction
  ```typescript
  trackButtonClick('upgrade_button', 'upgrade_monthly_plan');
  ```

#### Link Clicks
- **Link Click** - Track link navigation
  ```typescript
  trackLinkClick('try_again_link', '/upgrade');
  ```

## Implementation Examples

### In React Components

```typescript
import { 
  trackPaymentStarted, 
  trackButtonClick,
  usePageTracking 
} from '~/hooks/use-analytics';

export default function UpgradePage() {
  // Automatic page tracking
  usePageTracking();

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    // Track button click
    trackButtonClick('upgrade_button', `upgrade_${plan}_plan`);
    
    // Track payment started
    trackPaymentStarted(plan, plan === 'monthly' ? 10 : 60);
    
    // ... payment logic
  };

  return (
    <button onClick={() => handleUpgrade('monthly')}>
      Upgrade to Monthly
    </button>
  );
}
```

### Using Custom Hooks

```typescript
import { useFormTracking, useFeatureTracking } from '~/hooks/use-analytics';

export default function ContactForm() {
  const { trackFormSubmit } = useFormTracking('contact_form');
  const { trackFeatureUsage } = useFeatureTracking();

  const handleSubmit = (formData: any) => {
    trackFormSubmit(formData);
    trackFeatureUsage('contact_form_submitted', { form_type: 'support' });
    // ... form submission logic
  };
}
```

## Google Analytics Reports

### Key Metrics to Monitor

#### Payment Funnel
1. **Upgrade Page Views** → **Upgrade Clicks** → **Payment Started** → **Payment Success**
2. Conversion rates at each step
3. Payment failure reasons

#### User Engagement
1. **Page Views** by route
2. **Feature Usage** (captures, MCP config copies)
3. **Setup Completion** rates

#### Error Tracking
1. **API Error** frequency by endpoint
2. **Payment Error** types and frequencies
3. **General Error** patterns

### Custom Dimensions

The tracking system includes custom parameters for detailed analysis:

- `plan_type` - Monthly/Yearly plan selection
- `price` - Payment amount
- `currency` - Payment currency (USD)
- `transaction_id` - Stripe transaction ID
- `error_reason` - Specific error details
- `website_url` - Captured website URL
- `token_count` - Number of tokens in capture
- `config_type` - Cursor/Claude configuration
- `setup_type` - Setup page type

## Best Practices

### Event Naming
- Use consistent, descriptive event names
- Include context in event labels
- Use the predefined constants from `EVENT_ACTIONS` and `EVENT_LABELS`

### Data Privacy
- Never track personally identifiable information (PII)
- Use hashed or anonymized identifiers
- Respect user privacy preferences

### Performance
- Analytics calls are non-blocking
- Events are batched and sent asynchronously
- Minimal impact on application performance

## Troubleshooting

### Common Issues

1. **Events not appearing in GA4**
   - Check browser console for errors
   - Verify tracking ID is correct
   - Ensure gtag function is available

2. **Missing custom parameters**
   - Check parameter names match GA4 requirements
   - Verify parameter values are not undefined

3. **Page views not tracking**
   - Ensure `usePageTracking()` is called in root component
   - Check React Router is properly configured

### Debug Mode

To enable debug mode, add this to the browser console:
```javascript
gtag('config', 'G-LMJEZZWNZ7', { debug_mode: true });
```

## Future Enhancements

### Planned Features
1. **Enhanced E-commerce Tracking** - Product impressions, cart events
2. **User Journey Analysis** - Multi-step funnel tracking
3. **A/B Testing Integration** - Experiment tracking
4. **Real-time Analytics** - Live user activity monitoring

### Custom Reports
1. **Payment Performance Dashboard**
2. **Feature Adoption Metrics**
3. **Error Rate Monitoring**
4. **User Retention Analysis**

## Support

For questions about the analytics implementation:
1. Check this documentation
2. Review the TypeScript types in `analytics.ts`
3. Examine existing implementations in route files
4. Consult Google Analytics 4 documentation 