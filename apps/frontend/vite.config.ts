import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    port: 5174,
    allowedHosts: ['0d3a7be7489d.ngrok-free.app'],
    cors: {
      origin: true, // Allow all origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allow all common methods
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allow common headers
      credentials: true, // Allow credentials
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/login/google-oauth2/': {
        target: 'http://localhost:8000',
        changeOrigin: false,
        secure: false,
      },
      '/complete/google-oauth2/': {
        target: 'http://localhost:8000',
        changeOrigin: false,
        secure: false,
      },
      '/login': {
        target: 'http://localhost:8000',
        changeOrigin: false,
        secure: false,
        rewrite: (path) => path.replace(/^\/login/, '/login/google-oauth2'),
      },
    },
  },
});
