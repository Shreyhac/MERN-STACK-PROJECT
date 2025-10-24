import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routes = [
  index("routes/home.tsx"),
  route("cursor", "routes/cursor.tsx"),
  route("claude-code", "routes/claude-code.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("extension-download", "routes/extension-download.tsx"),
  route("terms", "routes/terms.tsx"),
  route("privacy", "routes/privacy.tsx"),
];

// Only add og-image route in development
if (import.meta.env.DEV) {
  routes.push(route("og-image", "routes/og-image.tsx"));
}

// Add catch-all route for 404 page (using wildcard route)
routes.push(route("*", "routes/404.tsx"));

export default routes satisfies RouteConfig;
