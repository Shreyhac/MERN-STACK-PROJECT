import * as Sentry from "@sentry/react";

export function initSentry() {
  Sentry.init({
    dsn: "https://acc0cacabb0da517794f56dec8c04e82@o4509780827504640.ingest.us.sentry.io/4509780840284160",
    // Only enable error tracking, disable tracing and performance monitoring
    tracesSampleRate: 0.0,
    // Disable session replay
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 0.0,
  });
}

export { Sentry }; 