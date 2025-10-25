import { 
  BrowserClient, 
  defaultStackParser, 
  getDefaultIntegrations, 
  makeFetchTransport, 
  Scope 
} from '@sentry/browser';

// Filter integrations that use the global variable
const integrations = getDefaultIntegrations({}).filter(
  (defaultIntegration) => {
    return !["BrowserApiErrors", "Breadcrumbs", "GlobalHandlers"].includes(
      defaultIntegration.name,
    );
  },
);

const client = new BrowserClient({
  dsn: __SENTRY_DSN__,
  transport: makeFetchTransport,
  stackParser: defaultStackParser,
  integrations: integrations,
  environment: __ENVIRONMENT__,
  release: '1.0.0', // You can update this to match your extension version
  debug: __ENVIRONMENT__ === 'development',
  
  // Configure which errors to capture
  beforeSend(event) {
    // Don't send errors in development unless explicitly enabled
    if (__ENVIRONMENT__ === 'development' && !process.env.SENTRY_DEBUG) {
      return null;
    }

    // Filter out null/undefined errors that don't provide useful information
    if (!event.exception || !event.exception.values || event.exception.values.length === 0) {
      return null;
    }

    // Check if the error is null or undefined
    const firstException = event.exception.values[0];
    if (!firstException || !firstException.value || firstException.value === 'null' || firstException.value === 'undefined') {
      return null;
    }

    // Filter out common browser extension noise
    const errorMessage = firstException.value.toLowerCase();
    if (errorMessage.includes('non-error promise rejection') || 
        errorMessage.includes('script error') ||
        errorMessage.includes('resizeobserver loop limit exceeded')) {
      return null;
    }

    return event;
  },

  // Set traces sample rate for performance monitoring
  tracesSampleRate: __ENVIRONMENT__ === 'production' ? 0.1 : 1.0,
});

const scope = new Scope();
scope.setClient(client);
client.init(); // initializing has to be done after setting the client on the scope

// Export the scope for manual error capturing
export { scope as Sentry }; 