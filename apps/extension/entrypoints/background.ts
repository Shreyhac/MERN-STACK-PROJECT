import { Sentry } from '@/lib/sentry';

export default defineBackground(() => {


  // Handle extension installation
  browser.runtime.onInstalled.addListener((details) => {
    // Extension installed
  });

  // Handle messages from content script
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'apiRequest') {
      // Handle API requests to backend
      (async () => {
        try {
          const url = `${__BACKEND_URL__}${message.endpoint}`;
          
          const options: RequestInit = {
            method: message.method,
            credentials: 'include', // Include cookies for session authentication
            headers: {
              'Content-Type': 'application/json',
            },
          };

          if (message.method === 'POST' && message.data) {
            options.body = JSON.stringify(message.data);
          }

          const response = await fetch(url, options);

          if (!response.ok) {
            if (response.status === 401) {
              sendResponse({ error: 'Authentication required' });
              return;
            }
            sendResponse({ error: `API request failed: ${response.status} ${response.statusText}` });
            return;
          }

          const data = await response.json();
          sendResponse({ data });
        } catch (error) {
          console.error('API request error:', error);
          Sentry.captureException(error);
          sendResponse({ error: 'Network error occurred' });
        }
      })();
      return true; // Keep message channel open for async response
    }
    
    if (message.action === 'captureScreenshot') {
      // Handle screenshot capture
      (async () => {
        try {
          // Get the active tab
          const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
          
          if (!tab.id) {
            sendResponse({ error: 'No active tab found' });
            return;
          }

          // Capture the visible tab
          const dataUrl = await browser.tabs.captureVisibleTab(tab.windowId, {
            format: 'png',
            quality: 20,
          });

          // Always return the full screenshot
          sendResponse({ screenshot: dataUrl });
        } catch (error) {
          console.error('Error capturing screenshot:', error);
          Sentry.captureException(error);
          sendResponse({ error: 'Failed to capture screenshot' });
        }
      })();
      return true; // Keep message channel open for async response
    }
  });
});
