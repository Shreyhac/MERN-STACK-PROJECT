import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
    define: {
      __BACKEND_URL__: JSON.stringify(process.env.BACKEND_URL || 'http://localhost:5174'),
      __ENVIRONMENT__: JSON.stringify(process.env.NODE_ENV || 'development'),
      __SENTRY_DSN__: JSON.stringify('https://c179f63e694344ac73e0853c1006b652@o4509780827504640.ingest.us.sentry.io/4509780862107648'),
    },
  }),
  manifest: {
    short_name: 'Web to MCP',
    permissions: [
      'activeTab'
    ],
    host_permissions: [
      `${process.env.BACKEND_URL || 'http://localhost:5174'}/*`
    ]
  }
});
