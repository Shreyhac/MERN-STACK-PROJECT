import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useLocation, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import React__default, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, ArrowRight, Menu, Chrome, Zap, MousePointer2, Cable, Eye, Code, CheckCircle, Copy, Plug, Sparkles, LogIn, Monitor, Globe, Cpu, Terminal, Download, Check, ChevronLeft, ChevronRight } from "lucide-react";
import * as Sentry from "@sentry/react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { Slot } from "@radix-ui/react-slot";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function getCsrfToken() {
  if (typeof document === "undefined") {
    return null;
  }
  const name = "csrftoken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}
function setCsrfToken(token, expires) {
  if (typeof document === "undefined") {
    return;
  }
  let cookieValue = `csrftoken=${token}`;
  cookieValue += "; path=/; SameSite=Lax";
  if (window.location.protocol === "https:") {
    cookieValue += "; Secure";
  }
  document.cookie = cookieValue;
}
const EVENT_CATEGORIES = {
  USER_ENGAGEMENT: "user_engagement",
  NAVIGATION: "navigation",
  FEATURE_USAGE: "feature_usage",
  ERROR: "error"
};
const EVENT_ACTIONS = {
  BUTTON_CLICK: "button_click",
  LINK_CLICK: "link_click",
  CAPTURE_COPIED: "capture_copied",
  MCP_CONFIG_COPIED: "mcp_config_copied",
  CURSOR_SETUP_VIEWED: "cursor_setup_viewed",
  CLAUDE_SETUP_VIEWED: "claude_setup_viewed",
  // Navigation
  LOGIN: "login",
  LOGOUT: "logout",
  DASHBOARD_ACCESSED: "dashboard_accessed",
  API_ERROR: "api_error"
};
const EVENT_LABELS = {
  MCP_INTEGRATION: "mcp_integration"
};
const trackPageView = (page_title, page_location) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_title,
      page_location: page_location || window.location.href,
      send_to: "G-LMJEZZWNZ7"
    });
  }
};
const trackEvent = (action, category = EVENT_CATEGORIES.USER_ENGAGEMENT, label, value, customParameters) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    const eventData = {
      event_category: category,
      event_label: label,
      send_to: "G-LMJEZZWNZ7"
    };
    if (customParameters) {
      Object.assign(eventData, customParameters);
    }
    window.gtag("event", action, eventData);
  }
};
const trackCaptureCopied = (captureSlug) => {
  trackEvent(
    EVENT_ACTIONS.CAPTURE_COPIED,
    EVENT_CATEGORIES.FEATURE_USAGE,
    "capture_copied",
    void 0,
    {
      capture_slug: captureSlug
    }
  );
};
const trackMcpConfigCopied = (configType) => {
  trackEvent(
    EVENT_ACTIONS.MCP_CONFIG_COPIED,
    EVENT_CATEGORIES.FEATURE_USAGE,
    EVENT_LABELS.MCP_INTEGRATION,
    void 0,
    {
      config_type: configType
    }
  );
};
const trackSetupViewed = (setupType) => {
  trackEvent(
    setupType === "cursor" ? EVENT_ACTIONS.CURSOR_SETUP_VIEWED : EVENT_ACTIONS.CLAUDE_SETUP_VIEWED,
    EVENT_CATEGORIES.FEATURE_USAGE,
    EVENT_LABELS.MCP_INTEGRATION,
    void 0,
    {
      setup_type: setupType
    }
  );
};
const trackLogin = (method) => {
  trackEvent(
    EVENT_ACTIONS.LOGIN,
    EVENT_CATEGORIES.USER_ENGAGEMENT,
    "user_login",
    void 0,
    {
      login_method: method
    }
  );
};
const trackLogout = () => {
  trackEvent(
    EVENT_ACTIONS.LOGOUT,
    EVENT_CATEGORIES.USER_ENGAGEMENT,
    "user_logout"
  );
};
const trackDashboardAccessed = () => {
  trackEvent(
    EVENT_ACTIONS.DASHBOARD_ACCESSED,
    EVENT_CATEGORIES.USER_ENGAGEMENT,
    "dashboard_viewed"
  );
};
const trackApiError = (endpoint, errorMessage, statusCode) => {
  trackEvent(
    EVENT_ACTIONS.API_ERROR,
    EVENT_CATEGORIES.ERROR,
    "api_error",
    statusCode,
    {
      endpoint,
      error_message: errorMessage,
      status_code: statusCode
    }
  );
};
const trackButtonClick = (buttonName, buttonContext) => {
  trackEvent(
    EVENT_ACTIONS.BUTTON_CLICK,
    EVENT_CATEGORIES.USER_ENGAGEMENT,
    buttonName,
    void 0,
    {
      button_context: buttonContext
    }
  );
};
const trackLinkClick = (linkName, linkUrl) => {
  trackEvent(
    EVENT_ACTIONS.LINK_CLICK,
    EVENT_CATEGORIES.NAVIGATION,
    linkName,
    void 0,
    {
      link_url: linkUrl
    }
  );
};
const AuthContext = createContext(void 0);
const SOURCE_STORAGE_KEY = "user_source";
const saveSourceToStorage = (source) => {
  try {
    if (typeof window !== "undefined" && source) {
      localStorage.setItem(SOURCE_STORAGE_KEY, source);
    }
  } catch (error) {
    console.warn("Failed to save source to localStorage:", error);
  }
};
const getSourceFromStorage = () => {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem(SOURCE_STORAGE_KEY);
    }
  } catch (error) {
    console.warn("Failed to get source from localStorage:", error);
  }
  return null;
};
const clearSourceFromStorage = () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SOURCE_STORAGE_KEY);
    }
  } catch (error) {
    console.warn("Failed to clear source from localStorage:", error);
  }
};
const updateUserSource = async (source) => {
  try {
    if (!source) return;
    const csrfToken = getCsrfToken();
    const headers = {
      "Content-Type": "application/json"
    };
    if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
    }
    await axios.patch(
      "/api/user/source/",
      { source },
      {
        withCredentials: true,
        headers
      }
    );
    clearSourceFromStorage();
  } catch (error) {
    console.warn("Failed to update user source:", error);
  }
};
const initializeSourceTracking = () => {
  try {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get("ref");
    const existingSource = getSourceFromStorage();
    if (refParam && refParam.trim() && !existingSource) {
      saveSourceToStorage(refParam.trim());
    } else if (!existingSource) {
      const referrer = document.referrer;
      if (referrer && referrer.trim()) {
        try {
          const referrerUrl = new URL(referrer);
          const referrerDomain = referrerUrl.hostname;
          if (referrerDomain !== window.location.hostname) {
            saveSourceToStorage(referrerDomain);
          }
        } catch (error) {
          console.warn("Failed to parse referrer URL:", error);
        }
      }
    }
  } catch (error) {
    console.warn("Failed to initialize source tracking:", error);
  }
};
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      if (typeof window !== "undefined") {
        const csrfToken = getCsrfToken();
        const headers = {
          "Content-Type": "application/json"
        };
        if (csrfToken) {
          headers["X-CSRFToken"] = csrfToken;
        }
        const response = await axios.get("/api/user/", {
          withCredentials: true,
          // Include cookies for authentication
          headers
        });
        const responseCsrfToken = response.headers["x-csrf-token"];
        if (responseCsrfToken) {
          setCsrfToken(responseCsrfToken);
        }
        setUser(response.data);
        const storedSource = getSourceFromStorage();
        if (storedSource) {
          updateUserSource(storedSource);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setUser(null);
        } else {
          console.error("Auth check failed with status:", error.response?.status);
          setUser(null);
        }
      } else {
        console.error("Auth check failed:", error);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const login = () => {
    trackLogin("google_oauth");
    window.location.href = "/login";
  };
  const logout = async () => {
    try {
      const csrfToken = getCsrfToken();
      const headers = {
        "Content-Type": "application/json"
      };
      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
      }
      await axios.post("/api/auth/logout/", {}, {
        withCredentials: true,
        headers
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setUser(null);
    }
  };
  useEffect(() => {
    setIsClient(true);
    initializeSourceTracking();
    checkAuth();
  }, []);
  const shouldShowLoading = isLoading || !isClient;
  const value = {
    user,
    isLoading: shouldShowLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-green-500/30 bg-black/90 backdrop-blur-sm text-green-400",
        destructive: "destructive border-red-500/30 bg-black/90 backdrop-blur-sm text-red-400",
        success: "border-green-500/30 bg-black/90 backdrop-blur-sm text-green-400",
        warning: "border-yellow-500/30 bg-black/90 backdrop-blur-sm text-yellow-400"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Root,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-green-500/30 bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-green-500/10 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-red-500/30 group-[.destructive]:hover:border-red-500/50 group-[.destructive]:hover:bg-red-500/10 group-[.destructive]:hover:text-red-400 group-[.destructive]:focus:ring-red-500/50",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-green-400/60 opacity-0 transition-opacity hover:text-green-400 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-400/60 group-[.destructive]:hover:text-red-400 group-[.destructive]:focus:ring-red-500/50",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold font-mono", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Description,
  {
    ref,
    className: cn("text-sm opacity-90 font-mono", className),
    ...props
  }
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
function Toaster() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const usePageTracking = () => {
  const location = useLocation();
  useEffect(() => {
    const pageTitle = document.title || location.pathname;
    trackPageView(pageTitle, window.location.href);
  }, [location]);
};
function initSentry() {
  Sentry.init({
    dsn: "https://acc0cacabb0da517794f56dec8c04e82@o4509780827504640.ingest.us.sentry.io/4509780840284160",
    // Only enable error tracking, disable tracing and performance monitoring
    tracesSampleRate: 0,
    // Disable session replay
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0
  });
}
initSentry();
const links = () => [
  // Favicon links
  {
    rel: "icon",
    type: "image/x-icon",
    href: "/favicon.ico"
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png"
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png"
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png"
  },
  {
    rel: "manifest",
    href: "/manifest.json"
  },
  {
    rel: "mask-icon",
    href: "/safari-pinned-tab.svg",
    color: "#000000"
  },
  // Font preconnect
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com"
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
const meta$7 = () => [
  // Default Open Graph meta tags
  {
    property: "og:image",
    content: "/og.png"
  },
  {
    property: "og:image:width",
    content: "1200"
  },
  {
    property: "og:image:height",
    content: "630"
  },
  {
    property: "og:image:type",
    content: "image/png"
  },
  {
    property: "og:type",
    content: "website"
  },
  {
    property: "og:site_name",
    content: "Web to MCP"
  },
  {
    property: "twitter:card",
    content: "summary_large_image"
  },
  {
    property: "twitter:image",
    content: "/og.png"
  }
];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {}), /* @__PURE__ */ jsx("script", {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-LMJEZZWNZ7"
      }), /* @__PURE__ */ jsx("script", {
        dangerouslySetInnerHTML: {
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LMJEZZWNZ7');
            `
        }
      })]
    }), /* @__PURE__ */ jsxs("body", {
      suppressHydrationWarning: true,
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  usePageTracking();
  return /* @__PURE__ */ jsx(Sentry.ErrorBoundary, {
    fallback: /* @__PURE__ */ jsx(ErrorFallback, {}),
    children: /* @__PURE__ */ jsxs(AuthProvider, {
      children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Toaster, {})]
    })
  });
});
function ErrorFallback({
  error
}) {
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: "Something went wrong"
    }), /* @__PURE__ */ jsx("p", {
      children: "An error occurred and has been reported to our team."
    }), false]
  });
}
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links,
  meta: meta$7
}, Symbol.toStringTag, { value: "Module" }));
const Container = ({ className = "", children }) => /* @__PURE__ */ jsx("div", { className: `mx-auto w-full max-w-6xl px-4 md:px-6 ${className}`, children });
const Glow = ({ className = "" }) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: `pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`,
    children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "absolute left-1/2 top-[-10%] h-[80rem] w-[80rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.8),rgba(0,0,0,0)_70%)] blur-3xl",
            animate: {
              scale: [1, 1.05, 1],
              opacity: [0.8, 0.9, 0.8]
            },
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "absolute left-[20%] top-[30%] h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(39,39,42,0.6),rgba(0,0,0,0)_60%)] blur-3xl",
            animate: {
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.7, 0.6]
            },
            transition: {
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "absolute right-[15%] top-[15%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(63,63,70,0.5),rgba(0,0,0,0)_65%)] blur-3xl",
            animate: {
              scale: [1, 1.08, 1],
              opacity: [0.5, 0.6, 0.5]
            },
            transition: {
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "absolute left-1/2 top-[60%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),rgba(0,0,0,0)_80%)] blur-3xl",
            animate: {
              scale: [1, 1.2, 1],
              opacity: [0.08, 0.12, 0.08]
            },
            transition: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "absolute left-[25%] top-[20%] h-[60rem] w-[2px] bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent",
            animate: {
              opacity: [0, 0.8, 0],
              scaleY: [0, 1, 0],
              filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
            },
            transition: {
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: 8,
              ease: "easeInOut"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "absolute right-[30%] top-[35%] h-[40rem] w-[1px] bg-gradient-to-b from-transparent via-sky-400/15 to-transparent",
            animate: {
              opacity: [0, 0.6, 0],
              scaleY: [0, 1, 0],
              filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
            },
            transition: {
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 12,
              ease: "easeInOut",
              delay: 3
            }
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "absolute left-[60%] top-[25%] h-[35rem] w-[1px] bg-gradient-to-b from-transparent via-emerald-300/10 to-transparent",
            animate: {
              opacity: [0, 0.5, 0],
              scaleY: [0, 1, 0],
              filter: ["blur(0px)", "blur(1.5px)", "blur(0px)"]
            },
            transition: {
              duration: 0.25,
              repeat: Infinity,
              repeatDelay: 15,
              ease: "easeInOut",
              delay: 6
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsx(FloatingParticles, {})
    ]
  }
);
const FloatingParticles = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 2,
      delay: Math.random() * 3
    }));
    setParticles(newParticles);
  }, []);
  if (particles.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "absolute inset-0", children: particles.map((particle, i) => /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "absolute h-1 w-1 rounded-full bg-emerald-400/20",
      style: {
        left: `${particle.left}%`,
        top: `${particle.top}%`
      },
      animate: {
        y: [0, -20, 0],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.5, 1]
      },
      transition: {
        duration: particle.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: particle.delay
      }
    },
    i
  )) });
};
const FadeIn = ({ delay = 0, children, className = "" }) => /* @__PURE__ */ jsx(
  motion.div,
  {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
    viewport: { once: true, amount: 0.3 },
    className,
    children
  }
);
const Tag = ({ children }) => /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200 border border-zinc-700/70", children });
const GradientText = ({ children, className = "" }) => /* @__PURE__ */ jsx("span", { className: `bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent ${className}`, children });
const Button$1 = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background cursor-pointer";
  const variants = {
    default: "bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold",
    outline: "border border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
    ghost: "text-zinc-200 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8"
  };
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  return /* @__PURE__ */ jsx("button", { className: classes, ...props, children });
};
const Card$1 = ({ children, className = "" }) => /* @__PURE__ */ jsx("div", { className: `rounded-lg border border-zinc-800 bg-zinc-900/40 ${className}`, children });
const CardHeader$1 = ({ children, className = "" }) => /* @__PURE__ */ jsx("div", { className: `flex flex-col space-y-1.5 p-6 ${className}`, children });
const CardTitle$1 = ({ children, className = "" }) => /* @__PURE__ */ jsx("h3", { className: `text-2xl font-semibold leading-none tracking-tight ${className}`, children });
const CardDescription$1 = ({ children, className = "" }) => /* @__PURE__ */ jsx("p", { className: `text-sm text-zinc-400 ${className}`, children });
const CardContent$1 = ({ children, className = "" }) => /* @__PURE__ */ jsx("div", { className: `p-6 pt-0 ${className}`, children });
const Accordion = ({ children, type = "single", collapsible = false, className = "" }) => {
  const [openItem, setOpenItem] = React__default.useState(null);
  const handleToggle = (value) => {
    if (openItem === value) {
      setOpenItem(null);
    } else {
      setOpenItem(value);
    }
  };
  return /* @__PURE__ */ jsx("div", { className, children: React__default.Children.map(children, (child) => {
    if (React__default.isValidElement(child) && child.props && typeof child.props === "object" && "value" in child.props) {
      return React__default.cloneElement(child, {
        isOpen: openItem === child.props.value,
        onToggle: () => handleToggle(child.props.value)
      });
    }
    return child;
  }) });
};
const AccordionItem = ({ children, value, className = "", isOpen = false, onToggle }) => /* @__PURE__ */ jsx("div", { className: `border-b border-zinc-800/60 last:border-b-0 ${className}`, children: React__default.Children.map(children, (child) => {
  if (React__default.isValidElement(child)) {
    return React__default.cloneElement(child, { isOpen, onToggle });
  }
  return child;
}) });
const AccordionTrigger = ({ children, className = "", isOpen = false, onToggle, ...props }) => /* @__PURE__ */ jsxs(
  "button",
  {
    className: `flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline cursor-pointer ${className}`,
    onClick: onToggle,
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(
        "svg",
        {
          className: `h-5 w-5 shrink-0 transition-transform duration-200 text-zinc-400 ${isOpen ? "rotate-90" : ""}`,
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: /* @__PURE__ */ jsx("polyline", { points: "9,6 15,12 9,18" })
        }
      )
    ]
  }
);
const AccordionContent = ({ children, className = "", isOpen = false }) => /* @__PURE__ */ jsx("div", { className: `overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96" : "max-h-0"} ${className}`, children: /* @__PURE__ */ jsx("div", { className: "pb-6 pt-0 text-zinc-300 leading-relaxed text-sm", children }) });
const CursorLogo = (props) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 40 40", "aria-hidden": true, className: `h-6 w-6 ${props.className || ""}`, children: [
  /* @__PURE__ */ jsx("rect", { width: "40", height: "40", rx: "8", fill: "#1e1e1e" }),
  /* @__PURE__ */ jsx("path", { d: "M11 11l18 7-7 2-2 7-9-16z", fill: "#0ea5e9" })
] });
const ClaudeLogo = (props) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 40 40", "aria-hidden": true, className: `h-6 w-6 ${props.className || ""}`, children: [
  /* @__PURE__ */ jsx("rect", { width: "40", height: "40", rx: "8", fill: "#f59e0b" }),
  /* @__PURE__ */ jsx("path", { d: "M20 8c6.6 0 12 5.4 12 12s-5.4 12-12 12S8 26.6 8 20 13.4 8 20 8zm0 3c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 3c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z", fill: "white" })
] });
const GoogleLogo = (props) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", "aria-hidden": true, className: `h-5 w-5 ${props.className || ""}`, children: [
  /* @__PURE__ */ jsx("path", { fill: "#EA4335", d: "M12 10.2v3.6h5.1c-.2 1.2-1.5 3.4-5.1 3.4-3.1 0-5.6-2.6-5.6-5.8s2.5-5.8 5.6-5.8c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3 14.6 2 12 2 6.9 2 2.7 6.2 2.7 11.4S6.9 20.8 12 20.8c6.3 0 8.7-4.4 8.7-6.6 0-.5 0-.8-.1-1.2H12z" }),
  /* @__PURE__ */ jsx("path", { fill: "#34A853", d: "M3.6 7.4l3 2.2c.8-2.3 3-4 5.4-4 1.8 0 3 .7 3.7 1.4l2.5-2.4C16.7 3 14.6 2 12 2 8 2 4.7 4.3 3.6 7.4z" }),
  /* @__PURE__ */ jsx("path", { fill: "#FBBC05", d: "M12 22c2.6 0 4.7-.9 6.2-2.5l-2.9-2.3c-.8.6-1.9 1-3.3 1-2.5 0-4.6-1.7-5.3-4.1l-3 .2C4.9 19.7 8.1 22 12 22z" }),
  /* @__PURE__ */ jsx("path", { fill: "#4285F4", d: "M20.7 14.2c.2-.7.3-1.4.3-2.2 0-.8-.1-1.5-.3-2.2H12v4.4h8.7z" })
] });
const GoogleAuthIcon = () => /* @__PURE__ */ jsxs("div", { className: "relative w-10 h-10", children: [
  /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "absolute inset-0 rounded-lg bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm",
      animate: {
        scale: [1, 1.05, 1],
        borderColor: ["rgb(63 63 70 / 0.5)", "rgb(16 185 129 / 0.3)", "rgb(63 63 70 / 0.5)"]
      },
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  ),
  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
    motion.svg,
    {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      animate: { rotate: [0, 5, -5, 0] },
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M15 12H9M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z",
            stroke: "rgb(16 185 129)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          motion.path,
          {
            d: "M9 12L11 14L15 10",
            stroke: "rgb(16 185 129)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            initial: { pathLength: 0 },
            animate: { pathLength: [0, 1, 0] },
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
          }
        )
      ]
    }
  ) })
] });
const ChromeExtensionIcon = () => /* @__PURE__ */ jsxs("div", { className: "relative w-10 h-10", children: [
  /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "absolute inset-0 rounded-lg bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm",
      animate: {
        scale: [1, 1.05, 1],
        borderColor: ["rgb(63 63 70 / 0.5)", "rgb(16 185 129 / 0.3)", "rgb(63 63 70 / 0.5)"]
      },
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
    }
  ),
  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
    motion.svg,
    {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      animate: { y: [0, -2, 0] },
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z",
            stroke: "rgb(161 161 170)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          motion.path,
          {
            d: "M7 10L12 12L17 10",
            stroke: "rgb(16 185 129)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            animate: { pathLength: [0, 1, 0] },
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
          }
        ),
        /* @__PURE__ */ jsx(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "2",
            fill: "rgb(16 185 129)"
          }
        )
      ]
    }
  ) })
] });
const WebsiteNavigationIcon = () => /* @__PURE__ */ jsxs("div", { className: "relative w-10 h-10", children: [
  /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "absolute inset-0 rounded-lg bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm",
      animate: {
        scale: [1, 1.05, 1],
        borderColor: ["rgb(63 63 70 / 0.5)", "rgb(16 185 129 / 0.3)", "rgb(63 63 70 / 0.5)"]
      },
      transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
    }
  ),
  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
    motion.svg,
    {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      animate: { scale: [1, 1.05, 1] },
      transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z",
            stroke: "rgb(161 161 170)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M8 3H5C3.89543 3 3 3.89543 3 5V8",
            stroke: "rgb(161 161 170)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          motion.path,
          {
            d: "M3 12C3 12 5 10 8 10C11 10 13 12 16 12C19 12 21 10 21 10",
            stroke: "rgb(16 185 129)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            animate: { pathLength: [0, 1, 0] },
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
          }
        ),
        /* @__PURE__ */ jsx(
          motion.circle,
          {
            cx: "12",
            cy: "12",
            r: "3",
            stroke: "rgb(16 185 129)",
            strokeWidth: "2",
            fill: "none",
            animate: { r: [2, 4, 2] },
            transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }
        )
      ]
    }
  ) })
] });
const ExtensionClickIcon = () => /* @__PURE__ */ jsxs("div", { className: "relative w-10 h-10", children: [
  /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "absolute inset-0 rounded-lg bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm",
      animate: {
        scale: [1, 1.05, 1],
        borderColor: ["rgb(63 63 70 / 0.5)", "rgb(16 185 129 / 0.3)", "rgb(63 63 70 / 0.5)"]
      },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  ),
  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
    motion.svg,
    {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      animate: { scale: [1, 1.1, 1] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z",
            stroke: "rgb(161 161 170)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          motion.path,
          {
            d: "M13 13L17 17",
            stroke: "rgb(16 185 129)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            animate: {
              pathLength: [0, 1, 0],
              opacity: [0, 1, 0]
            },
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }
          }
        ),
        /* @__PURE__ */ jsx(
          motion.circle,
          {
            cx: "17",
            cy: "17",
            r: "2",
            stroke: "rgb(16 185 129)",
            strokeWidth: "2",
            fill: "none",
            animate: {
              scale: [0, 1.2, 0],
              opacity: [0, 0.8, 0]
            },
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
          }
        )
      ]
    }
  ) })
] });
const ComponentSelectionIcon = () => /* @__PURE__ */ jsxs("div", { className: "relative w-10 h-10", children: [
  /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "absolute inset-0 rounded-lg bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm",
      animate: {
        scale: [1, 1.05, 1],
        borderColor: ["rgb(63 63 70 / 0.5)", "rgb(16 185 129 / 0.3)", "rgb(63 63 70 / 0.5)"]
      },
      transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
    }
  ),
  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
    motion.svg,
    {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      animate: { rotate: [0, 2, -2, 0] },
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9 11L12 14L22 4",
            stroke: "rgb(16 185 129)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          motion.path,
          {
            d: "M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3.89543 5 3 4.10457 3 3H11",
            stroke: "rgb(161 161 170)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            animate: { pathLength: [0, 1, 1, 0] },
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
          }
        ),
        /* @__PURE__ */ jsx(
          motion.rect,
          {
            x: "7",
            y: "9",
            width: "10",
            height: "6",
            rx: "1",
            stroke: "rgb(16 185 129)",
            strokeWidth: "1.5",
            fill: "none",
            animate: {
              scale: [0.8, 1.1, 0.8],
              opacity: [0.3, 0.8, 0.3]
            },
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
          }
        )
      ]
    }
  ) })
] });
const SendToAIIcon = () => /* @__PURE__ */ jsxs("div", { className: "relative w-10 h-10", children: [
  /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "absolute inset-0 rounded-lg bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm",
      animate: {
        scale: [1, 1.05, 1],
        borderColor: ["rgb(63 63 70 / 0.5)", "rgb(16 185 129 / 0.3)", "rgb(63 63 70 / 0.5)"]
      },
      transition: { duration: 2.3, repeat: Infinity, ease: "easeInOut" }
    }
  ),
  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
    motion.svg,
    {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      animate: { x: [0, 3, 0] },
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M22 2L11 13",
            stroke: "rgb(161 161 170)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx(
          motion.path,
          {
            d: "M22 2L15 22L11 13L2 9L22 2Z",
            stroke: "rgb(16 185 129)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            animate: { pathLength: [0, 1, 0] },
            transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }
          }
        ),
        /* @__PURE__ */ jsx(
          motion.circle,
          {
            cx: "16",
            cy: "8",
            r: "2",
            fill: "rgb(16 185 129)",
            animate: {
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            },
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
          }
        ),
        /* @__PURE__ */ jsx(
          motion.path,
          {
            d: "M18 10L20 12",
            stroke: "rgb(16 185 129)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            animate: {
              pathLength: [0, 1],
              opacity: [0, 1]
            },
            transition: { duration: 1, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
          }
        )
      ]
    }
  ) })
] });
const Step = ({ index, title, children, iconType }) => {
  const getIcon = () => {
    switch (iconType) {
      case "google-auth":
        return /* @__PURE__ */ jsx(GoogleAuthIcon, {});
      case "chrome-extension":
        return /* @__PURE__ */ jsx(ChromeExtensionIcon, {});
      case "website-nav":
        return /* @__PURE__ */ jsx(WebsiteNavigationIcon, {});
      case "extension-click":
        return /* @__PURE__ */ jsx(ExtensionClickIcon, {});
      case "component-select":
        return /* @__PURE__ */ jsx(ComponentSelectionIcon, {});
      case "send-to-ai":
        return /* @__PURE__ */ jsx(SendToAIIcon, {});
      default:
        return /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 font-medium", children: index });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900/70 transition", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-3", children: [
      getIcon(),
      /* @__PURE__ */ jsx("h4", { className: "text-zinc-100 font-medium", children: title })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-zinc-400 text-sm leading-6", children })
  ] });
};
const Header = () => {
  const { login } = useAuth();
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [userSelectedSection, setUserSelectedSection] = useState(null);
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path === "/cursor") {
        setActiveSection("cursor");
      } else if (path === "/claude-code") {
        setActiveSection("claude-code");
      } else if (path === "/") {
        const hash = window.location.hash.replace("#", "");
        if (hash && ["how"].includes(hash)) {
          setActiveSection(hash);
        } else {
          setActiveSection("");
        }
      }
    }
    const handlePopState = () => {
      setUserSelectedSection(null);
      setTimeout(() => {
        setCurrentPath(window.location.pathname);
      }, 100);
    };
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => {
          setCurrentPath(window.location.pathname);
        }, 50);
      }
    };
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  useEffect(() => {
    const updateActiveSection = () => {
      if (userSelectedSection && isNavigating) {
        return;
      }
      if (currentPath === "/cursor") {
        setActiveSection("cursor");
        setUserSelectedSection(null);
        setIsNavigating(false);
      } else if (currentPath === "/claude-code") {
        setActiveSection("claude-code");
        setUserSelectedSection(null);
        setIsNavigating(false);
      } else if (currentPath === "/") {
        const hash = window.location.hash.replace("#", "");
        if (hash && ["how"].includes(hash)) {
          setActiveSection(hash);
        } else {
          setActiveSection("");
        }
        setUserSelectedSection(null);
        setIsNavigating(false);
      }
    };
    updateActiveSection();
  }, [currentPath, userSelectedSection, isNavigating]);
  useEffect(() => {
    if (userSelectedSection && isNavigating) {
      const timeout = setTimeout(() => {
        setUserSelectedSection(null);
        setIsNavigating(false);
      }, 3e3);
      return () => clearTimeout(timeout);
    }
  }, [userSelectedSection, isNavigating]);
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setIsNavigating(true);
      setActiveSection(sectionId);
      const headerHeight = 64;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
      setIsMobileMenuOpen(false);
      setTimeout(() => {
        setIsNavigating(false);
      }, 1e3);
    }
  };
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      if (currentPath !== "/" || isNavigating || userSelectedSection) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (currentPath !== "/" || isNavigating || userSelectedSection) return;
        const sections = ["how"];
        const headerHeight = 64;
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = document.getElementById(sections[i]);
          if (section && window.scrollY >= section.offsetTop - headerHeight - 100) {
            if (currentPath === "/" && !userSelectedSection) {
              setActiveSection(sections[i]);
            }
            break;
          }
        }
      }, 100);
    };
    if (currentPath === "/") {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isNavigating, currentPath, userSelectedSection]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target || !(target instanceof Element)) {
        setIsMobileMenuOpen(false);
        return;
      }
      if (!target.closest(".mobile-menu") && !target.closest(".mobile-menu-toggle")) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const navigationItems = [
    { id: "cursor", label: "Cursor", href: "/cursor" },
    { id: "claude-code", label: "Claude Code", href: "/claude-code" },
    { id: "how", label: "How it works", href: null }
  ];
  const handleNavigation = (item) => {
    setUserSelectedSection(item.id);
    setActiveSection(item.id);
    setIsNavigating(true);
    setIsMobileMenuOpen(false);
    if (item.href) {
      setCurrentPath(item.href);
      window.location.href = item.href;
    } else {
      setUserSelectedSection(null);
      scrollToSection(item.id);
    }
  };
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-40 border-b border-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 relative overflow-visible", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute left-1/4 top-1/2 h-16 w-32 rounded-full bg-zinc-800/5 blur-lg",
        animate: {
          x: [0, 10, 0],
          opacity: [0.05, 0.08, 0.05]
        },
        transition: {
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    ) }),
    /* @__PURE__ */ jsxs(Container, { className: "flex h-16 items-center justify-between relative z-10", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 sm:gap-3 flex-shrink-0", children: /* @__PURE__ */ jsxs("a", { href: "/", className: "relative flex items-center gap-1.5 sm:gap-2 group", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/favicon.ico",
            alt: "WebToMCP Logo",
            className: "w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 transition-transform group-hover:scale-105"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-base sm:text-lg md:text-xl leading-none whitespace-nowrap", children: /* @__PURE__ */ jsx(GradientText, { children: "WebToMCP" }) })
      ] }) }),
      /* @__PURE__ */ jsx("nav", { className: "hidden lg:flex items-center gap-6 text-sm text-zinc-300", children: navigationItems.map((item) => /* @__PURE__ */ jsxs(
        "a",
        {
          href: item.href || `#${item.id}`,
          onClick: (e) => {
            e.preventDefault();
            handleNavigation(item);
          },
          className: `transition-all duration-300 ease-out cursor-pointer relative ${activeSection === item.id && activeSection !== "" ? "text-emerald-400 font-medium" : "hover:text-zinc-50"}`,
          children: [
            item.label,
            activeSection === item.id && activeSection !== "" && /* @__PURE__ */ jsx(
              motion.div,
              {
                className: "absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-400 rounded-full",
                layoutId: "activeSection",
                transition: { duration: 0.3, ease: "easeOut" }
              }
            )
          ]
        },
        item.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-2 flex-shrink-0", children: [
        /* @__PURE__ */ jsx(
          Button$1,
          {
            variant: "outline",
            className: "h-10 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
            onClick: () => login(),
            children: "Log in"
          }
        ),
        /* @__PURE__ */ jsxs(
          Button$1,
          {
            className: "bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold",
            onClick: () => window.open("https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi", "_blank"),
            children: [
              "Add to Chrome ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex md:hidden items-center gap-2 flex-shrink-0", children: [
        /* @__PURE__ */ jsx(
          Button$1,
          {
            variant: "outline",
            className: "h-9 px-3 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 text-sm",
            onClick: () => login(),
            children: "Log in"
          }
        ),
        /* @__PURE__ */ jsxs(
          Button$1,
          {
            className: "h-9 px-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold text-sm",
            onClick: () => window.open("https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi", "_blank"),
            children: [
              "Install ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-1.5 h-3.5 w-3.5" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:hidden", children: [
        /* @__PURE__ */ jsx(
          Button$1,
          {
            variant: "outline",
            className: "h-8 px-2.5 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 text-xs",
            onClick: () => login(),
            children: "Log in"
          }
        ),
        isClient && /* @__PURE__ */ jsx(
          "button",
          {
            className: "mobile-menu-toggle p-1.5 text-zinc-300 hover:text-zinc-50 transition-colors cursor-pointer",
            onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
            "aria-label": "Toggle mobile menu",
            children: isMobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
          }
        )
      ] }),
      isClient && /* @__PURE__ */ jsx(
        "button",
        {
          className: "mobile-menu-toggle hidden lg:hidden md:block p-2 text-zinc-300 hover:text-zinc-50 transition-colors cursor-pointer",
          onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
          "aria-label": "Toggle mobile menu",
          children: isMobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
        }
      )
    ] }),
    isClient && isMobileMenuOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "mobile-menu lg:hidden fixed w-full h-[calc(100vh-64px)] top-16 bg-zinc-950 backdrop-blur-sm z-30",
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.2 },
        children: /* @__PURE__ */ jsxs(Container, { className: "py-4 sm:py-6 h-full flex flex-col max-w-sm mx-auto", children: [
          /* @__PURE__ */ jsx("nav", { className: "flex flex-col space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1", children: navigationItems.map((item, index) => /* @__PURE__ */ jsxs(
            motion.a,
            {
              href: item.href || `#${item.id}`,
              onClick: (e) => {
                e.preventDefault();
                handleNavigation(item);
              },
              className: `text-left text-lg sm:text-xl py-3 sm:py-4 border-b border-zinc-800/50 transition-all duration-300 ease-out cursor-pointer relative ${activeSection === item.id && activeSection !== "" ? "text-emerald-400 font-medium border-emerald-400/30" : "text-zinc-300 hover:text-zinc-50 hover:border-zinc-600"}`,
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: index * 0.05 },
              children: [
                item.label,
                activeSection === item.id && activeSection !== "" && /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    className: "absolute -bottom-px left-0 right-0 h-0.5 bg-emerald-400 rounded-full",
                    layoutId: "activeSectionMobile",
                    transition: { duration: 0.3, ease: "easeOut" }
                  }
                )
              ]
            },
            item.id
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-3 sm:space-y-4 pb-safe", children: [
            /* @__PURE__ */ jsx(
              Button$1,
              {
                variant: "outline",
                className: "w-full h-12 sm:h-14 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 text-base sm:text-lg font-medium",
                onClick: () => {
                  login();
                  setIsMobileMenuOpen(false);
                },
                children: "Log in"
              }
            ),
            /* @__PURE__ */ jsxs(
              Button$1,
              {
                className: "w-full h-12 sm:h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold text-base sm:text-lg",
                onClick: () => {
                  window.open("https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi", "_blank");
                  setIsMobileMenuOpen(false);
                },
                children: [
                  "Add to Chrome ",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4 sm:h-5 sm:w-5" })
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
};
const YouTubeModal = ({ isOpen, onClose, videoId }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm",
      onClick: handleBackdropClick,
      children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.9, y: 20 },
          transition: { type: "spring", damping: 25, stiffness: 300 },
          className: "relative w-full max-w-4xl mx-4",
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                className: "absolute -top-12 right-0 z-10 p-2 text-white hover:text-gray-300 transition-colors",
                "aria-label": "Close modal",
                children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6" })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl", children: /* @__PURE__ */ jsx(
              "iframe",
              {
                src: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
                title: "70s Demo Video",
                className: "w-full h-full",
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true
              }
            ) })
          ]
        }
      )
    }
  ) });
};
const PreviewCard$2 = ({ label, icon, children }) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 shadow-lg", children: [
  /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2 text-xs text-zinc-400", children: [
    icon,
    " ",
    /* @__PURE__ */ jsx("span", { children: label })
  ] }),
  children
] });
const Hero = ({ y1, y2 }) => {
  const [phase, setPhase] = useState("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSelecting = phase === "select";
  const isSending = phase === "send";
  const selectedIndex = 7;
  useEffect(() => {
    const phases = ["idle", "select", "send"];
    let index = 0;
    const id = setInterval(() => {
      index = (index + 1) % phases.length;
      setPhase(phases[index]);
    }, 2e3);
    return () => clearInterval(id);
  }, []);
  return /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-b border-zinc-900/60", children: [
    /* @__PURE__ */ jsx(Container, { className: "relative pt-20 pb-24 md:pt-28 md:pb-32", children: /* @__PURE__ */ jsxs("div", { className: "grid items-center gap-10 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(FadeIn, { children: /* @__PURE__ */ jsx(Tag, { children: "New — Model Context Protocol ready" }) }),
        /* @__PURE__ */ jsx(FadeIn, { delay: 0.06, children: /* @__PURE__ */ jsxs("h1", { className: "mt-4 text-4xl md:text-6xl font-semibold tracking-tight", children: [
          "Send any website component to ",
          /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent", children: "Cursor" }),
          ",",
          /* @__PURE__ */ jsx("br", { className: "hidden md:block" }),
          " or Claude Code, in one click"
        ] }) }),
        /* @__PURE__ */ jsx(FadeIn, { delay: 0.12, children: /* @__PURE__ */ jsx("p", { className: "mt-5 text-zinc-400 text-lg leading-7", children: "No more screenshots, descriptions, or guesswork—just seamless visual handoffs that your AI coding assistant understands perfectly. Bridge the gap between design and code." }) }),
        /* @__PURE__ */ jsx(FadeIn, { delay: 0.18, children: /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col sm:flex-row gap-3", children: [
          /* @__PURE__ */ jsxs(
            Button$1,
            {
              className: "h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold",
              onClick: () => window.open("https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi", "_blank"),
              children: [
                "Add to Chrome ",
                /* @__PURE__ */ jsx(Chrome, { className: "ml-2 h-5 w-5" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button$1,
            {
              variant: "outline",
              className: "h-11 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
              onClick: () => setIsModalOpen(true),
              children: [
                "Watch 70s demo ",
                /* @__PURE__ */ jsx(Zap, { className: "ml-2 h-5 w-5" })
              ]
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.96 },
          whileInView: { opacity: 1, scale: 1 },
          transition: { duration: 0.6, delay: 0.2 },
          viewport: { once: true },
          children: /* @__PURE__ */ jsx("div", { className: "relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "relative rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-950 p-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-zinc-400", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex h-2 w-2 rounded-full bg-emerald-400" }),
                " Live capture"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-zinc-500 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m5.34-3.34a9 9 0 11-12.68 0 9 9 0 0112.68 0z" }) }),
                " Secure MCP channel"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  className: "absolute z-10 h-3.5 w-3.5 rounded-full bg-zinc-100 shadow-[0_0_0_2px_rgba(0,0,0,0.2)]",
                  animate: {
                    top: isSelecting || isSending ? "32%" : "76%",
                    left: isSelecting || isSending ? "18%" : "10%"
                  },
                  transition: { duration: 0.9, ease: "easeInOut" }
                }
              ),
              isSelecting && /* @__PURE__ */ jsx(
                motion.span,
                {
                  className: "absolute z-0 h-8 w-8 rounded-full border-2 border-zinc-200",
                  style: { top: "calc(32% - 8px)", left: "calc(18% - 8px)" },
                  initial: { opacity: 0.5, scale: 0.7 },
                  animate: { opacity: 0, scale: 1.6 },
                  transition: { duration: 0.8 }
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-6 gap-2", children: Array.from({ length: 18 }).map((_, i) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: `h-16 rounded-md bg-zinc-800/60 ${i % 5 === 0 ? "col-span-2 h-24" : ""} ${(isSelecting || isSending) && i === selectedIndex ? "bg-emerald-500/10 ring-1 ring-emerald-500/30" : i % 7 === 0 ? "bg-emerald-500/10 ring-1 ring-emerald-500/30" : ""}`
                },
                i
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pointer-events-none", children: [
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  className: "absolute left-4 bottom-4 hidden md:block z-20",
                  animate: { opacity: isSelecting ? 1 : 0, scale: isSelecting ? 1 : 0.98 },
                  transition: { duration: 0.35 },
                  children: /* @__PURE__ */ jsx(motion.div, { animate: { y: [0, -4, 0] }, transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }, children: /* @__PURE__ */ jsx(PreviewCard$2, { label: "Component Selected", icon: /* @__PURE__ */ jsx(MousePointer2, { className: "h-4 w-4" }), children: /* @__PURE__ */ jsx("div", { className: "h-16 w-40 rounded-md bg-gradient-to-br from-zinc-800 to-zinc-900" }) }) })
                }
              ),
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  className: "absolute right-4 bottom-4 hidden md:block z-20",
                  animate: { opacity: isSending ? 1 : 0, scale: isSending ? 1 : 0.98 },
                  transition: { duration: 0.35 },
                  children: /* @__PURE__ */ jsx(motion.div, { animate: { y: [0, -4, 0] }, transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }, children: /* @__PURE__ */ jsx(PreviewCard$2, { label: "Send via WebToMCP", icon: /* @__PURE__ */ jsx(Cable, { className: "h-4 w-4" }), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-zinc-400", children: [
                    /* @__PURE__ */ jsx(CursorLogo, { className: "text-zinc-800" }),
                    " Cursor",
                    /* @__PURE__ */ jsx("span", { className: "text-zinc-600", children: "/" }),
                    /* @__PURE__ */ jsx(ClaudeLogo, { className: "text-zinc-800" }),
                    " Claude Code"
                  ] }) }) })
                }
              )
            ] })
          ] }) })
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(
      YouTubeModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        videoId: "1LHahVGjp1M"
      }
    )
  ] });
};
const Overview = () => {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected((prev) => !prev);
    }, 3e3);
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsx("section", { id: "overview", className: "relative border-b border-zinc-900/60", children: /* @__PURE__ */ jsxs(Container, { className: "py-16 md:py-24", children: [
    /* @__PURE__ */ jsx(FadeIn, { children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl text-center", children: [
      /* @__PURE__ */ jsxs(Tag, { children: [
        /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "h-4 w-4 text-emerald-400 mr-2", children: [
          /* @__PURE__ */ jsx("path", { d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" }),
          /* @__PURE__ */ jsx("path", { d: "M5 3v4" }),
          /* @__PURE__ */ jsx("path", { d: "M19 17v4" }),
          /* @__PURE__ */ jsx("path", { d: "M3 5h4" }),
          /* @__PURE__ */ jsx("path", { d: "M17 19h4" })
        ] }),
        "Why Web To MCP?"
      ] }),
      /* @__PURE__ */ jsxs("h2", { className: "mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent", children: [
        "The missing link between",
        " ",
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent", children: "inspiration" }),
        " ",
        "and",
        " ",
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent", children: "implementation" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(FadeIn, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "mt-16 relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-emerald-500/10 to-emerald-500/5 rounded-3xl blur-3xl" }),
      /* @__PURE__ */ jsxs("div", { className: "relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center", children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "relative",
            animate: {
              scale: isConnected ? 0.98 : 1,
              opacity: isConnected ? 0.8 : 1
            },
            transition: { duration: 1, ease: "easeInOut" },
            children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 relative overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-blue-500/10 border border-blue-500/20", children: /* @__PURE__ */ jsx(Eye, { className: "h-5 w-5 text-blue-400" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-zinc-100", children: "Inspiration" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-400", children: "Beautiful design you found" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 mb-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-red-500" }),
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-yellow-500" }),
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-4 bg-zinc-600 rounded w-3/4" }),
                  /* @__PURE__ */ jsx("div", { className: "h-3 bg-zinc-700 rounded w-1/2" }),
                  /* @__PURE__ */ jsx("div", { className: "h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-zinc-400", children: '"How do I explain this to my AI assistant?"' }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center relative", children: [
          /* @__PURE__ */ jsx("div", { className: "hidden lg:block absolute left-0 top-1/2 w-full", children: /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full",
              animate: {
                opacity: isConnected ? [0.3, 1, 0.3] : 0.3,
                scaleX: isConnected ? [0.8, 1.2, 0.8] : 0.8
              },
              transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }
          ) }),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "relative z-10 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 p-6 shadow-2xl",
              animate: {
                scale: isConnected ? [1, 1.1, 1] : 1,
                boxShadow: isConnected ? ["0 0 0 0 rgba(16, 185, 129, 0.3)", "0 0 0 20px rgba(16, 185, 129, 0)", "0 0 0 0 rgba(16, 185, 129, 0)"] : "0 0 0 0 rgba(16, 185, 129, 0)"
              },
              transition: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx(Zap, { className: "h-8 w-8 text-emerald-400 mx-auto mb-2" }),
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-emerald-300 text-lg", children: "Web To MCP" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-400/80", children: "Perfect Bridge" })
              ] })
            }
          ),
          [...Array(8)].map((_, i) => /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "absolute w-1 h-1 bg-emerald-400 rounded-full",
              style: {
                left: `${30 + Math.cos(i * 0.785) * 40}%`,
                top: `${50 + Math.sin(i * 0.785) * 40}%`
              },
              animate: {
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              },
              transition: {
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }
            },
            i
          ))
        ] }),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "relative",
            animate: {
              scale: isConnected ? 1.02 : 1,
              opacity: isConnected ? 1 : 0.9
            },
            transition: { duration: 0.8, ease: "easeInOut" },
            children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 relative overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20", children: /* @__PURE__ */ jsx(Code, { className: "h-5 w-5 text-emerald-400" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-zinc-100", children: "Implementation" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-400", children: "Perfect code output" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 mb-4 font-mono text-xs", children: [
                /* @__PURE__ */ jsx("div", { className: "text-emerald-400", children: "// Generated instantly" }),
                /* @__PURE__ */ jsx("div", { className: "text-blue-400", children: "<Button" }),
                /* @__PURE__ */ jsx("div", { className: "text-zinc-300 ml-2", children: 'className="bg-gradient-to-r' }),
                /* @__PURE__ */ jsx("div", { className: "text-zinc-300 ml-2", children: 'from-purple-600 to-blue-600"' }),
                /* @__PURE__ */ jsx("div", { className: "text-blue-400", children: ">" }),
                /* @__PURE__ */ jsx("div", { className: "text-zinc-300 ml-2", children: "Click me" }),
                /* @__PURE__ */ jsx("div", { className: "text-blue-400", children: "</Button>" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
                motion.span,
                {
                  className: "text-xs text-emerald-400",
                  animate: { opacity: isConnected ? [0.6, 1, 0.6] : 0.6 },
                  transition: { duration: 2, repeat: Infinity },
                  children: "✓ Pixel-perfect match achieved"
                }
              ) })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(FadeIn, { delay: 0.4, children: /* @__PURE__ */ jsx("div", { className: "mt-12 text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-700/50 bg-zinc-800/40", children: [
        /* @__PURE__ */ jsx("span", { className: "text-zinc-400", children: "Works across any website, framework, or design system" }),
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 text-emerald-400" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-emerald-400", children: "30 seconds to perfect handoff" })
      ] }) }) })
    ] }) })
  ] }) });
};
const benefits = [
  {
    icon: /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
      /* @__PURE__ */ jsx("path", { d: "M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3", stroke: "currentColor", strokeWidth: "2" })
    ] }),
    title: "Clearer context",
    description: "Extract any web element with its full styling context - no guesswork",
    color: "emerald"
  },
  {
    icon: /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
      /* @__PURE__ */ jsx("path", { d: "M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("path", { d: "M12 16L13.09 18.26L16 19L13.09 19.74L12 22L10.91 19.74L8 19L10.91 18.26L12 16Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
    ] }),
    title: "Higher fidelity",
    description: "What you see is exactly what your AI coding assistant receives",
    color: "emerald"
  },
  {
    icon: /* @__PURE__ */ jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { d: "M13 2L3 14H12L11 22L21 10H12L13 2Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }),
    title: "Faster delivery",
    description: "From inspiration to implementation in 30 seconds, not 30 minutes",
    color: "emerald"
  },
  {
    icon: /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
      /* @__PURE__ */ jsx("path", { d: "M12 15L17 10L22 15L17 20L12 15Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("path", { d: "M2 15L7 10L12 15L7 20L2 15Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("path", { d: "M12 2L17 7L12 12L7 7L12 2Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
    ] }),
    title: "Native tooling fit",
    description: "Purpose-built for Cursor and Claude Code workflows via MCP",
    color: "emerald"
  },
  {
    icon: /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
      /* @__PURE__ */ jsx("path", { d: "M9 11L12 14L22 4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("path", { d: "M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3.89543 5 3 4.10457 3 3H11", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
    ] }),
    title: "Eliminate guesswork",
    description: "Give your coding assistant pixel-perfect references and achieve exact visual matches",
    color: "emerald"
  },
  {
    icon: /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
      /* @__PURE__ */ jsx("path", { d: "M20 6L9 17L4 12", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9", stroke: "currentColor", strokeWidth: "2" })
    ] }),
    title: "Reliable results",
    description: "Save hours of back-and-forth—the fastest way to provide design context",
    color: "emerald"
  },
  {
    icon: /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
      /* @__PURE__ */ jsx("path", { d: "M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("path", { d: "M13 13L17 17", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
    ] }),
    title: "10× faster",
    description: "Dramatically reduce the time spent explaining components to AI assistants",
    color: "emerald"
  },
  {
    icon: /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
      /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1", stroke: "currentColor", strokeWidth: "2" }),
      /* @__PURE__ */ jsx("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1", stroke: "currentColor", strokeWidth: "2" }),
      /* @__PURE__ */ jsx("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1", stroke: "currentColor", strokeWidth: "2" }),
      /* @__PURE__ */ jsx("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1", stroke: "currentColor", strokeWidth: "2" })
    ] }),
    title: "Framework agnostic",
    description: "Works with any tech stack - React, Vue, Angular, or vanilla HTML/CSS",
    color: "emerald"
  }
];
const Benefits = () => /* @__PURE__ */ jsx("section", { className: "relative border-b border-zinc-900/60", children: /* @__PURE__ */ jsxs(Container, { className: "py-16 md:py-24", children: [
  /* @__PURE__ */ jsx(FadeIn, { children: /* @__PURE__ */ jsxs("div", { className: "mx-auto mb-16 max-w-3xl text-center", children: [
    /* @__PURE__ */ jsxs(Tag, { children: [
      /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "h-4 w-4 text-emerald-400 mr-2", children: [
        /* @__PURE__ */ jsx("path", { d: "M9 12l2 2 4-4" }),
        /* @__PURE__ */ jsx("path", { d: "M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" })
      ] }),
      "Key Benefits"
    ] }),
    /* @__PURE__ */ jsxs("h2", { className: "mt-3 text-3xl md:text-4xl font-semibold text-zinc-100", children: [
      "Clarity",
      " ",
      /* @__PURE__ */ jsx("span", { className: "text-emerald-400", children: "in" }),
      ", perfect code",
      " ",
      /* @__PURE__ */ jsx("span", { className: "text-emerald-400", children: "out" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-zinc-400 text-lg leading-relaxed", children: "Stop describing UI. Send the real thing with full context and styling." })
  ] }) }),
  /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-4", children: benefits.map((benefit, index) => /* @__PURE__ */ jsx(FadeIn, { delay: 0.1 * index, children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1 flex flex-col h-full",
      whileHover: { scale: 1.02 },
      transition: { type: "spring", stiffness: 300, damping: 30 },
      children: [
        /* @__PURE__ */ jsx("div", { className: `inline-flex items-center justify-center w-12 h-12 rounded-lg bg-${benefit.color}-500/10 border border-${benefit.color}-500/20 text-${benefit.color}-400 mb-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`, children: benefit.icon }),
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-zinc-100 mb-2", children: benefit.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400 leading-relaxed flex-grow", children: benefit.description }),
        /* @__PURE__ */ jsx("div", { className: `absolute inset-0 rounded-xl bg-gradient-to-br from-${benefit.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none` })
      ]
    }
  ) }, benefit.title)) })
] }) });
const HowItWorks = () => /* @__PURE__ */ jsx("section", { id: "how", className: "relative border-b border-zinc-900/60", children: /* @__PURE__ */ jsxs(Container, { className: "py-16 md:py-24", children: [
  /* @__PURE__ */ jsxs("div", { className: "mx-auto mb-10 max-w-2xl text-center", children: [
    /* @__PURE__ */ jsxs(Tag, { children: [
      /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "h-4 w-4 text-emerald-400 mr-2", children: /* @__PURE__ */ jsx("path", { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" }) }),
      "How it works"
    ] }),
    /* @__PURE__ */ jsxs("h2", { className: "mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent", children: [
      "From",
      " ",
      /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent", children: "inspiration" }),
      " ",
      "to",
      " ",
      /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent", children: "implementation" }),
      " ",
      "in",
      " ",
      /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent", children: "30 seconds" }),
      "."
    ] })
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
    /* @__PURE__ */ jsx(Step, { index: 1, title: "Authenticate with Google", iconType: "google-auth", children: "Sign in and you're set." }),
    /* @__PURE__ */ jsx(Step, { index: 2, title: "Install the Chrome extension", iconType: "chrome-extension", children: "Add it from the Web Store." }),
    /* @__PURE__ */ jsx(Step, { index: 3, title: "Navigate to any website", iconType: "website-nav", children: "Open the page with the component you want." }),
    /* @__PURE__ */ jsx(Step, { index: 4, title: "Click the extension icon", iconType: "extension-click", children: "Activate component selection mode." }),
    /* @__PURE__ */ jsx(Step, { index: 5, title: "Select the component", iconType: "component-select", children: "We capture it exactly as rendered." }),
    /* @__PURE__ */ jsx(Step, { index: 6, title: "Send to your AI assistant", iconType: "send-to-ai", children: "Delivered via MCP to Cursor or Claude Code." })
  ] })
] }) });
const CursorSetupGuide = () => {
  const [copied, setCopied] = useState(false);
  const mcpConfig = `{
  "mcpServers": {
    "web-to-mcp": {
      "url": "https://web-to-mcp.com/mcp/<YOUR_UNIQUE_ID>"
    }
  }
}`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mcpConfig);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
    /* @__PURE__ */ jsx(FadeIn, { children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30", children: /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-emerald-400", children: "1" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-zinc-100", children: "Install Chrome extension" }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400", children: "Install the Web to MCP browser extension" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "1.1" }),
            "Install Extension"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: 'Click the "Add to Chrome" button to go directly to the Web to MCP extension page' })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "1.2" }),
            'Click "Add to Chrome"'
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Install the extension to your browser" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "1.3" }),
            "Sign in to your account"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Authenticate with your Google account to get your unique MCP URL" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxs(
        "button",
        {
          className: "inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold rounded-lg transition-colors cursor-pointer",
          onClick: () => window.open("https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi", "_blank"),
          children: [
            /* @__PURE__ */ jsx(Chrome, { className: "h-5 w-5" }),
            "Add to Chrome"
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(FadeIn, { delay: 0.1, children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30", children: /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-emerald-400", children: "2" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-zinc-100", children: "Configure MCP in Cursor" }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400", children: "Set up the MCP configuration file in Cursor IDE" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "2.1" }),
            "Open Cursor Settings"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Press Ctrl+Shift+J (or Cmd+Shift+J on Mac) to open settings" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "2.2" }),
            "Navigate to MCP Settings"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Go to Features → Model Context Protocol" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "2.3" }),
            "Create MCP Configuration"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Choose between project-specific or global configuration" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-zinc-100", children: "Project Configuration" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-400", children: [
          "Create ",
          /* @__PURE__ */ jsx("code", { className: "px-2 py-1 bg-zinc-800 rounded text-emerald-400", children: ".cursor/mcp.json" }),
          " in your project root:"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("pre", { className: "bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm overflow-x-auto", children: /* @__PURE__ */ jsx("code", { className: "text-zinc-300", children: mcpConfig }) }),
          /* @__PURE__ */ jsx("button", { onClick: handleCopy, className: "absolute top-2 right-2 p-2 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer", children: copied ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(FadeIn, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30", children: /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-emerald-400", children: "3" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-zinc-100", children: "Replace MCP URL" }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400", children: "Update the configuration with your actual MCP URL" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "3.1" }),
            "Get Your MCP URL"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Sign in to your account and copy your unique MCP URL from the dashboard" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "3.2" }),
            "Add to Cursor"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Add your MCP URL to the Cursor configuration" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "3.3" }),
            "Cursor detects new tools"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Cursor will automatically detect the new MCP tool and you can start using it" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold rounded-lg transition-colors cursor-pointer",
          onClick: () => window.open("https://web-to-mcp.com", "_blank"),
          children: "Get MCP URL"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(FadeIn, { delay: 0.3, children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30", children: /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-emerald-400", children: "4" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-zinc-100", children: "Start capturing components" }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400", children: "Navigate to any website and start sending components to Cursor" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "4.1" }),
            "Navigate to Website"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Go to any website you want to extract components from" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "4.2" }),
            "Click Extension Icon"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Click the Web to MCP extension icon in your browser" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "4.3" }),
            "Select Component"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Click on any element you want to capture and copy its reference id" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "4.4" }),
            "Refer to the element in Cursor"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "You can refer to the element inside Cursor chat using the reference id" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-emerald-400", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "[SUCCESS]" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-emerald-300 mt-1", children: "Your MCP server is now connected! Components will be sent directly to Cursor IDE." })
      ] })
    ] }) })
  ] });
};
const ClaudeSetupGuide = () => {
  const [copied, setCopied] = useState(false);
  const claudeConfig = `{
  "mcpServers": {
    "web-to-mcp": {
      "url": "https://web-to-mcp.com/mcp/<YOUR_UNIQUE_ID>",
      "name": "Web to MCP",
      "description": "Send website components to Claude Code"
    }
  }
}`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(claudeConfig);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
    /* @__PURE__ */ jsx(FadeIn, { children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30", children: /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-yellow-400", children: "1" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-zinc-100", children: "Install Chrome extension" }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400", children: "Install the Web to MCP browser extension" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "1.1" }),
            "Install Extension"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: 'Click the "Add to Chrome" button to go directly to the Web to MCP extension page' })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "1.2" }),
            'Click "Add to Chrome"'
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Install the extension to your browser" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "1.3" }),
            "Sign in to your account"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Authenticate with your Google account to get your unique MCP URL" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxs(
        "button",
        {
          className: "inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold rounded-lg transition-colors cursor-pointer",
          onClick: () => window.open("https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi", "_blank"),
          children: [
            /* @__PURE__ */ jsx(Chrome, { className: "h-5 w-5" }),
            "Add to Chrome"
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(FadeIn, { delay: 0.1, children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30", children: /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-yellow-400", children: "2" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-zinc-100", children: "Configure MCP in Claude Code" }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400", children: "Set up the MCP configuration file in Claude Code" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "2.1" }),
            "Open Claude Settings"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Access Claude Code settings and navigate to MCP configuration" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "2.2" }),
            "Navigate to MCP Settings"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Go to Extensions → Model Context Protocol" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "2.3" }),
            "Create MCP Configuration"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Add Web to MCP as a new MCP server" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-zinc-100", children: "Claude Code Configuration" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Add the following MCP server configuration:" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("pre", { className: "bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm overflow-x-auto", children: /* @__PURE__ */ jsx("code", { className: "text-zinc-300", children: claudeConfig }) }),
          /* @__PURE__ */ jsx("button", { onClick: handleCopy, className: "absolute top-2 right-2 p-2 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer", children: copied ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(FadeIn, { delay: 0.2, children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30", children: /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-yellow-400", children: "3" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-zinc-100", children: "Replace MCP URL" }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400", children: "Update the configuration with your actual MCP URL" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "3.1" }),
            "Get Your MCP URL"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Sign in to your account and copy your unique MCP URL from the dashboard" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "3.2" }),
            "Add to Claude Code"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400", children: "Add your MCP URL to the Claude Code configuration" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "3.3" }),
            "Claude detects new tools"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Claude Code will automatically detect the new MCP tool and you can start using it" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold rounded-lg transition-colors cursor-pointer",
          onClick: () => window.open("https://web-to-mcp.com", "_blank"),
          children: "Get MCP URL"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(FadeIn, { delay: 0.3, children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30", children: /* @__PURE__ */ jsx("span", { className: "text-xl font-bold text-yellow-400", children: "4" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-zinc-100", children: "Start capturing components" }),
          /* @__PURE__ */ jsx("p", { className: "text-zinc-400", children: "Navigate to any website and start sending components to Claude Code" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "4.1" }),
            "Navigate to Website"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Go to any website you want to extract components from" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "4.2" }),
            "Click Extension Icon"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Click the Web to MCP extension icon in your browser" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "4.3" }),
            "Select Component"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "Click on any element you want to capture and copy its reference id" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-zinc-200", children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs", children: "4.4" }),
            "Refer to the element in Claude"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: "You can refer to the element inside Claude Code chat using the reference id" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-yellow-400", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "[SUCCESS]" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-yellow-300 mt-1", children: "Your MCP server is now connected! Components will be sent directly to Claude Code." })
      ] })
    ] }) })
  ] });
};
const Integrations = () => {
  const [selectedIntegration, setSelectedIntegration] = useState("cursor");
  return /* @__PURE__ */ jsx("section", { id: "integrations", className: "relative border-b border-zinc-900/60", children: /* @__PURE__ */ jsxs(Container, { className: "py-16 md:py-24", children: [
    /* @__PURE__ */ jsx(FadeIn, { children: /* @__PURE__ */ jsxs("div", { className: "mx-auto mb-12 max-w-3xl text-center", children: [
      /* @__PURE__ */ jsxs(Tag, { children: [
        /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "h-4 w-4 text-emerald-400 mr-2", children: [
          /* @__PURE__ */ jsx("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
          /* @__PURE__ */ jsx("polyline", { points: "3.27,6.96 12,12.01 20.73,6.96" }),
          /* @__PURE__ */ jsx("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })
        ] }),
        "Setup Guide"
      ] }),
      /* @__PURE__ */ jsxs("h2", { className: "mt-4 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent", children: [
        "From",
        " ",
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent", children: "extension" }),
        " ",
        "to",
        " ",
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent", children: "integration" }),
        " ",
        "in",
        " ",
        /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent", children: "minutes" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-zinc-400 text-lg", children: "Follow these step-by-step instructions to connect Web to MCP with your AI coding assistant" })
    ] }) }),
    /* @__PURE__ */ jsx(FadeIn, { delay: 0.1, children: /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-12", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 p-1.5 backdrop-blur-sm shadow-xl", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedIntegration("cursor"),
          className: `relative px-8 py-4 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${selectedIntegration === "cursor" ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 transform scale-105" : "text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/50"}`,
          children: [
            selectedIntegration === "cursor" && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl blur opacity-50 -z-10" }),
            "Cursor IDE"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedIntegration("claude"),
          className: `relative px-8 py-4 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${selectedIntegration === "claude" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 transform scale-105" : "text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/50"}`,
          children: [
            selectedIntegration === "claude" && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-50 -z-10" }),
            "Claude Code"
          ]
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" },
        children: selectedIntegration === "cursor" ? /* @__PURE__ */ jsx(CursorSetupGuide, {}) : /* @__PURE__ */ jsx(ClaudeSetupGuide, {})
      },
      selectedIntegration
    ),
    /* @__PURE__ */ jsx(FadeIn, { delay: 0.4, children: /* @__PURE__ */ jsx("div", { className: "mt-16 text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20", children: [
      /* @__PURE__ */ jsx(CheckCircle, { className: "h-6 w-6 text-emerald-400" }),
      /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
        /* @__PURE__ */ jsx("div", { className: "font-semibold text-emerald-300", children: "Ready to get UI components into your IDE?" }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-emerald-400/80", children: "Join thousands of developers saving hours every day" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold rounded-lg transition-colors cursor-pointer",
          onClick: () => window.open("https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi", "_blank"),
          children: "Get started now"
        }
      )
    ] }) }) })
  ] }) });
};
const ReqCard = ({ icon, title, description, color, step }) => {
  const colorConfig = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      glow: "bg-blue-500/5",
      accent: "bg-blue-500"
    },
    green: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      glow: "bg-emerald-500/5",
      accent: "bg-emerald-500"
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
      glow: "bg-purple-500/5",
      accent: "bg-purple-500"
    }
  };
  const config = colorConfig[color];
  return /* @__PURE__ */ jsxs("div", { className: "group relative", children: [
    /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${config.glow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500` }),
    /* @__PURE__ */ jsxs("div", { className: `relative rounded-2xl border ${config.border} bg-zinc-900/60 p-6 hover:bg-zinc-900/80 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1 backdrop-blur-sm`, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-zinc-400", children: step }) }),
      /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx("div", { className: `inline-flex items-center justify-center w-16 h-16 rounded-2xl ${config.bg} ${config.border} ${config.text} group-hover:scale-110 transition-transform duration-300`, children: icon }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors", children: description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-2 text-xs text-zinc-500", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3" }),
        /* @__PURE__ */ jsx("span", { children: "Required" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `absolute inset-0 rounded-2xl bg-gradient-to-br ${config.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none` })
    ] })
  ] });
};
const TechReq = () => /* @__PURE__ */ jsxs("section", { className: "relative border-b border-zinc-900/60", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/30 to-transparent" }),
  /* @__PURE__ */ jsxs(Container, { className: "py-16 md:py-24 relative", children: [
    /* @__PURE__ */ jsx(FadeIn, { children: /* @__PURE__ */ jsxs("div", { className: "mx-auto mb-16 max-w-3xl text-center", children: [
      /* @__PURE__ */ jsxs(Tag, { children: [
        /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "h-4 w-4 text-emerald-400 mr-2", children: [
          /* @__PURE__ */ jsx("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }),
          /* @__PURE__ */ jsx("line", { x1: "12", y1: "9", x2: "12", y2: "13" }),
          /* @__PURE__ */ jsx("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
        ] }),
        "Technical Requirements"
      ] }),
      /* @__PURE__ */ jsxs("h2", { className: "mt-3 text-3xl md:text-4xl font-semibold text-zinc-100", children: [
        "Everything you need to",
        " ",
        /* @__PURE__ */ jsx("span", { className: "text-emerald-400", children: "get started" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-zinc-400 text-lg leading-relaxed", children: "Simple setup. No complex installations. Start sending visual context in minutes." })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-8 md:grid-cols-3 max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsx(FadeIn, { delay: 0.1, children: /* @__PURE__ */ jsx(
        ReqCard,
        {
          step: 1,
          icon: /* @__PURE__ */ jsx(Chrome, { className: "h-7 w-7" }),
          title: "Chrome Browser",
          description: "Install our lightweight Chrome extension from the Web Store. One-click installation with automatic updates.",
          color: "blue"
        }
      ) }),
      /* @__PURE__ */ jsx(FadeIn, { delay: 0.2, children: /* @__PURE__ */ jsx(
        ReqCard,
        {
          step: 2,
          icon: /* @__PURE__ */ jsx(GoogleLogo, { className: "w-7 h-7" }),
          title: "Google Account",
          description: "Sign in securely with your Google account for seamless authentication and personalized MCP URL generation.",
          color: "green"
        }
      ) }),
      /* @__PURE__ */ jsx(FadeIn, { delay: 0.3, children: /* @__PURE__ */ jsx(
        ReqCard,
        {
          step: 3,
          icon: /* @__PURE__ */ jsx(Plug, { className: "h-7 w-7" }),
          title: "AI Coding Assistant",
          description: "Configure MCP in Cursor IDE or Claude Code for direct component handoffs and enhanced workflow integration.",
          color: "purple"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(FadeIn, { delay: 0.4, children: /* @__PURE__ */ jsx("div", { className: "mt-12 text-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-700/50 bg-zinc-800/40 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "text-zinc-400", children: "Setup time:" }),
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-emerald-400", children: "Less than 5 minutes" }),
      /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" })
    ] }) }) })
  ] })
] });
const FAQ = () => /* @__PURE__ */ jsx("section", { className: "relative border-b border-zinc-900/60", children: /* @__PURE__ */ jsxs(Container, { className: "py-16 md:py-24", children: [
  /* @__PURE__ */ jsxs("div", { className: "mx-auto mb-12 max-w-2xl text-center", children: [
    /* @__PURE__ */ jsxs(Tag, { children: [
      /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "h-4 w-4 text-emerald-400 mr-2", children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
        /* @__PURE__ */ jsx("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }),
        /* @__PURE__ */ jsx("path", { d: "M12 17h.01" })
      ] }),
      "FAQ"
    ] }),
    /* @__PURE__ */ jsxs("h2", { className: "mt-4 text-3xl md:text-4xl font-semibold text-zinc-100", children: [
      "You've got",
      " ",
      /* @__PURE__ */ jsx("span", { className: "text-emerald-400", children: "questions" }),
      ". We've got",
      " ",
      /* @__PURE__ */ jsx("span", { className: "text-emerald-400", children: "answers" }),
      "."
    ] })
  ] }),
  /* @__PURE__ */ jsxs(Accordion, { type: "single", collapsible: true, className: "w-full max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxs(AccordionItem, { value: "item-1", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left text-zinc-100 hover:text-zinc-200", children: "What is MCP (Model Context Protocol)?" }),
      /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-zinc-400", children: [
        /* @__PURE__ */ jsx("p", { children: "MCP (Model Context Protocol) is an open standard that enables AI coding assistants to connect to external tools and data sources. It allows applications like Cursor and Claude Code to access real-time information, APIs, and specialized tools during conversations." }),
        /* @__PURE__ */ jsx("p", { children: 'Think of MCP as a bridge that lets your AI assistant "see" and interact with external systems—like databases, APIs, or in our case, web components—providing much richer context for better responses.' })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { value: "item-2", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left text-zinc-100 hover:text-zinc-200", children: "How do I use Web to MCP?" }),
      /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-zinc-400", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Step 1:" }),
          " Install our Chrome extension from the Web Store and sign in with Google."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Step 2:" }),
          " Configure MCP in your AI coding assistant (Cursor or Claude Code) using our provided configuration."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Step 3:" }),
          " Navigate to any website and click our extension icon to activate component selection mode."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Step 4:" }),
          " Select any UI component you want to recreate—we capture the DOM structure and visual styling."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Step 5:" }),
          " The component data is automatically sent to your AI assistant via MCP for perfect recreation."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { value: "item-3", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left text-zinc-100 hover:text-zinc-200", children: "What are the benefits of using Web to MCP?" }),
      /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-zinc-400", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "10x faster development:" }),
          " No more describing components or taking screenshots—send pixel-perfect references instantly."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Perfect accuracy:" }),
          " Your AI gets the exact HTML structure, CSS styles, and visual context it needs for accurate recreation."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Seamless workflow:" }),
          " Direct integration with Cursor and Claude Code means no context switching or manual copy-pasting."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Universal compatibility:" }),
          " Works with any website, design system, or UI framework—React, Vue, Angular, or plain HTML."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Time savings:" }),
          " Turn 30 minutes of back-and-forth explanations into 30 seconds of precise handoff."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { value: "item-4", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left text-zinc-100 hover:text-zinc-200", children: "How do I add MCP support in Cursor IDE?" }),
      /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-zinc-400", children: [
        /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("strong", { children: "General MCP Setup:" }) }),
        /* @__PURE__ */ jsx("p", { children: "Cursor natively supports MCP through configuration files. You can add MCP servers by creating a configuration file that tells Cursor which external tools to connect to." }),
        /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("strong", { children: "For Web to MCP specifically:" }) }),
        /* @__PURE__ */ jsx("p", { children: "1. Open Cursor settings (Ctrl+Shift+J or Cmd+Shift+J)" }),
        /* @__PURE__ */ jsx("p", { children: "2. Navigate to features → Model Context Protocol" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "3. Create a project-specific ",
          /* @__PURE__ */ jsx("code", { className: "bg-zinc-800 px-2 py-1 rounded text-emerald-400", children: ".cursor/mcp.json" }),
          " file with our provided configuration"
        ] }),
        /* @__PURE__ */ jsx("p", { children: "4. Add your unique Web to MCP server URL (generated after signing in with Google)" }),
        /* @__PURE__ */ jsx("p", { children: "5. Restart Cursor—Web to MCP tools will now be available in your chat context!" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { value: "item-5", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left text-zinc-100 hover:text-zinc-200", children: "How do I add MCP support in Claude Code?" }),
      /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-zinc-400", children: [
        /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("strong", { children: "General MCP Setup:" }) }),
        /* @__PURE__ */ jsx("p", { children: "Claude Code supports MCP through configuration files that connect to external MCP servers, allowing Claude to access specialized tools and data sources." }),
        /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("strong", { children: "For Web to MCP specifically:" }) }),
        /* @__PURE__ */ jsx("p", { children: "1. Locate your Claude Code configuration directory" }),
        /* @__PURE__ */ jsxs("p", { children: [
          "2. Create or edit the MCP configuration file (usually ",
          /* @__PURE__ */ jsx("code", { className: "bg-zinc-800 px-2 py-1 rounded text-emerald-400", children: "config.json" }),
          ")"
        ] }),
        /* @__PURE__ */ jsx("p", { children: "3. Add the Web to MCP server configuration with your unique server URL" }),
        /* @__PURE__ */ jsx("p", { children: "4. Include the required server settings and authentication details" }),
        /* @__PURE__ */ jsx("p", { children: "5. Restart Claude Code to enable the Web to MCP integration" }),
        /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx("em", { children: "Note: Detailed setup instructions with your personalized config are provided after signing up." }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { value: "item-6", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left text-zinc-100 hover:text-zinc-200", children: "Is MCP free to use?" }),
      /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-zinc-400", children: [
        /* @__PURE__ */ jsx("p", { children: "Yes! MCP (Model Context Protocol) itself is completely free and open-source. It's a standard protocol developed to enhance AI assistant capabilities." }),
        /* @__PURE__ */ jsx("p", { children: "However, the individual MCP servers and tools (like Web to MCP) may have their own pricing models. The cost depends on the specific service you're connecting to, not the MCP protocol itself." })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { value: "item-7", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left text-zinc-100 hover:text-zinc-200", children: "Is Web to MCP free to use?" }),
      /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-zinc-400", children: [
        /* @__PURE__ */ jsx("p", { children: "Yes! Web to MCP is completely free to use. All users get configurable free captures to experience the full workflow enhancement." }),
        /* @__PURE__ */ jsx("p", { children: "You can customize your capture limits based on your needs, and the service is designed to work seamlessly with your development process without any payment requirements." })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { value: "item-8", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left text-zinc-100 hover:text-zinc-200", children: "How does Web to MCP improve design-to-code workflow?" }),
      /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-zinc-400", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Eliminates Design Guesswork:" }),
          ' Instead of describing "make it look like that button," you send the exact button with all its styling context.'
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Reduces Back-and-forth:" }),
          ' No more "make it more rounded," "different shade of blue," or "add more padding"—get it right the first time.'
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Maintains Design Consistency:" }),
          " Extract components from existing design systems to ensure your new code matches established patterns."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Speeds Up Prototyping:" }),
          " Quickly grab UI patterns from anywhere on the web to accelerate your design exploration."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { value: "item-9", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left text-zinc-100 hover:text-zinc-200", children: "What makes Web to MCP better than screenshots or design handoffs?" }),
      /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-zinc-400", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "vs Screenshots:" }),
          " We capture actual DOM structure and CSS properties, not just pixels. Your AI gets semantic HTML and exact styling values."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "vs Design Tools:" }),
          " No need to switch between Figma and code—capture live, interactive components directly from production websites."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "vs Manual Description:" }),
          ' Skip the "center-aligned blue button with rounded corners" explanations. Send the real thing with one click.'
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Full Context:" }),
          " Includes responsive behavior, hover states, and surrounding layout context that static designs miss."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { value: "item-10", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left text-zinc-100 hover:text-zinc-200", children: "How does this boost developer productivity?" }),
      /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-zinc-400", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Instant Reference:" }),
          " Turn any UI component into a coding reference in seconds, not minutes."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Fewer Iterations:" }),
          " Get accurate results on the first try instead of multiple refinement cycles."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Learning Acceleration:" }),
          " Understand how complex components are built by examining real production code."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Pattern Building:" }),
          " Build a library of proven UI patterns by capturing components from successful products."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Faster Onboarding:" }),
          " New team members can quickly understand existing component patterns and styling approaches."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { value: "item-11", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left text-zinc-100 hover:text-zinc-200", children: "Is my data secure when using Web to MCP?" }),
      /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-zinc-400", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Minimal Data Collection:" }),
          " We only capture the DOM structure and styling of selected components—no personal data, passwords, or sensitive information."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Secure Authentication:" }),
          " Sign in securely through Google OAuth—we never see or store your credentials."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "No Full Page Capture:" }),
          " We only capture the specific element you select, not entire pages or other website content."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Direct Transmission:" }),
          " Component data goes directly to your AI assistant via MCP—we don't store captured components on our servers."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(AccordionItem, { value: "item-12", children: [
      /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-left text-zinc-100 hover:text-zinc-200", children: "Will the AI reproduce the UI component exactly?" }),
      /* @__PURE__ */ jsx(AccordionContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-zinc-400", children: [
        /* @__PURE__ */ jsx("p", { children: "While we provide pixel-perfect references, the final output depends on your AI assistant and how you prompt it:" }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "What we guarantee:" }),
          " Accurate DOM structure, exact CSS values, proper styling context, and visual screenshots."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "What affects results:" }),
          " Your AI model choice, prompt clarity, and specific framework requirements (React vs Vue vs Angular)."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Best practices:" }),
          " Be specific about your tech stack, mention any design system you're using, and iterate with the AI for perfect results."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "Most developers see 90%+ accuracy on first generation, with perfect results after minimal refinement." })
      ] }) })
    ] })
  ] })
] }) });
const CTA = () => /* @__PURE__ */ jsx("section", { className: "relative", children: /* @__PURE__ */ jsxs(Container, { className: "py-16 md:py-24 text-center", children: [
  /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400", children: [
    /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-emerald-400" }),
    " Stop explaining UI. Send it."
  ] }),
  /* @__PURE__ */ jsxs("h3", { className: "mt-4 text-3xl md:text-4xl font-semibold text-zinc-100", children: [
    "Bridge",
    " ",
    /* @__PURE__ */ jsx("span", { className: "text-emerald-400", children: "design" }),
    " ",
    "and",
    " ",
    /* @__PURE__ */ jsx("span", { className: "text-emerald-400", children: "code" }),
    " ",
    "in",
    " ",
    /* @__PURE__ */ jsx("span", { className: "text-emerald-400", children: "one click" }),
    "."
  ] }),
  /* @__PURE__ */ jsx("p", { className: "mt-3 text-zinc-400", children: "Add the extension and start coding with perfect visual context." }),
  /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsxs(
    Button$1,
    {
      className: "h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold",
      onClick: () => window.open("https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi", "_blank"),
      children: [
        "Install Web to MCP ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
      ]
    }
  ) })
] }) });
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return /* @__PURE__ */ jsx(Fragment, { children: isVisible && /* @__PURE__ */ jsx(
    motion.button,
    {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      onClick: scrollToTop,
      className: "fixed bottom-8 right-8 z-50 p-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-900 shadow-lg transition-all duration-200 hover:scale-110",
      whileHover: { scale: 1.1 },
      whileTap: { scale: 0.9 },
      children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 10l7-7m0 0l7 7m-7-7v18" }) })
    }
  ) });
};
const Footer = () => /* @__PURE__ */ jsx("footer", { className: "border-t border-zinc-900/60", children: /* @__PURE__ */ jsx(Container, { className: "py-10", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500", children: [
  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: "/favicon.ico",
        alt: "WebToMCP Logo",
        className: "w-6 h-6 transition-transform hover:scale-105"
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "font-bold", children: /* @__PURE__ */ jsx(GradientText, { children: "WebToMCP" }) })
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
    /* @__PURE__ */ jsx("a", { href: "/privacy", className: "hover:text-zinc-300 transition-colors duration-200 cursor-pointer", children: "Privacy" }),
    /* @__PURE__ */ jsx("a", { href: "/terms", className: "hover:text-zinc-300 transition-colors duration-200 cursor-pointer", children: "Terms" }),
    /* @__PURE__ */ jsx("a", { href: "/refund", className: "hover:text-zinc-300 transition-colors duration-200 cursor-pointer", children: "Refund" }),
    /* @__PURE__ */ jsx("a", { href: "mailto:team@web-to-mcp.com", className: "hover:text-zinc-300 transition-colors duration-200 cursor-pointer", children: "Support" })
  ] }),
  /* @__PURE__ */ jsxs("div", { children: [
    "© ",
    (/* @__PURE__ */ new Date()).getFullYear(),
    " WebToMCP"
  ] })
] }) }) });
function meta$6({}) {
  return [{
    title: "Web to MCP - Send Website Components Directly to AI Coding Assistants"
  }, {
    name: "description",
    content: "Bridge the gap between design and code. Send pixel-perfect website components directly to Cursor or Claude Code using Model Context Protocol (MCP). No more screenshots or descriptions needed."
  }, {
    name: "keywords",
    content: "web to mcp, model context protocol, cursor, claude code, ai coding, website components, design to code, web development, component transfer, mcp server"
  }, {
    property: "og:title",
    content: "Web to MCP - Send Website Components Directly to AI Coding Assistants"
  }, {
    property: "og:description",
    content: "Bridge the gap between design and code. Send pixel-perfect website components directly to Cursor or Claude Code using MCP."
  }, {
    property: "og:url",
    content: "https://web-to-mcp.com"
  }, {
    property: "twitter:title",
    content: "Web to MCP - Send Website Components Directly to AI Coding Assistants"
  }, {
    property: "twitter:description",
    content: "Bridge the gap between design and code. Send pixel-perfect website components directly to Cursor or Claude Code using MCP."
  }, {
    name: "robots",
    content: "index, follow"
  }, {
    name: "author",
    content: "Web to MCP"
  }, {
    property: "og:type",
    content: "website"
  }, {
    property: "og:image",
    content: "/og.png"
  }, {
    property: "og:image:width",
    content: "1200"
  }, {
    property: "og:image:height",
    content: "630"
  }, {
    property: "og:image:type",
    content: "image/png"
  }, {
    property: "og:site_name",
    content: "Web to MCP"
  }, {
    property: "twitter:card",
    content: "summary_large_image"
  }, {
    property: "twitter:image",
    content: "/og.png"
  }];
}
const home = UNSAFE_withComponentProps(function WebToMcpLanding() {
  const {
    scrollY
  } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, -80]);
  const y2 = useTransform(scrollY, [0, 800], [0, -40]);
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden",
    children: [/* @__PURE__ */ jsx(Glow, {}), /* @__PURE__ */ jsxs("div", {
      className: "absolute inset-0 pointer-events-none",
      children: [/* @__PURE__ */ jsx(motion.div, {
        className: "absolute left-[10%] top-[15%] h-32 w-48 rounded-full bg-zinc-800/10 blur-xl",
        animate: {
          x: [0, 20, 0],
          y: [0, -10, 0],
          opacity: [0.1, 0.15, 0.1]
        },
        transition: {
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }), /* @__PURE__ */ jsx(motion.div, {
        className: "absolute right-[20%] top-[25%] h-24 w-36 rounded-full bg-zinc-700/8 blur-lg",
        animate: {
          x: [0, -15, 0],
          y: [0, 8, 0],
          opacity: [0.08, 0.12, 0.08]
        },
        transition: {
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }
      }), /* @__PURE__ */ jsx(motion.div, {
        className: "absolute left-[60%] top-[40%] h-16 w-24 rounded-full bg-zinc-600/6 blur-md",
        animate: {
          x: [0, 12, 0],
          y: [0, -5, 0],
          opacity: [0.06, 0.1, 0.06]
        },
        transition: {
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8
        }
      })]
    }), /* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsxs("main", {
      children: [/* @__PURE__ */ jsx(Hero, {
        y1,
        y2
      }), /* @__PURE__ */ jsx(Overview, {}), /* @__PURE__ */ jsx(Benefits, {}), /* @__PURE__ */ jsx(Integrations, {}), /* @__PURE__ */ jsx(HowItWorks, {}), /* @__PURE__ */ jsx(TechReq, {}), /* @__PURE__ */ jsx(FAQ, {}), /* @__PURE__ */ jsx(CTA, {})]
    }), /* @__PURE__ */ jsx(Footer, {}), /* @__PURE__ */ jsx(ScrollToTop, {})]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
const SimpleFooter = () => /* @__PURE__ */ jsx("footer", { className: "border-t border-zinc-900/60", children: /* @__PURE__ */ jsx(Container, { className: "py-10", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500", children: [
  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("a", { href: "/", className: "flex items-center gap-2 hover:text-zinc-300 transition-colors duration-200", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: "/favicon.ico",
        alt: "WebToMCP Logo",
        className: "w-6 h-6 transition-transform hover:scale-105"
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "font-bold", children: /* @__PURE__ */ jsx(GradientText, { children: "WebToMCP" }) })
  ] }) }),
  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
    /* @__PURE__ */ jsx("a", { href: "/privacy", className: "hover:text-zinc-300 transition-colors duration-200 cursor-pointer", children: "Privacy" }),
    /* @__PURE__ */ jsx("a", { href: "/terms", className: "hover:text-zinc-300 transition-colors duration-200 cursor-pointer", children: "Terms" }),
    /* @__PURE__ */ jsx("a", { href: "/refund", className: "hover:text-zinc-300 transition-colors duration-200 cursor-pointer", children: "Refund" }),
    /* @__PURE__ */ jsx("a", { href: "mailto:team@web-to-mcp.com", className: "hover:text-zinc-300 transition-colors duration-200 cursor-pointer", children: "Support" })
  ] }),
  /* @__PURE__ */ jsxs("div", { children: [
    "© ",
    (/* @__PURE__ */ new Date()).getFullYear(),
    " WebToMCP"
  ] })
] }) }) });
function meta$5({}) {
  return [{
    title: "Web to MCP for Cursor - Send Website Components Directly to Cursor IDE"
  }, {
    name: "description",
    content: "Integrate website components directly into Cursor IDE using MCP. Step-by-step setup guide for seamless component transfer from any website to your AI coding assistant."
  }, {
    name: "keywords",
    content: "cursor, mcp, model context protocol, website components, ai coding, cursor ide, web development, component transfer"
  }, {
    property: "og:title",
    content: "Web to MCP for Cursor - Send Website Components Directly to Cursor IDE"
  }, {
    property: "og:description",
    content: "Integrate website components directly into Cursor IDE using MCP. Step-by-step setup guide for seamless component transfer."
  }, {
    property: "og:image",
    content: "/og.png"
  }, {
    property: "og:image:width",
    content: "1200"
  }, {
    property: "og:image:height",
    content: "630"
  }, {
    property: "og:image:type",
    content: "image/png"
  }, {
    property: "og:type",
    content: "website"
  }, {
    property: "og:site_name",
    content: "Web to MCP"
  }, {
    property: "og:url",
    content: "https://web-to-mcp.com/cursor"
  }, {
    name: "twitter:card",
    content: "summary_large_image"
  }, {
    name: "twitter:title",
    content: "Web to MCP for Cursor - Send Website Components Directly to Cursor IDE"
  }, {
    name: "twitter:description",
    content: "Integrate website components directly into Cursor IDE using MCP. Step-by-step setup guide for seamless component transfer."
  }, {
    name: "twitter:image",
    content: "/og.png"
  }];
}
const PreviewCard$1 = ({
  label,
  icon,
  children
}) => /* @__PURE__ */ jsxs("div", {
  className: "rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 shadow-lg",
  children: [/* @__PURE__ */ jsxs("div", {
    className: "mb-2 flex items-center gap-2 text-xs text-zinc-400",
    children: [icon, " ", /* @__PURE__ */ jsx("span", {
      children: label
    })]
  }), children]
});
const cursor = UNSAFE_withComponentProps(function CursorPage() {
  const [copiedStep, setCopiedStep] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [isConnected, setIsConnected] = useState(false);
  const {
    login
  } = useAuth();
  const {
    scrollY
  } = useScroll();
  useTransform(scrollY, [0, 800], [0, -80]);
  useTransform(scrollY, [0, 800], [0, -40]);
  const isSelecting = phase === "select";
  const isSending = phase === "send";
  const selectedIndex = 7;
  useEffect(() => {
    trackPageView("Cursor Setup Page", window.location.href);
    trackSetupViewed("cursor");
    const phases = ["idle", "select", "send"];
    let index = 0;
    const id = setInterval(() => {
      index = (index + 1) % phases.length;
      setPhase(phases[index]);
    }, 2e3);
    const connectionInterval = setInterval(() => {
      setIsConnected((prev) => !prev);
    }, 3e3);
    return () => {
      clearInterval(id);
      clearInterval(connectionInterval);
    };
  }, []);
  const handleGoogleLogin = () => {
    login();
  };
  const handleDownloadExtension = () => {
    window.open("https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi", "_blank");
  };
  const copyToClipboard = async (text, step) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(step);
      setTimeout(() => setCopiedStep(null), 2e3);
      if (step === 1) {
        trackMcpConfigCopied("cursor");
      }
      trackButtonClick("copy_button", `cursor_setup_step_${step}`);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  const mcpConfig = `{
  "mcpServers": {
    "web-to-mcp": {
      "url": "https://web-to-mcp.com/mcp/<YOUR_UNIQUE_ID>"
    }
  }
}`;
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden",
    children: [/* @__PURE__ */ jsx(Glow, {}), /* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsxs("div", {
      className: "relative z-10",
      children: [/* @__PURE__ */ jsxs("section", {
        className: "relative overflow-hidden border-b border-zinc-900/60",
        children: [/* @__PURE__ */ jsx(Container, {
          className: "relative pt-20 pb-24 md:pt-28 md:pb-32",
          children: /* @__PURE__ */ jsxs("div", {
            className: "grid items-center gap-10 md:grid-cols-2",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx(FadeIn, {
                children: /* @__PURE__ */ jsxs(Tag, {
                  children: [/* @__PURE__ */ jsxs("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "24",
                    height: "24",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    className: "h-4 w-4 text-emerald-400 mr-2",
                    children: [/* @__PURE__ */ jsx("path", {
                      d: "M9 12l2 2 4-4"
                    }), /* @__PURE__ */ jsx("path", {
                      d: "M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                    })]
                  }), "Cursor Integration Ready"]
                })
              }), /* @__PURE__ */ jsx(FadeIn, {
                delay: 0.06,
                children: /* @__PURE__ */ jsxs("h1", {
                  className: "mt-4 text-4xl md:text-6xl font-semibold tracking-tight",
                  children: ["Send any website component to ", /* @__PURE__ */ jsx(GradientText, {
                    children: "Cursor"
                  }), " in one click"]
                })
              }), /* @__PURE__ */ jsx(FadeIn, {
                delay: 0.12,
                children: /* @__PURE__ */ jsxs("p", {
                  className: "mt-5 text-zinc-400 text-lg leading-7",
                  children: ["No more screenshots, descriptions, or guesswork—just seamless visual handoffs that your AI coding assistant understands perfectly. Bridge the gap between", " ", /* @__PURE__ */ jsx("span", {
                    className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                    children: "design"
                  }), " ", "and", " ", /* @__PURE__ */ jsx("span", {
                    className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                    children: "code"
                  }), "."]
                })
              }), /* @__PURE__ */ jsx(FadeIn, {
                delay: 0.18,
                children: /* @__PURE__ */ jsxs("div", {
                  className: "mt-6 flex flex-col sm:flex-row gap-3",
                  children: [/* @__PURE__ */ jsxs(Button$1, {
                    className: "h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold",
                    onClick: handleGoogleLogin,
                    children: [/* @__PURE__ */ jsx(LogIn, {
                      className: "mr-2 h-5 w-5"
                    }), "Get Started"]
                  }), /* @__PURE__ */ jsxs(Button$1, {
                    variant: "outline",
                    className: "h-11 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
                    onClick: () => setIsModalOpen(true),
                    children: [/* @__PURE__ */ jsx(Zap, {
                      className: "mr-2 h-5 w-5"
                    }), "Watch Demo"]
                  })]
                })
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "relative",
              children: /* @__PURE__ */ jsx(motion.div, {
                initial: {
                  opacity: 0,
                  scale: 0.96
                },
                whileInView: {
                  opacity: 1,
                  scale: 1
                },
                transition: {
                  duration: 0.6,
                  delay: 0.2
                },
                viewport: {
                  once: true
                },
                children: /* @__PURE__ */ jsx("div", {
                  className: "relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-2xl",
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "relative rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-950 p-5",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "mb-4 flex items-center justify-between",
                      children: [/* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2 text-sm text-zinc-400",
                        children: [/* @__PURE__ */ jsx("span", {
                          className: "inline-flex h-2 w-2 rounded-full bg-emerald-400"
                        }), " Live capture"]
                      }), /* @__PURE__ */ jsxs("div", {
                        className: "text-xs text-zinc-500 flex items-center gap-2",
                        children: [/* @__PURE__ */ jsx("svg", {
                          className: "h-4 w-4",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24",
                          children: /* @__PURE__ */ jsx("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M9 12l2 2 4-4m5.34-3.34a9 9 0 11-12.68 0 9 9 0 0112.68 0z"
                          })
                        }), " Direct to Cursor"]
                      })]
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "relative",
                      children: [/* @__PURE__ */ jsx(motion.div, {
                        className: "absolute z-10 h-3.5 w-3.5 rounded-full bg-zinc-100 shadow-[0_0_0_2px_rgba(0,0,0,0.2)]",
                        animate: {
                          top: isSelecting || isSending ? "32%" : "76%",
                          left: isSelecting || isSending ? "18%" : "10%"
                        },
                        transition: {
                          duration: 0.9,
                          ease: "easeInOut"
                        }
                      }), isSelecting && /* @__PURE__ */ jsx(motion.span, {
                        className: "absolute z-0 h-8 w-8 rounded-full border-2 border-zinc-200",
                        style: {
                          top: "calc(32% - 8px)",
                          left: "calc(18% - 8px)"
                        },
                        initial: {
                          opacity: 0.5,
                          scale: 0.7
                        },
                        animate: {
                          opacity: 0,
                          scale: 1.6
                        },
                        transition: {
                          duration: 0.8
                        }
                      }), /* @__PURE__ */ jsx("div", {
                        className: "grid grid-cols-6 gap-2",
                        children: Array.from({
                          length: 18
                        }).map((_, i) => /* @__PURE__ */ jsx("div", {
                          className: `h-16 rounded-md bg-zinc-800/60 ${i % 5 === 0 ? "col-span-2 h-24" : ""} ${(isSelecting || isSending) && i === selectedIndex ? "bg-emerald-500/10 ring-1 ring-emerald-500/30" : i % 7 === 0 ? "bg-emerald-500/10 ring-1 ring-emerald-500/30" : ""}`
                        }, i))
                      })]
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "pointer-events-none",
                      children: [/* @__PURE__ */ jsx(motion.div, {
                        className: "absolute left-4 bottom-4 hidden md:block z-20",
                        animate: {
                          opacity: isSelecting ? 1 : 0,
                          scale: isSelecting ? 1 : 0.98
                        },
                        transition: {
                          duration: 0.35
                        },
                        children: /* @__PURE__ */ jsx(motion.div, {
                          animate: {
                            y: [0, -4, 0]
                          },
                          transition: {
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                          },
                          children: /* @__PURE__ */ jsx(PreviewCard$1, {
                            label: "Component Selected",
                            icon: /* @__PURE__ */ jsx(MousePointer2, {
                              className: "h-4 w-4"
                            }),
                            children: /* @__PURE__ */ jsx("div", {
                              className: "h-16 w-40 rounded-md bg-gradient-to-br from-zinc-800 to-zinc-900"
                            })
                          })
                        })
                      }), /* @__PURE__ */ jsx(motion.div, {
                        className: "absolute right-4 bottom-4 hidden md:block z-20",
                        animate: {
                          opacity: isSending ? 1 : 0,
                          scale: isSending ? 1 : 0.98
                        },
                        transition: {
                          duration: 0.35
                        },
                        children: /* @__PURE__ */ jsx(motion.div, {
                          animate: {
                            y: [0, -4, 0]
                          },
                          transition: {
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                          },
                          children: /* @__PURE__ */ jsx(PreviewCard$1, {
                            label: "Send via WebToMCP",
                            icon: /* @__PURE__ */ jsx(Cable, {
                              className: "h-4 w-4"
                            }),
                            children: /* @__PURE__ */ jsxs("div", {
                              className: "flex items-center gap-2 text-xs text-zinc-400",
                              children: [/* @__PURE__ */ jsx(CursorLogo, {
                                className: "text-zinc-800"
                              }), " Cursor IDE"]
                            })
                          })
                        })
                      })]
                    })]
                  })
                })
              })
            })]
          })
        }), /* @__PURE__ */ jsx(YouTubeModal, {
          isOpen: isModalOpen,
          onClose: () => setIsModalOpen(false),
          videoId: "1LHahVGjp1M"
        })]
      }), /* @__PURE__ */ jsx("section", {
        className: "relative border-b border-zinc-900/60",
        children: /* @__PURE__ */ jsxs(Container, {
          className: "py-16 md:py-24",
          children: [/* @__PURE__ */ jsx(FadeIn, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "mx-auto mb-12 max-w-3xl text-center",
              children: [/* @__PURE__ */ jsxs(Tag, {
                children: [/* @__PURE__ */ jsxs("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "h-4 w-4 text-emerald-400 mr-2",
                  children: [/* @__PURE__ */ jsx("path", {
                    d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                  }), /* @__PURE__ */ jsx("polyline", {
                    points: "3.27,6.96 12,12.01 20.73,6.96"
                  }), /* @__PURE__ */ jsx("line", {
                    x1: "12",
                    y1: "22.08",
                    x2: "12",
                    y2: "12"
                  })]
                }), "Setup Guide"]
              }), /* @__PURE__ */ jsxs("h2", {
                className: "mt-4 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent",
                children: ["From", " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "extension"
                }), " ", "to", " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "integration"
                }), " ", "in", " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "minutes"
                })]
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-4 text-zinc-400 text-lg",
                children: "Follow these step-by-step instructions to connect Web to MCP with Cursor IDE"
              })]
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-12",
            children: [/* @__PURE__ */ jsx(FadeIn, {
              children: /* @__PURE__ */ jsxs("div", {
                className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-4 mb-6",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30",
                    children: /* @__PURE__ */ jsx("span", {
                      className: "text-xl font-bold text-emerald-400",
                      children: "1"
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("h3", {
                      className: "text-xl font-semibold text-zinc-100",
                      children: "Install Chrome Extension"
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-zinc-400",
                      children: "Install the Web to MCP browser extension"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid gap-6 md:grid-cols-3",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "1.1"
                      }), "Install Extension"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: 'Click the "Add to Chrome" button to go directly to the Web to MCP extension page'
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "1.2"
                      }), 'Click "Add to Chrome"']
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Install the extension to your browser"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "1.3"
                      }), "Sign in to your account"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Authenticate with your Google account to get your unique MCP URL"
                    })]
                  })]
                }), /* @__PURE__ */ jsx("div", {
                  className: "mt-6",
                  children: /* @__PURE__ */ jsxs(Button$1, {
                    className: "bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold",
                    onClick: handleDownloadExtension,
                    children: [/* @__PURE__ */ jsx(Chrome, {
                      className: "h-5 w-5 mr-2"
                    }), "Add to Chrome"]
                  })
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.1,
              children: /* @__PURE__ */ jsxs("div", {
                className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-4 mb-6",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30",
                    children: /* @__PURE__ */ jsx("span", {
                      className: "text-xl font-bold text-emerald-400",
                      children: "2"
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("h3", {
                      className: "text-xl font-semibold text-zinc-100",
                      children: "Configure MCP in Cursor"
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-zinc-400",
                      children: "Set up the MCP configuration file in Cursor IDE"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid gap-6 md:grid-cols-3 mb-6",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "2.1"
                      }), "Open Cursor Settings"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Press Ctrl+Shift+J (or Cmd+Shift+J on Mac) to open settings"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "2.2"
                      }), "Navigate to MCP Settings"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Go to Features → Model Context Protocol"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "2.3"
                      }), "Create MCP Configuration"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Choose between project-specific or global configuration"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-4",
                  children: [/* @__PURE__ */ jsx("h4", {
                    className: "text-lg font-semibold text-zinc-100",
                    children: "Project Configuration"
                  }), /* @__PURE__ */ jsxs("p", {
                    className: "text-sm text-zinc-400",
                    children: ["Create ", /* @__PURE__ */ jsx("code", {
                      className: "px-2 py-1 bg-zinc-800 rounded text-emerald-400",
                      children: ".cursor/mcp.json"
                    }), " in your project root:"]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "relative",
                    children: [/* @__PURE__ */ jsx("pre", {
                      className: "bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm overflow-x-auto",
                      children: /* @__PURE__ */ jsx("code", {
                        className: "text-zinc-300",
                        children: mcpConfig
                      })
                    }), /* @__PURE__ */ jsx(Button$1, {
                      size: "sm",
                      variant: "outline",
                      onClick: () => copyToClipboard(mcpConfig, 1),
                      className: "absolute top-2 right-2 border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
                      children: copiedStep === 1 ? /* @__PURE__ */ jsx(CheckCircle, {
                        className: "w-4 h-4"
                      }) : /* @__PURE__ */ jsx(Copy, {
                        className: "w-4 h-4"
                      })
                    })]
                  })]
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.2,
              children: /* @__PURE__ */ jsxs("div", {
                className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-4 mb-6",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30",
                    children: /* @__PURE__ */ jsx("span", {
                      className: "text-xl font-bold text-emerald-400",
                      children: "3"
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("h3", {
                      className: "text-xl font-semibold text-zinc-100",
                      children: "Replace MCP URL"
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-zinc-400",
                      children: "Update the configuration with your actual MCP URL"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid gap-6 md:grid-cols-3",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "3.1"
                      }), "Get Your MCP URL"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Sign in to your account and copy your unique MCP URL from the dashboard"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "3.2"
                      }), "Add to Cursor"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Add your MCP URL to the Cursor configuration"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "3.3"
                      }), "Cursor detects new tools"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Cursor will automatically detect the new MCP tool and you can start using it"
                    })]
                  })]
                }), /* @__PURE__ */ jsx("div", {
                  className: "mt-6",
                  children: /* @__PURE__ */ jsxs(Button$1, {
                    className: "bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold",
                    onClick: handleGoogleLogin,
                    children: [/* @__PURE__ */ jsx(LogIn, {
                      className: "h-5 w-5 mr-2"
                    }), "Get MCP URL"]
                  })
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.3,
              children: /* @__PURE__ */ jsxs("div", {
                className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-4 mb-6",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30",
                    children: /* @__PURE__ */ jsx("span", {
                      className: "text-xl font-bold text-emerald-400",
                      children: "4"
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("h3", {
                      className: "text-xl font-semibold text-zinc-100",
                      children: "Start Capturing Components"
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-zinc-400",
                      children: "Navigate to any website and start sending components to Cursor"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid gap-6 md:grid-cols-4",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "4.1"
                      }), "Navigate to Website"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Go to any website you want to extract components from"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "4.2"
                      }), "Click Extension Icon"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Click the Web to MCP extension icon in your browser"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "4.3"
                      }), "Select Component"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Click on any element you want to capture and copy its reference id"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "4.4"
                      }), "Refer to the element in Cursor"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "You can refer to the element inside Cursor chat using the reference id"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2 text-emerald-400",
                    children: [/* @__PURE__ */ jsx(CheckCircle, {
                      className: "h-5 w-5"
                    }), /* @__PURE__ */ jsx("span", {
                      className: "font-semibold",
                      children: "[SUCCESS]"
                    })]
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-sm text-emerald-300 mt-1",
                    children: "Your MCP server is now connected! Components will be sent directly to Cursor IDE."
                  })]
                })]
              })
            })]
          })]
        })
      }), /* @__PURE__ */ jsx("section", {
        className: "relative border-b border-zinc-900/60",
        children: /* @__PURE__ */ jsxs(Container, {
          className: "py-16 md:py-24",
          children: [/* @__PURE__ */ jsx(FadeIn, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "mx-auto max-w-3xl text-center",
              children: [/* @__PURE__ */ jsxs(Tag, {
                children: [/* @__PURE__ */ jsxs("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "h-4 w-4 text-emerald-400 mr-2",
                  children: [/* @__PURE__ */ jsx("path", {
                    d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
                  }), /* @__PURE__ */ jsx("path", {
                    d: "M5 3v4"
                  }), /* @__PURE__ */ jsx("path", {
                    d: "M19 17v4"
                  }), /* @__PURE__ */ jsx("path", {
                    d: "M3 5h4"
                  }), /* @__PURE__ */ jsx("path", {
                    d: "M17 19h4"
                  })]
                }), "Why Web To MCP for Cursor?"]
              }), /* @__PURE__ */ jsxs("h2", {
                className: "mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent",
                children: ["The missing link between", " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "inspiration"
                }), " ", "and", " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "implementation"
                })]
              })]
            })
          }), /* @__PURE__ */ jsx(FadeIn, {
            delay: 0.2,
            children: /* @__PURE__ */ jsxs("div", {
              className: "mt-16 relative",
              children: [/* @__PURE__ */ jsx("div", {
                className: "absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-emerald-500/10 to-emerald-500/5 rounded-3xl blur-3xl"
              }), /* @__PURE__ */ jsxs("div", {
                className: "relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center",
                children: [/* @__PURE__ */ jsx(motion.div, {
                  className: "relative",
                  animate: {
                    scale: isConnected ? 0.98 : 1,
                    opacity: isConnected ? 0.8 : 1
                  },
                  transition: {
                    duration: 0.8,
                    ease: "easeInOut"
                  },
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 relative overflow-hidden",
                    children: [/* @__PURE__ */ jsx("div", {
                      className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-3 mb-4",
                      children: [/* @__PURE__ */ jsx("div", {
                        className: "p-2 rounded-lg bg-blue-500/10 border border-blue-500/20",
                        children: /* @__PURE__ */ jsx(Eye, {
                          className: "h-5 w-5 text-blue-400"
                        })
                      }), /* @__PURE__ */ jsxs("div", {
                        children: [/* @__PURE__ */ jsx("h3", {
                          className: "font-semibold text-zinc-100",
                          children: "Inspiration"
                        }), /* @__PURE__ */ jsx("p", {
                          className: "text-xs text-zinc-400",
                          children: "Beautiful design you found"
                        })]
                      })]
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "relative rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 mb-4",
                      children: [/* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2 mb-3",
                        children: [/* @__PURE__ */ jsx("div", {
                          className: "w-2 h-2 rounded-full bg-red-500"
                        }), /* @__PURE__ */ jsx("div", {
                          className: "w-2 h-2 rounded-full bg-yellow-500"
                        }), /* @__PURE__ */ jsx("div", {
                          className: "w-2 h-2 rounded-full bg-green-500"
                        })]
                      }), /* @__PURE__ */ jsxs("div", {
                        className: "space-y-2",
                        children: [/* @__PURE__ */ jsx("div", {
                          className: "h-4 bg-zinc-600 rounded w-3/4"
                        }), /* @__PURE__ */ jsx("div", {
                          className: "h-3 bg-zinc-700 rounded w-1/2"
                        }), /* @__PURE__ */ jsx("div", {
                          className: "h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded"
                        })]
                      })]
                    }), /* @__PURE__ */ jsx("div", {
                      className: "text-center",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "text-xs text-zinc-400",
                        children: '"How do I explain this to Cursor?"'
                      })
                    })]
                  })
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-col items-center relative",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "hidden lg:block absolute left-0 top-1/2 w-full",
                    children: /* @__PURE__ */ jsx(motion.div, {
                      className: "h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full",
                      animate: {
                        opacity: isConnected ? [0.3, 1, 0.3] : 0.3,
                        scaleX: isConnected ? [0.8, 1.2, 0.8] : 0.8
                      },
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    })
                  }), /* @__PURE__ */ jsx(motion.div, {
                    className: "relative z-10 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 p-6 shadow-2xl",
                    animate: {
                      scale: isConnected ? [1, 1.1, 1] : 1,
                      boxShadow: isConnected ? ["0 0 0 0 rgba(16, 185, 129, 0.3)", "0 0 0 20px rgba(16, 185, 129, 0)", "0 0 0 0 rgba(16, 185, 129, 0)"] : "0 0 0 0 rgba(16, 185, 129, 0)"
                    },
                    transition: {
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    children: /* @__PURE__ */ jsxs("div", {
                      className: "text-center",
                      children: [/* @__PURE__ */ jsx(Zap, {
                        className: "h-8 w-8 text-emerald-400 mx-auto mb-2"
                      }), /* @__PURE__ */ jsx("h3", {
                        className: "font-bold text-emerald-300 text-lg",
                        children: "Web To MCP"
                      }), /* @__PURE__ */ jsx("p", {
                        className: "text-xs text-emerald-400/80",
                        children: "Perfect Bridge"
                      })]
                    })
                  }), [...Array(8)].map((_, i) => /* @__PURE__ */ jsx(motion.div, {
                    className: "absolute w-1 h-1 bg-emerald-400 rounded-full",
                    style: {
                      left: `${30 + Math.cos(i * 0.785) * 40}%`,
                      top: `${50 + Math.sin(i * 0.785) * 40}%`
                    },
                    animate: {
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    },
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }
                  }, i))]
                }), /* @__PURE__ */ jsx(motion.div, {
                  className: "relative",
                  animate: {
                    scale: isConnected ? 1.02 : 1,
                    opacity: isConnected ? 1 : 0.9
                  },
                  transition: {
                    duration: 0.8,
                    ease: "easeInOut"
                  },
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 relative overflow-hidden",
                    children: [/* @__PURE__ */ jsx("div", {
                      className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400"
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-3 mb-4",
                      children: [/* @__PURE__ */ jsx("div", {
                        className: "p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20",
                        children: /* @__PURE__ */ jsx(Code, {
                          className: "h-5 w-5 text-emerald-400"
                        })
                      }), /* @__PURE__ */ jsxs("div", {
                        children: [/* @__PURE__ */ jsx("h3", {
                          className: "font-semibold text-zinc-100",
                          children: "Implementation"
                        }), /* @__PURE__ */ jsx("p", {
                          className: "text-xs text-zinc-400",
                          children: "Perfect code output in Cursor"
                        })]
                      })]
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "relative rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 mb-4 font-mono text-xs",
                      children: [/* @__PURE__ */ jsx("div", {
                        className: "text-emerald-400",
                        children: "// Generated in Cursor"
                      }), /* @__PURE__ */ jsx("div", {
                        className: "text-blue-400",
                        children: "<Button"
                      }), /* @__PURE__ */ jsx("div", {
                        className: "text-zinc-300 ml-2",
                        children: 'className="bg-gradient-to-r'
                      }), /* @__PURE__ */ jsx("div", {
                        className: "text-zinc-300 ml-2",
                        children: 'from-purple-600 to-blue-600"'
                      }), /* @__PURE__ */ jsx("div", {
                        className: "text-blue-400",
                        children: ">"
                      }), /* @__PURE__ */ jsx("div", {
                        className: "text-zinc-300 ml-2",
                        children: "Click me"
                      }), /* @__PURE__ */ jsx("div", {
                        className: "text-blue-400",
                        children: "</Button>"
                      })]
                    }), /* @__PURE__ */ jsx("div", {
                      className: "text-center",
                      children: /* @__PURE__ */ jsx(motion.span, {
                        className: "text-xs text-emerald-400",
                        animate: {
                          opacity: isConnected ? [0.6, 1, 0.6] : 0.6
                        },
                        transition: {
                          duration: 2,
                          repeat: Infinity
                        },
                        children: "✓ Pixel-perfect match in Cursor"
                      })
                    })]
                  })
                })]
              }), /* @__PURE__ */ jsx(FadeIn, {
                delay: 0.4,
                children: /* @__PURE__ */ jsx("div", {
                  className: "mt-12 text-center",
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "inline-flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-700/50 bg-zinc-800/40",
                    children: [/* @__PURE__ */ jsx("span", {
                      className: "text-zinc-400",
                      children: "Works with any website, perfectly integrated with Cursor IDE"
                    }), /* @__PURE__ */ jsx(ArrowRight, {
                      className: "h-4 w-4 text-emerald-400"
                    }), /* @__PURE__ */ jsx("span", {
                      className: "font-semibold text-emerald-400",
                      children: "30 seconds to perfect handoff"
                    })]
                  })
                })
              })]
            })
          })]
        })
      }), /* @__PURE__ */ jsx("section", {
        id: "how",
        className: "relative border-b border-zinc-900/60",
        children: /* @__PURE__ */ jsxs(Container, {
          className: "py-16 md:py-24",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mx-auto mb-10 max-w-2xl text-center",
            children: [/* @__PURE__ */ jsxs(Tag, {
              children: [/* @__PURE__ */ jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "h-4 w-4 text-emerald-400 mr-2",
                children: /* @__PURE__ */ jsx("path", {
                  d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                })
              }), "How it works"]
            }), /* @__PURE__ */ jsxs("h2", {
              className: "mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent",
              children: ["From", " ", /* @__PURE__ */ jsx("span", {
                className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                children: "inspiration"
              }), " ", "to", " ", /* @__PURE__ */ jsx("span", {
                className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                children: "implementation"
              }), " ", "in", " ", /* @__PURE__ */ jsx("span", {
                className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                children: "30 seconds"
              }), "."]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "grid gap-6 md:grid-cols-3",
            children: [/* @__PURE__ */ jsx(Step, {
              index: 1,
              title: "Authenticate with Google",
              iconType: "google-auth",
              children: "Sign in and you're set."
            }), /* @__PURE__ */ jsx(Step, {
              index: 2,
              title: "Install the Chrome extension",
              iconType: "chrome-extension",
              children: "Add it from the Web Store."
            }), /* @__PURE__ */ jsx(Step, {
              index: 3,
              title: "Navigate to any website",
              iconType: "website-nav",
              children: "Open the page with the component you want."
            }), /* @__PURE__ */ jsx(Step, {
              index: 4,
              title: "Click the extension icon",
              iconType: "extension-click",
              children: "Activate component selection mode."
            }), /* @__PURE__ */ jsx(Step, {
              index: 5,
              title: "Select the component",
              iconType: "component-select",
              children: "We capture it exactly as rendered."
            }), /* @__PURE__ */ jsx(Step, {
              index: 6,
              title: "Send to Cursor IDE",
              iconType: "send-to-ai",
              children: "Delivered via MCP to Cursor for perfect integration."
            })]
          })]
        })
      }), /* @__PURE__ */ jsx("section", {
        className: "relative border-b border-zinc-900/60",
        children: /* @__PURE__ */ jsxs(Container, {
          className: "py-16 md:py-24",
          children: [/* @__PURE__ */ jsx(FadeIn, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "mx-auto mb-16 max-w-3xl text-center",
              children: [/* @__PURE__ */ jsxs(Tag, {
                children: [/* @__PURE__ */ jsxs("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "h-4 w-4 text-emerald-400 mr-2",
                  children: [/* @__PURE__ */ jsx("path", {
                    d: "M9 12l2 2 4-4"
                  }), /* @__PURE__ */ jsx("path", {
                    d: "M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                  })]
                }), "Cursor Benefits"]
              }), /* @__PURE__ */ jsxs("h2", {
                className: "mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent",
                children: ["Supercharge your", " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "Cursor"
                }), " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "workflow"
                })]
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-3 text-zinc-400 text-lg leading-relaxed",
                children: "Stop describing components. Send pixel-perfect references that Cursor understands instantly."
              })]
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
            children: [/* @__PURE__ */ jsx(FadeIn, {
              delay: 0.1,
              children: /* @__PURE__ */ jsxs(motion.div, {
                className: "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
                whileHover: {
                  scale: 1.02
                },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                children: [/* @__PURE__ */ jsx("div", {
                  className: "inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300",
                  children: /* @__PURE__ */ jsx(Monitor, {
                    className: "h-6 w-6"
                  })
                }), /* @__PURE__ */ jsx("h4", {
                  className: "text-lg font-semibold text-zinc-100 mb-2",
                  children: "Perfect Visual Context"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-zinc-400 leading-relaxed",
                  children: "Send actual website components to Cursor instead of describing them. Your AI assistant gets pixel-perfect context every time."
                }), /* @__PURE__ */ jsx("div", {
                  className: "absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.2,
              children: /* @__PURE__ */ jsxs(motion.div, {
                className: "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
                whileHover: {
                  scale: 1.02
                },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                children: [/* @__PURE__ */ jsx("div", {
                  className: "inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300",
                  children: /* @__PURE__ */ jsx(Zap, {
                    className: "h-6 w-6"
                  })
                }), /* @__PURE__ */ jsx("h4", {
                  className: "text-lg font-semibold text-zinc-100 mb-2",
                  children: "Native MCP Integration"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-zinc-400 leading-relaxed",
                  children: "Built specifically for Cursor's Model Context Protocol. Seamless handoffs that work perfectly with your coding workflow."
                }), /* @__PURE__ */ jsx("div", {
                  className: "absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.3,
              children: /* @__PURE__ */ jsxs(motion.div, {
                className: "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
                whileHover: {
                  scale: 1.02
                },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                children: [/* @__PURE__ */ jsx("div", {
                  className: "inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300",
                  children: /* @__PURE__ */ jsx(Globe, {
                    className: "h-6 w-6"
                  })
                }), /* @__PURE__ */ jsx("h4", {
                  className: "text-lg font-semibold text-zinc-100 mb-2",
                  children: "Any Website, Any Framework"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-zinc-400 leading-relaxed",
                  children: "Capture components from any website - design inspiration, competitor analysis, or reference implementations for Cursor."
                }), /* @__PURE__ */ jsx("div", {
                  className: "absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.4,
              children: /* @__PURE__ */ jsxs(motion.div, {
                className: "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
                whileHover: {
                  scale: 1.02
                },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                children: [/* @__PURE__ */ jsx("div", {
                  className: "inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300",
                  children: /* @__PURE__ */ jsx(CheckCircle, {
                    className: "h-6 w-6"
                  })
                }), /* @__PURE__ */ jsx("h4", {
                  className: "text-lg font-semibold text-zinc-100 mb-2",
                  children: "Eliminate Back-and-Forth"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-zinc-400 leading-relaxed",
                  children: 'No more "make it look like this" conversations. Send precise references and get exact implementations in Cursor.'
                }), /* @__PURE__ */ jsx("div", {
                  className: "absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.5,
              children: /* @__PURE__ */ jsxs(motion.div, {
                className: "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
                whileHover: {
                  scale: 1.02
                },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                children: [/* @__PURE__ */ jsx("div", {
                  className: "inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300",
                  children: /* @__PURE__ */ jsx(ArrowRight, {
                    className: "h-6 w-6"
                  })
                }), /* @__PURE__ */ jsx("h4", {
                  className: "text-lg font-semibold text-zinc-100 mb-2",
                  children: "Lightning Fast Development"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-zinc-400 leading-relaxed",
                  children: "From component selection to Cursor implementation in under 30 seconds. Speed up your development cycle dramatically."
                }), /* @__PURE__ */ jsx("div", {
                  className: "absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.6,
              children: /* @__PURE__ */ jsxs(motion.div, {
                className: "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
                whileHover: {
                  scale: 1.02
                },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                children: [/* @__PURE__ */ jsx("div", {
                  className: "inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300",
                  children: /* @__PURE__ */ jsx(Cpu, {
                    className: "h-6 w-6"
                  })
                }), /* @__PURE__ */ jsx("h4", {
                  className: "text-lg font-semibold text-zinc-100 mb-2",
                  children: "Smart Component Analysis"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-zinc-400 leading-relaxed",
                  children: "Automatically captures CSS, structure, and context. Cursor receives comprehensive component data for accurate recreation."
                }), /* @__PURE__ */ jsx("div", {
                  className: "absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                })]
              })
            })]
          })]
        })
      }), /* @__PURE__ */ jsx(TechReq, {}), /* @__PURE__ */ jsx("section", {
        className: "relative border-b border-zinc-900/60",
        children: /* @__PURE__ */ jsxs(Container, {
          className: "py-16 md:py-24",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mx-auto mb-12 max-w-2xl text-center",
            children: [/* @__PURE__ */ jsxs(Tag, {
              children: [/* @__PURE__ */ jsxs("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "h-4 w-4 text-emerald-400 mr-2",
                children: [/* @__PURE__ */ jsx("circle", {
                  cx: "12",
                  cy: "12",
                  r: "10"
                }), /* @__PURE__ */ jsx("path", {
                  d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                }), /* @__PURE__ */ jsx("path", {
                  d: "M12 17h.01"
                })]
              }), "FAQ"]
            }), /* @__PURE__ */ jsxs("h2", {
              className: "mt-4 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent",
              children: ["Cursor-specific", " ", /* @__PURE__ */ jsx("span", {
                className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                children: "questions"
              }), " ", /* @__PURE__ */ jsx("span", {
                className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                children: "answered"
              }), "."]
            })]
          }), /* @__PURE__ */ jsxs(Accordion, {
            type: "single",
            collapsible: true,
            className: "w-full max-w-3xl mx-auto",
            children: [/* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-1",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "How does Web to MCP integrate with Cursor IDE?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "Web to MCP connects directly to Cursor through the Model Context Protocol (MCP). Once configured, captured components are automatically available in your Cursor chat context, allowing the AI to understand and recreate them perfectly."
              })]
            }), /* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-2",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "Do I need to install anything in Cursor itself?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "No additional Cursor extensions needed. You only need to add a simple MCP configuration file to enable the connection. Cursor natively supports MCP, so it will automatically detect and use the Web to MCP tools."
              })]
            }), /* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-3",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "What data does Cursor receive from captured components?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "Cursor receives the component's DOM structure, computed CSS styles, screenshot, and contextual information. This comprehensive data allows Cursor's AI to understand both the visual appearance and technical implementation details."
              })]
            }), /* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-4",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "Can I use this with Cursor's Composer feature?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "Absolutely! Web to MCP works seamlessly with Cursor Composer. You can capture components and immediately reference them in Composer to build entire features or pages using the captured designs as references."
              })]
            }), /* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-5",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "How accurate are the component recreations in Cursor?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "With pixel-perfect references, Cursor can achieve remarkable accuracy. The quality depends on the complexity of the component and your prompting, but users typically see 90%+ visual fidelity on first generation, with easy refinements for perfect matches."
              })]
            }), /* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-6",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "Does this work with both Cursor's free and Pro plans?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "Yes, Web to MCP works with all Cursor plans. The MCP functionality is built into Cursor itself. However, Pro plans will give you more AI usage for generating components from the captured references."
              })]
            }), /* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-7",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "Can I capture and use multiple components in one Cursor session?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "Yes! You can capture multiple components and reference them all within the same Cursor chat. Each component gets a unique reference ID, making it easy to build complex UIs by combining multiple captured elements."
              })]
            })]
          })]
        })
      }), /* @__PURE__ */ jsx("section", {
        className: "relative",
        children: /* @__PURE__ */ jsxs(Container, {
          className: "py-16 md:py-24 text-center",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400",
            children: [/* @__PURE__ */ jsx(Zap, {
              className: "h-4 w-4 text-emerald-400"
            }), " Stop explaining components to Cursor. Send them directly."]
          }), /* @__PURE__ */ jsxs("h3", {
            className: "mt-4 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent",
            children: ["Transform your", " ", /* @__PURE__ */ jsx("span", {
              className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
              children: "Cursor"
            }), " ", /* @__PURE__ */ jsx("span", {
              className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
              children: "workflow"
            }), " ", "in", " ", /* @__PURE__ */ jsx("span", {
              className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
              children: "one click"
            }), "."]
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-3 text-zinc-400",
            children: "Add the extension and start coding with perfect visual context in Cursor IDE."
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-6 flex flex-col sm:flex-row justify-center gap-3",
            children: [/* @__PURE__ */ jsxs(Button$1, {
              className: "h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold",
              onClick: handleGoogleLogin,
              children: [/* @__PURE__ */ jsx(LogIn, {
                className: "mr-2 h-5 w-5"
              }), "Get Started for Free"]
            }), /* @__PURE__ */ jsxs(Button$1, {
              variant: "outline",
              className: "h-11 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
              onClick: handleDownloadExtension,
              children: [/* @__PURE__ */ jsx(Chrome, {
                className: "mr-2 h-5 w-5"
              }), "Add to Chrome"]
            })]
          })]
        })
      }), /* @__PURE__ */ jsx(SimpleFooter, {})]
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: cursor,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
function meta$4({}) {
  return [{
    title: "Web to MCP for Claude Code - Send Website Components Directly to Claude Code"
  }, {
    name: "description",
    content: "Integrate website components directly into Claude Code using MCP. Step-by-step setup guide for seamless component transfer from any website to your AI coding assistant."
  }, {
    name: "keywords",
    content: "claude code, mcp, model context protocol, website components, ai coding, claude, web development, component transfer"
  }, {
    property: "og:title",
    content: "Web to MCP for Claude Code - Send Website Components Directly to Claude Code"
  }, {
    property: "og:description",
    content: "Integrate website components directly into Claude Code using MCP. Step-by-step setup guide for seamless component transfer."
  }, {
    property: "og:image",
    content: "/og.png"
  }, {
    property: "og:image:width",
    content: "1200"
  }, {
    property: "og:image:height",
    content: "630"
  }, {
    property: "og:image:type",
    content: "image/png"
  }, {
    property: "og:type",
    content: "website"
  }, {
    property: "og:site_name",
    content: "Web to MCP"
  }, {
    property: "og:url",
    content: "https://web-to-mcp.com/claude-code"
  }, {
    name: "twitter:card",
    content: "summary_large_image"
  }, {
    name: "twitter:title",
    content: "Web to MCP for Claude Code - Send Website Components Directly to Claude Code"
  }, {
    name: "twitter:description",
    content: "Integrate website components directly into Claude Code using MCP. Step-by-step setup guide for seamless component transfer."
  }, {
    name: "twitter:image",
    content: "/og.png"
  }];
}
const PreviewCard = ({
  label,
  icon,
  children
}) => /* @__PURE__ */ jsxs("div", {
  className: "rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 shadow-lg",
  children: [/* @__PURE__ */ jsxs("div", {
    className: "mb-2 flex items-center gap-2 text-xs text-zinc-400",
    children: [icon, " ", /* @__PURE__ */ jsx("span", {
      children: label
    })]
  }), children]
});
const claudeCode = UNSAFE_withComponentProps(function ClaudeCodePage() {
  const [copiedStep, setCopiedStep] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [isConnected, setIsConnected] = useState(false);
  const {
    login
  } = useAuth();
  const {
    scrollY
  } = useScroll();
  useTransform(scrollY, [0, 800], [0, -80]);
  useTransform(scrollY, [0, 800], [0, -40]);
  const isSelecting = phase === "select";
  const isSending = phase === "send";
  const selectedIndex = 7;
  useEffect(() => {
    trackPageView("Claude Code Setup Page", window.location.href);
    trackSetupViewed("claude");
    const phases = ["idle", "select", "send"];
    let index = 0;
    const id = setInterval(() => {
      index = (index + 1) % phases.length;
      setPhase(phases[index]);
    }, 2e3);
    const connectionInterval = setInterval(() => {
      setIsConnected((prev) => !prev);
    }, 3e3);
    return () => {
      clearInterval(id);
      clearInterval(connectionInterval);
    };
  }, []);
  const handleGoogleLogin = () => {
    login();
  };
  const handleDownloadExtension = () => {
    window.open("https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi", "_blank");
  };
  const copyToClipboard = async (text, step) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(step);
      setTimeout(() => setCopiedStep(null), 2e3);
      if (step === 1) {
        trackMcpConfigCopied("claude");
      }
      trackButtonClick("copy_button", `claude_setup_step_${step}`);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden",
    children: [/* @__PURE__ */ jsx(Glow, {}), /* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsxs("div", {
      className: "relative z-10",
      children: [/* @__PURE__ */ jsxs("section", {
        className: "relative overflow-hidden border-b border-zinc-900/60",
        children: [/* @__PURE__ */ jsx(Container, {
          className: "relative pt-20 pb-24 md:pt-28 md:pb-32",
          children: /* @__PURE__ */ jsxs("div", {
            className: "grid items-center gap-10 md:grid-cols-2",
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx(FadeIn, {
                children: /* @__PURE__ */ jsxs(Tag, {
                  children: [/* @__PURE__ */ jsxs("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "24",
                    height: "24",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    className: "h-4 w-4 text-emerald-400 mr-2",
                    children: [/* @__PURE__ */ jsx("path", {
                      d: "M9 12l2 2 4-4"
                    }), /* @__PURE__ */ jsx("path", {
                      d: "M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                    })]
                  }), "Claude Code Integration Ready"]
                })
              }), /* @__PURE__ */ jsx(FadeIn, {
                delay: 0.06,
                children: /* @__PURE__ */ jsxs("h1", {
                  className: "mt-4 text-4xl md:text-6xl font-semibold tracking-tight",
                  children: ["Send any website component to ", /* @__PURE__ */ jsx(GradientText, {
                    children: "Claude Code"
                  }), " in one click"]
                })
              }), /* @__PURE__ */ jsx(FadeIn, {
                delay: 0.12,
                children: /* @__PURE__ */ jsxs("p", {
                  className: "mt-5 text-zinc-400 text-lg leading-7",
                  children: ["No more screenshots, descriptions, or guesswork—just seamless visual handoffs that your AI coding assistant understands perfectly. Bridge the gap between", " ", /* @__PURE__ */ jsx("span", {
                    className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                    children: "design"
                  }), " ", "and", " ", /* @__PURE__ */ jsx("span", {
                    className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                    children: "code"
                  }), "."]
                })
              }), /* @__PURE__ */ jsx(FadeIn, {
                delay: 0.18,
                children: /* @__PURE__ */ jsxs("div", {
                  className: "mt-6 flex flex-col sm:flex-row gap-3",
                  children: [/* @__PURE__ */ jsxs(Button$1, {
                    className: "h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold",
                    onClick: handleGoogleLogin,
                    children: [/* @__PURE__ */ jsx(LogIn, {
                      className: "mr-2 h-5 w-5"
                    }), "Get Started"]
                  }), /* @__PURE__ */ jsxs(Button$1, {
                    variant: "outline",
                    className: "h-11 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
                    onClick: () => setIsModalOpen(true),
                    children: [/* @__PURE__ */ jsx(Zap, {
                      className: "mr-2 h-5 w-5"
                    }), "Watch Demo"]
                  })]
                })
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "relative",
              children: /* @__PURE__ */ jsx(motion.div, {
                initial: {
                  opacity: 0,
                  scale: 0.96
                },
                whileInView: {
                  opacity: 1,
                  scale: 1
                },
                transition: {
                  duration: 0.6,
                  delay: 0.2
                },
                viewport: {
                  once: true
                },
                children: /* @__PURE__ */ jsx("div", {
                  className: "relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-2xl",
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "relative rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-950 p-5",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "mb-4 flex items-center justify-between",
                      children: [/* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2 text-sm text-zinc-400",
                        children: [/* @__PURE__ */ jsx("span", {
                          className: "inline-flex h-2 w-2 rounded-full bg-emerald-400"
                        }), " Live capture"]
                      }), /* @__PURE__ */ jsxs("div", {
                        className: "text-xs text-zinc-500 flex items-center gap-2",
                        children: [/* @__PURE__ */ jsx("svg", {
                          className: "h-4 w-4",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24",
                          children: /* @__PURE__ */ jsx("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M9 12l2 2 4-4m5.34-3.34a9 9 0 11-12.68 0 9 9 0 0112.68 0z"
                          })
                        }), " Direct to Claude Code"]
                      })]
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "relative",
                      children: [/* @__PURE__ */ jsx(motion.div, {
                        className: "absolute z-10 h-3.5 w-3.5 rounded-full bg-zinc-100 shadow-[0_0_0_2px_rgba(0,0,0,0.2)]",
                        animate: {
                          top: isSelecting || isSending ? "32%" : "76%",
                          left: isSelecting || isSending ? "18%" : "10%"
                        },
                        transition: {
                          duration: 0.9,
                          ease: "easeInOut"
                        }
                      }), isSelecting && /* @__PURE__ */ jsx(motion.span, {
                        className: "absolute z-0 h-8 w-8 rounded-full border-2 border-zinc-200",
                        style: {
                          top: "calc(32% - 8px)",
                          left: "calc(18% - 8px)"
                        },
                        initial: {
                          opacity: 0.5,
                          scale: 0.7
                        },
                        animate: {
                          opacity: 0,
                          scale: 1.6
                        },
                        transition: {
                          duration: 0.8
                        }
                      }), /* @__PURE__ */ jsx("div", {
                        className: "grid grid-cols-6 gap-2",
                        children: Array.from({
                          length: 18
                        }).map((_, i) => /* @__PURE__ */ jsx("div", {
                          className: `h-16 rounded-md bg-zinc-800/60 ${i % 5 === 0 ? "col-span-2 h-24" : ""} ${(isSelecting || isSending) && i === selectedIndex ? "bg-emerald-500/10 ring-1 ring-emerald-500/30" : i % 7 === 0 ? "bg-emerald-500/10 ring-1 ring-emerald-500/30" : ""}`
                        }, i))
                      })]
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "pointer-events-none",
                      children: [/* @__PURE__ */ jsx(motion.div, {
                        className: "absolute left-4 bottom-4 hidden md:block z-20",
                        animate: {
                          opacity: isSelecting ? 1 : 0,
                          scale: isSelecting ? 1 : 0.98
                        },
                        transition: {
                          duration: 0.35
                        },
                        children: /* @__PURE__ */ jsx(motion.div, {
                          animate: {
                            y: [0, -4, 0]
                          },
                          transition: {
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                          },
                          children: /* @__PURE__ */ jsx(PreviewCard, {
                            label: "Component Selected",
                            icon: /* @__PURE__ */ jsx(MousePointer2, {
                              className: "h-4 w-4"
                            }),
                            children: /* @__PURE__ */ jsx("div", {
                              className: "h-16 w-40 rounded-md bg-gradient-to-br from-zinc-800 to-zinc-900"
                            })
                          })
                        })
                      }), /* @__PURE__ */ jsx(motion.div, {
                        className: "absolute right-4 bottom-4 hidden md:block z-20",
                        animate: {
                          opacity: isSending ? 1 : 0,
                          scale: isSending ? 1 : 0.98
                        },
                        transition: {
                          duration: 0.35
                        },
                        children: /* @__PURE__ */ jsx(motion.div, {
                          animate: {
                            y: [0, -4, 0]
                          },
                          transition: {
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                          },
                          children: /* @__PURE__ */ jsx(PreviewCard, {
                            label: "Send via WebToMCP",
                            icon: /* @__PURE__ */ jsx(Cable, {
                              className: "h-4 w-4"
                            }),
                            children: /* @__PURE__ */ jsxs("div", {
                              className: "flex items-center gap-2 text-xs text-zinc-400",
                              children: [/* @__PURE__ */ jsx(Terminal, {
                                className: "h-4 w-4 text-zinc-800"
                              }), " Claude Code"]
                            })
                          })
                        })
                      })]
                    })]
                  })
                })
              })
            })]
          })
        }), /* @__PURE__ */ jsx(YouTubeModal, {
          isOpen: isModalOpen,
          onClose: () => setIsModalOpen(false),
          videoId: "1LHahVGjp1M"
        })]
      }), /* @__PURE__ */ jsx("section", {
        className: "relative border-b border-zinc-900/60",
        children: /* @__PURE__ */ jsxs(Container, {
          className: "py-16 md:py-24",
          children: [/* @__PURE__ */ jsx(FadeIn, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "mx-auto mb-12 max-w-3xl text-center",
              children: [/* @__PURE__ */ jsxs(Tag, {
                children: [/* @__PURE__ */ jsxs("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "h-4 w-4 text-emerald-400 mr-2",
                  children: [/* @__PURE__ */ jsx("path", {
                    d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                  }), /* @__PURE__ */ jsx("polyline", {
                    points: "3.27,6.96 12,12.01 20.73,6.96"
                  }), /* @__PURE__ */ jsx("line", {
                    x1: "12",
                    y1: "22.08",
                    x2: "12",
                    y2: "12"
                  })]
                }), "Setup Guide"]
              }), /* @__PURE__ */ jsxs("h2", {
                className: "mt-4 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent",
                children: ["From", " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "extension"
                }), " ", "to", " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "integration"
                }), " ", "in", " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "minutes"
                })]
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-4 text-zinc-400 text-lg",
                children: "Follow these step-by-step instructions to connect Web to MCP with Claude Code"
              })]
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-12",
            children: [/* @__PURE__ */ jsx(FadeIn, {
              children: /* @__PURE__ */ jsxs("div", {
                className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-4 mb-6",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30",
                    children: /* @__PURE__ */ jsx("span", {
                      className: "text-xl font-bold text-yellow-400",
                      children: "1"
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("h3", {
                      className: "text-xl font-semibold text-zinc-100",
                      children: "Install Chrome Extension"
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-zinc-400",
                      children: "Install the Web to MCP browser extension"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid gap-6 md:grid-cols-3",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "1.1"
                      }), "Install Extension"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: 'Click the "Add to Chrome" button to go directly to the Web to MCP extension page'
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "1.2"
                      }), 'Click "Add to Chrome"']
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Install the extension to your browser"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "1.3"
                      }), "Sign in to your account"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Authenticate with your Google account to get your unique MCP URL"
                    })]
                  })]
                }), /* @__PURE__ */ jsx("div", {
                  className: "mt-6",
                  children: /* @__PURE__ */ jsxs(Button$1, {
                    className: "bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold",
                    onClick: handleDownloadExtension,
                    children: [/* @__PURE__ */ jsx(Chrome, {
                      className: "h-5 w-5 mr-2"
                    }), "Add to Chrome"]
                  })
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.1,
              children: /* @__PURE__ */ jsxs("div", {
                className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-4 mb-6",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30",
                    children: /* @__PURE__ */ jsx("span", {
                      className: "text-xl font-bold text-yellow-400",
                      children: "2"
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("h3", {
                      className: "text-xl font-semibold text-zinc-100",
                      children: "Configure MCP in Claude Code"
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-zinc-400",
                      children: "Set up the MCP configuration file in Claude Code"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid gap-6 md:grid-cols-3 mb-6",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "2.1"
                      }), "Open Claude Settings"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Access Claude Code settings and navigate to MCP configuration"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "2.2"
                      }), "Navigate to MCP Settings"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Go to Extensions → Model Context Protocol"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "2.3"
                      }), "Create MCP Configuration"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Add Web to MCP as a new MCP server"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "space-y-4",
                  children: [/* @__PURE__ */ jsx("h4", {
                    className: "text-lg font-semibold text-zinc-100",
                    children: "Claude Code Configuration"
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-sm text-zinc-400",
                    children: "Add the following MCP server configuration:"
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "relative",
                    children: [/* @__PURE__ */ jsx("pre", {
                      className: "bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm overflow-x-auto",
                      children: /* @__PURE__ */ jsx("code", {
                        className: "text-zinc-300",
                        children: `{
  "mcpServers": {
    "web-to-mcp": {
      "url": "https://web-to-mcp.com/mcp/<YOUR_UNIQUE_ID>",
      "name": "Web to MCP",
      "description": "Send website components to Claude Code"
    }
  }
}`
                      })
                    }), /* @__PURE__ */ jsx(Button$1, {
                      size: "sm",
                      variant: "outline",
                      onClick: () => copyToClipboard(`{
  "mcpServers": {
    "web-to-mcp": {
      "url": "https://web-to-mcp.com/mcp/<YOUR_UNIQUE_ID>",
      "name": "Web to MCP",
      "description": "Send website components to Claude Code"
    }
  }
}`, 1),
                      className: "absolute top-2 right-2 border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
                      children: copiedStep === 1 ? /* @__PURE__ */ jsx(CheckCircle, {
                        className: "w-4 h-4"
                      }) : /* @__PURE__ */ jsx(Copy, {
                        className: "w-4 h-4"
                      })
                    })]
                  })]
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.2,
              children: /* @__PURE__ */ jsxs("div", {
                className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-4 mb-6",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30",
                    children: /* @__PURE__ */ jsx("span", {
                      className: "text-xl font-bold text-yellow-400",
                      children: "3"
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("h3", {
                      className: "text-xl font-semibold text-zinc-100",
                      children: "Replace MCP URL"
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-zinc-400",
                      children: "Update the configuration with your actual MCP URL"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid gap-6 md:grid-cols-3",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "3.1"
                      }), "Get Your MCP URL"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Sign in to your account and copy your unique MCP URL from the dashboard"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "3.2"
                      }), "Add to Claude Code"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-zinc-400",
                      children: "Add your MCP URL to the Claude Code configuration"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "3.3"
                      }), "Claude detects new tools"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Claude Code will automatically detect the new MCP tool and you can start using it"
                    })]
                  })]
                }), /* @__PURE__ */ jsx("div", {
                  className: "mt-6",
                  children: /* @__PURE__ */ jsxs(Button$1, {
                    className: "bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold",
                    onClick: handleGoogleLogin,
                    children: [/* @__PURE__ */ jsx(LogIn, {
                      className: "h-5 w-5 mr-2"
                    }), "Get MCP URL"]
                  })
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.3,
              children: /* @__PURE__ */ jsxs("div", {
                className: "rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-center gap-4 mb-6",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30",
                    children: /* @__PURE__ */ jsx("span", {
                      className: "text-xl font-bold text-yellow-400",
                      children: "4"
                    })
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("h3", {
                      className: "text-xl font-semibold text-zinc-100",
                      children: "Start Capturing Components"
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-zinc-400",
                      children: "Navigate to any website and start sending components to Claude Code"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "grid gap-6 md:grid-cols-4",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "4.1"
                      }), "Navigate to Website"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Go to any website you want to extract components from"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "4.2"
                      }), "Click Extension Icon"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Click the Web to MCP extension icon in your browser"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "4.3"
                      }), "Select Component"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Click on any element you want to capture and copy its reference id"
                    })]
                  }), /* @__PURE__ */ jsxs("div", {
                    className: "space-y-2",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 text-sm font-medium text-zinc-200",
                      children: [/* @__PURE__ */ jsx("span", {
                        className: "flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs",
                        children: "4.4"
                      }), "Refer to the element in Claude"]
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "You can refer to the element inside Claude Code chat using the reference id"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-2 text-yellow-400",
                    children: [/* @__PURE__ */ jsx(CheckCircle, {
                      className: "h-5 w-5"
                    }), /* @__PURE__ */ jsx("span", {
                      className: "font-semibold",
                      children: "[SUCCESS]"
                    })]
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-sm text-yellow-300 mt-1",
                    children: "Your MCP server is now connected! Components will be sent directly to Claude Code."
                  })]
                })]
              })
            })]
          })]
        })
      }), /* @__PURE__ */ jsx("section", {
        className: "relative border-b border-zinc-900/60",
        children: /* @__PURE__ */ jsxs(Container, {
          className: "py-16 md:py-24",
          children: [/* @__PURE__ */ jsx(FadeIn, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "mx-auto max-w-3xl text-center",
              children: [/* @__PURE__ */ jsxs(Tag, {
                children: [/* @__PURE__ */ jsxs("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "h-4 w-4 text-emerald-400 mr-2",
                  children: [/* @__PURE__ */ jsx("path", {
                    d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
                  }), /* @__PURE__ */ jsx("path", {
                    d: "M5 3v4"
                  }), /* @__PURE__ */ jsx("path", {
                    d: "M19 17v4"
                  }), /* @__PURE__ */ jsx("path", {
                    d: "M3 5h4"
                  }), /* @__PURE__ */ jsx("path", {
                    d: "M17 19h4"
                  })]
                }), "Why Web To MCP for Claude Code?"]
              }), /* @__PURE__ */ jsxs("h2", {
                className: "mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent",
                children: ["The missing link between", " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "inspiration"
                }), " ", "and", " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "implementation"
                })]
              })]
            })
          }), /* @__PURE__ */ jsx(FadeIn, {
            delay: 0.2,
            children: /* @__PURE__ */ jsxs("div", {
              className: "mt-16 relative",
              children: [/* @__PURE__ */ jsx("div", {
                className: "absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-emerald-500/10 to-emerald-500/5 rounded-3xl blur-3xl"
              }), /* @__PURE__ */ jsxs("div", {
                className: "relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center",
                children: [/* @__PURE__ */ jsx(motion.div, {
                  className: "relative",
                  animate: {
                    scale: isConnected ? 0.98 : 1,
                    opacity: isConnected ? 0.8 : 1
                  },
                  transition: {
                    duration: 0.8,
                    ease: "easeInOut"
                  },
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 relative overflow-hidden",
                    children: [/* @__PURE__ */ jsx("div", {
                      className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-3 mb-4",
                      children: [/* @__PURE__ */ jsx("div", {
                        className: "p-2 rounded-lg bg-blue-500/10 border border-blue-500/20",
                        children: /* @__PURE__ */ jsx(Eye, {
                          className: "h-5 w-5 text-blue-400"
                        })
                      }), /* @__PURE__ */ jsxs("div", {
                        children: [/* @__PURE__ */ jsx("h3", {
                          className: "font-semibold text-zinc-100",
                          children: "Inspiration"
                        }), /* @__PURE__ */ jsx("p", {
                          className: "text-xs text-zinc-400",
                          children: "Beautiful design you found"
                        })]
                      })]
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "relative rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 mb-4",
                      children: [/* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2 mb-3",
                        children: [/* @__PURE__ */ jsx("div", {
                          className: "w-2 h-2 rounded-full bg-red-500"
                        }), /* @__PURE__ */ jsx("div", {
                          className: "w-2 h-2 rounded-full bg-yellow-500"
                        }), /* @__PURE__ */ jsx("div", {
                          className: "w-2 h-2 rounded-full bg-green-500"
                        })]
                      }), /* @__PURE__ */ jsxs("div", {
                        className: "space-y-2",
                        children: [/* @__PURE__ */ jsx("div", {
                          className: "h-4 bg-zinc-600 rounded w-3/4"
                        }), /* @__PURE__ */ jsx("div", {
                          className: "h-3 bg-zinc-700 rounded w-1/2"
                        }), /* @__PURE__ */ jsx("div", {
                          className: "h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded"
                        })]
                      })]
                    }), /* @__PURE__ */ jsx("div", {
                      className: "text-center",
                      children: /* @__PURE__ */ jsx("span", {
                        className: "text-xs text-zinc-400",
                        children: '"How do I explain this to Claude Code?"'
                      })
                    })]
                  })
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-col items-center relative",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "hidden lg:block absolute left-0 top-1/2 w-full",
                    children: /* @__PURE__ */ jsx(motion.div, {
                      className: "h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full",
                      animate: {
                        opacity: isConnected ? [0.3, 1, 0.3] : 0.3,
                        scaleX: isConnected ? [0.8, 1.2, 0.8] : 0.8
                      },
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    })
                  }), /* @__PURE__ */ jsx(motion.div, {
                    className: "relative z-10 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 p-6 shadow-2xl",
                    animate: {
                      scale: isConnected ? [1, 1.1, 1] : 1,
                      boxShadow: isConnected ? ["0 0 0 0 rgba(16, 185, 129, 0.3)", "0 0 0 20px rgba(16, 185, 129, 0)", "0 0 0 0 rgba(16, 185, 129, 0)"] : "0 0 0 0 rgba(16, 185, 129, 0)"
                    },
                    transition: {
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    children: /* @__PURE__ */ jsxs("div", {
                      className: "text-center",
                      children: [/* @__PURE__ */ jsx(Zap, {
                        className: "h-8 w-8 text-emerald-400 mx-auto mb-2"
                      }), /* @__PURE__ */ jsx("h3", {
                        className: "font-bold text-emerald-300 text-lg",
                        children: "Web To MCP"
                      }), /* @__PURE__ */ jsx("p", {
                        className: "text-xs text-emerald-400/80",
                        children: "Perfect Bridge"
                      })]
                    })
                  }), [...Array(8)].map((_, i) => /* @__PURE__ */ jsx(motion.div, {
                    className: "absolute w-1 h-1 bg-emerald-400 rounded-full",
                    style: {
                      left: `${30 + Math.cos(i * 0.785) * 40}%`,
                      top: `${50 + Math.sin(i * 0.785) * 40}%`
                    },
                    animate: {
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    },
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }
                  }, i))]
                }), /* @__PURE__ */ jsx(motion.div, {
                  className: "relative",
                  animate: {
                    scale: isConnected ? 1.02 : 1,
                    opacity: isConnected ? 1 : 0.9
                  },
                  transition: {
                    duration: 0.8,
                    ease: "easeInOut"
                  },
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 relative overflow-hidden",
                    children: [/* @__PURE__ */ jsx("div", {
                      className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400"
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-3 mb-4",
                      children: [/* @__PURE__ */ jsx("div", {
                        className: "p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20",
                        children: /* @__PURE__ */ jsx(Code, {
                          className: "h-5 w-5 text-emerald-400"
                        })
                      }), /* @__PURE__ */ jsxs("div", {
                        children: [/* @__PURE__ */ jsx("h3", {
                          className: "font-semibold text-zinc-100",
                          children: "Implementation"
                        }), /* @__PURE__ */ jsx("p", {
                          className: "text-xs text-zinc-400",
                          children: "Perfect code output in Claude Code"
                        })]
                      })]
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "relative rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 mb-4 font-mono text-xs",
                      children: [/* @__PURE__ */ jsx("div", {
                        className: "text-emerald-400",
                        children: "// Generated in Claude Code"
                      }), /* @__PURE__ */ jsx("div", {
                        className: "text-blue-400",
                        children: "<Button"
                      }), /* @__PURE__ */ jsx("div", {
                        className: "text-zinc-300 ml-2",
                        children: 'className="bg-gradient-to-r'
                      }), /* @__PURE__ */ jsx("div", {
                        className: "text-zinc-300 ml-2",
                        children: 'from-purple-600 to-blue-600"'
                      }), /* @__PURE__ */ jsx("div", {
                        className: "text-blue-400",
                        children: ">"
                      }), /* @__PURE__ */ jsx("div", {
                        className: "text-zinc-300 ml-2",
                        children: "Click me"
                      }), /* @__PURE__ */ jsx("div", {
                        className: "text-blue-400",
                        children: "</Button>"
                      })]
                    }), /* @__PURE__ */ jsx("div", {
                      className: "text-center",
                      children: /* @__PURE__ */ jsx(motion.span, {
                        className: "text-xs text-emerald-400",
                        animate: {
                          opacity: isConnected ? [0.6, 1, 0.6] : 0.6
                        },
                        transition: {
                          duration: 2,
                          repeat: Infinity
                        },
                        children: "✓ Pixel-perfect match in Claude Code"
                      })
                    })]
                  })
                })]
              }), /* @__PURE__ */ jsx(FadeIn, {
                delay: 0.4,
                children: /* @__PURE__ */ jsx("div", {
                  className: "mt-12 text-center",
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "inline-flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-700/50 bg-zinc-800/40",
                    children: [/* @__PURE__ */ jsx("span", {
                      className: "text-zinc-400",
                      children: "Works with any website, perfectly integrated with Claude Code"
                    }), /* @__PURE__ */ jsx(ArrowRight, {
                      className: "h-4 w-4 text-emerald-400"
                    }), /* @__PURE__ */ jsx("span", {
                      className: "font-semibold text-emerald-400",
                      children: "30 seconds to perfect handoff"
                    })]
                  })
                })
              })]
            })
          })]
        })
      }), /* @__PURE__ */ jsx("section", {
        id: "how",
        className: "relative border-b border-zinc-900/60",
        children: /* @__PURE__ */ jsxs(Container, {
          className: "py-16 md:py-24",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mx-auto mb-10 max-w-2xl text-center",
            children: [/* @__PURE__ */ jsxs(Tag, {
              children: [/* @__PURE__ */ jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "h-4 w-4 text-emerald-400 mr-2",
                children: /* @__PURE__ */ jsx("path", {
                  d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                })
              }), "How it works"]
            }), /* @__PURE__ */ jsxs("h2", {
              className: "mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent",
              children: ["From", " ", /* @__PURE__ */ jsx("span", {
                className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                children: "inspiration"
              }), " ", "to", " ", /* @__PURE__ */ jsx("span", {
                className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                children: "implementation"
              }), " ", "in", " ", /* @__PURE__ */ jsx("span", {
                className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                children: "30 seconds"
              }), "."]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "grid gap-6 md:grid-cols-3",
            children: [/* @__PURE__ */ jsx(Step, {
              index: 1,
              title: "Authenticate with Google",
              iconType: "google-auth",
              children: "Sign in and you're set."
            }), /* @__PURE__ */ jsx(Step, {
              index: 2,
              title: "Install the Chrome extension",
              iconType: "chrome-extension",
              children: "Add it from the Web Store."
            }), /* @__PURE__ */ jsx(Step, {
              index: 3,
              title: "Navigate to any website",
              iconType: "website-nav",
              children: "Open the page with the component you want."
            }), /* @__PURE__ */ jsx(Step, {
              index: 4,
              title: "Click the extension icon",
              iconType: "extension-click",
              children: "Activate component selection mode."
            }), /* @__PURE__ */ jsx(Step, {
              index: 5,
              title: "Select the component",
              iconType: "component-select",
              children: "We capture it exactly as rendered."
            }), /* @__PURE__ */ jsx(Step, {
              index: 6,
              title: "Send to Claude Code",
              iconType: "send-to-ai",
              children: "Delivered via MCP to Claude Code for perfect integration."
            })]
          })]
        })
      }), /* @__PURE__ */ jsx("section", {
        className: "relative border-b border-zinc-900/60",
        children: /* @__PURE__ */ jsxs(Container, {
          className: "py-16 md:py-24",
          children: [/* @__PURE__ */ jsx(FadeIn, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "mx-auto mb-16 max-w-3xl text-center",
              children: [/* @__PURE__ */ jsxs(Tag, {
                children: [/* @__PURE__ */ jsxs("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "24",
                  height: "24",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "h-4 w-4 text-emerald-400 mr-2",
                  children: [/* @__PURE__ */ jsx("path", {
                    d: "M9 12l2 2 4-4"
                  }), /* @__PURE__ */ jsx("path", {
                    d: "M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                  })]
                }), "Claude Code Benefits"]
              }), /* @__PURE__ */ jsxs("h2", {
                className: "mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent",
                children: ["Supercharge your", " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "Claude Code"
                }), " ", /* @__PURE__ */ jsx("span", {
                  className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                  children: "workflow"
                })]
              }), /* @__PURE__ */ jsx("p", {
                className: "mt-3 text-zinc-400 text-lg leading-relaxed",
                children: "Stop describing components. Send pixel-perfect references that Claude Code understands instantly."
              })]
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
            children: [/* @__PURE__ */ jsx(FadeIn, {
              delay: 0.1,
              children: /* @__PURE__ */ jsxs(motion.div, {
                className: "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
                whileHover: {
                  scale: 1.02
                },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                children: [/* @__PURE__ */ jsx("div", {
                  className: "inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300",
                  children: /* @__PURE__ */ jsx(Monitor, {
                    className: "h-6 w-6"
                  })
                }), /* @__PURE__ */ jsx("h4", {
                  className: "text-lg font-semibold text-zinc-100 mb-2",
                  children: "Perfect Visual Context"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-zinc-400 leading-relaxed",
                  children: "Send actual website components to Claude Code instead of describing them. Your AI assistant gets pixel-perfect context every time."
                }), /* @__PURE__ */ jsx("div", {
                  className: "absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.2,
              children: /* @__PURE__ */ jsxs(motion.div, {
                className: "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
                whileHover: {
                  scale: 1.02
                },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                children: [/* @__PURE__ */ jsx("div", {
                  className: "inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300",
                  children: /* @__PURE__ */ jsx(Terminal, {
                    className: "h-6 w-6"
                  })
                }), /* @__PURE__ */ jsx("h4", {
                  className: "text-lg font-semibold text-zinc-100 mb-2",
                  children: "Native MCP Integration"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-zinc-400 leading-relaxed",
                  children: "Built specifically for Claude Code's Model Context Protocol. Seamless handoffs that work perfectly with your coding workflow."
                }), /* @__PURE__ */ jsx("div", {
                  className: "absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.3,
              children: /* @__PURE__ */ jsxs(motion.div, {
                className: "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
                whileHover: {
                  scale: 1.02
                },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                children: [/* @__PURE__ */ jsx("div", {
                  className: "inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300",
                  children: /* @__PURE__ */ jsx(Globe, {
                    className: "h-6 w-6"
                  })
                }), /* @__PURE__ */ jsx("h4", {
                  className: "text-lg font-semibold text-zinc-100 mb-2",
                  children: "Any Website, Any Framework"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-zinc-400 leading-relaxed",
                  children: "Capture components from any website - design inspiration, competitor analysis, or reference implementations for Claude Code."
                }), /* @__PURE__ */ jsx("div", {
                  className: "absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.4,
              children: /* @__PURE__ */ jsxs(motion.div, {
                className: "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
                whileHover: {
                  scale: 1.02
                },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                children: [/* @__PURE__ */ jsx("div", {
                  className: "inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300",
                  children: /* @__PURE__ */ jsx(CheckCircle, {
                    className: "h-6 w-6"
                  })
                }), /* @__PURE__ */ jsx("h4", {
                  className: "text-lg font-semibold text-zinc-100 mb-2",
                  children: "Eliminate Back-and-Forth"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-zinc-400 leading-relaxed",
                  children: 'No more "make it look like this" conversations. Send precise references and get exact implementations in Claude Code.'
                }), /* @__PURE__ */ jsx("div", {
                  className: "absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.5,
              children: /* @__PURE__ */ jsxs(motion.div, {
                className: "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
                whileHover: {
                  scale: 1.02
                },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                children: [/* @__PURE__ */ jsx("div", {
                  className: "inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300",
                  children: /* @__PURE__ */ jsx(ArrowRight, {
                    className: "h-6 w-6"
                  })
                }), /* @__PURE__ */ jsx("h4", {
                  className: "text-lg font-semibold text-zinc-100 mb-2",
                  children: "Lightning Fast Development"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-zinc-400 leading-relaxed",
                  children: "From component selection to Claude Code implementation in under 30 seconds. Speed up your development cycle dramatically."
                }), /* @__PURE__ */ jsx("div", {
                  className: "absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                })]
              })
            }), /* @__PURE__ */ jsx(FadeIn, {
              delay: 0.6,
              children: /* @__PURE__ */ jsxs(motion.div, {
                className: "group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
                whileHover: {
                  scale: 1.02
                },
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                },
                children: [/* @__PURE__ */ jsx("div", {
                  className: "inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300",
                  children: /* @__PURE__ */ jsx(Cpu, {
                    className: "h-6 w-6"
                  })
                }), /* @__PURE__ */ jsx("h4", {
                  className: "text-lg font-semibold text-zinc-100 mb-2",
                  children: "Smart Component Analysis"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-zinc-400 leading-relaxed",
                  children: "Automatically captures CSS, structure, and context. Claude Code receives comprehensive component data for accurate recreation."
                }), /* @__PURE__ */ jsx("div", {
                  className: "absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                })]
              })
            })]
          })]
        })
      }), /* @__PURE__ */ jsx(TechReq, {}), /* @__PURE__ */ jsx("section", {
        className: "relative border-b border-zinc-900/60",
        children: /* @__PURE__ */ jsxs(Container, {
          className: "py-16 md:py-24",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mx-auto mb-12 max-w-2xl text-center",
            children: [/* @__PURE__ */ jsxs(Tag, {
              children: [/* @__PURE__ */ jsxs("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "h-4 w-4 text-emerald-400 mr-2",
                children: [/* @__PURE__ */ jsx("circle", {
                  cx: "12",
                  cy: "12",
                  r: "10"
                }), /* @__PURE__ */ jsx("path", {
                  d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                }), /* @__PURE__ */ jsx("path", {
                  d: "M12 17h.01"
                })]
              }), "FAQ"]
            }), /* @__PURE__ */ jsxs("h2", {
              className: "mt-4 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent",
              children: ["Claude Code-specific", " ", /* @__PURE__ */ jsx("span", {
                className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                children: "questions"
              }), " ", /* @__PURE__ */ jsx("span", {
                className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                children: "answered"
              }), "."]
            })]
          }), /* @__PURE__ */ jsxs(Accordion, {
            type: "single",
            collapsible: true,
            className: "w-full max-w-3xl mx-auto",
            children: [/* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-1",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "How does Web to MCP integrate with Claude Code?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "Web to MCP connects directly to Claude Code through the Model Context Protocol (MCP). Once configured, captured components are automatically available in your Claude Code context, allowing the AI to understand and recreate them perfectly."
              })]
            }), /* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-2",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "Do I need to install anything in Claude Code itself?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "Yes, you need to add Web to MCP as an MCP server in Claude Code using the command line interface. This is a one-time setup that enables the connection between the browser extension and Claude Code."
              })]
            }), /* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-3",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "What data does Claude Code receive from captured components?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "Claude Code receives the component's DOM structure, computed CSS styles, screenshot, and contextual information. This comprehensive data allows Claude Code's AI to understand both the visual appearance and technical implementation details."
              })]
            }), /* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-4",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "Can I use this with Claude Code's project management features?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "Absolutely! Web to MCP works seamlessly with Claude Code's project management. You can capture components and immediately reference them in your Claude Code projects to build entire features using the captured designs as references."
              })]
            }), /* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-5",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "How accurate are the component recreations in Claude Code?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "With pixel-perfect references, Claude Code can achieve remarkable accuracy. The quality depends on the complexity of the component and your prompting, but users typically see 90%+ visual fidelity on first generation, with easy refinements for perfect matches."
              })]
            }), /* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-6",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "Does this work with Claude Code's different model options?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "Yes, Web to MCP works with all Claude Code model options. The MCP integration is model-agnostic, so you can use it with any Claude model available in Claude Code for component generation."
              })]
            }), /* @__PURE__ */ jsxs(AccordionItem, {
              value: "item-7",
              children: [/* @__PURE__ */ jsx(AccordionTrigger, {
                className: "text-left text-zinc-100 hover:text-zinc-200",
                children: "Can I capture and use multiple components in one Claude Code session?"
              }), /* @__PURE__ */ jsx(AccordionContent, {
                children: "Yes! You can capture multiple components and reference them all within the same Claude Code session. Each component gets a unique reference ID, making it easy to build complex UIs by combining multiple captured elements."
              })]
            })]
          })]
        })
      }), /* @__PURE__ */ jsx("section", {
        className: "relative",
        children: /* @__PURE__ */ jsxs(Container, {
          className: "py-16 md:py-24 text-center",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400",
            children: [/* @__PURE__ */ jsx(Zap, {
              className: "h-4 w-4 text-emerald-400"
            }), " Stop explaining components to Claude Code. Send them directly."]
          }), /* @__PURE__ */ jsxs("h3", {
            className: "mt-4 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent",
            children: ["Transform your", " ", /* @__PURE__ */ jsx("span", {
              className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
              children: "Claude Code"
            }), " ", /* @__PURE__ */ jsx("span", {
              className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
              children: "workflow"
            }), " ", "in", " ", /* @__PURE__ */ jsx("span", {
              className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
              children: "one click"
            }), "."]
          }), /* @__PURE__ */ jsx("p", {
            className: "mt-3 text-zinc-400",
            children: "Add the extension and start coding with perfect visual context in Claude Code."
          }), /* @__PURE__ */ jsxs("div", {
            className: "mt-6 flex flex-col sm:flex-row justify-center gap-3",
            children: [/* @__PURE__ */ jsxs(Button$1, {
              className: "h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold",
              onClick: handleGoogleLogin,
              children: [/* @__PURE__ */ jsx(LogIn, {
                className: "mr-2 h-5 w-5"
              }), "Get Started for Free"]
            }), /* @__PURE__ */ jsxs(Button$1, {
              variant: "outline",
              className: "h-11 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
              onClick: handleDownloadExtension,
              children: [/* @__PURE__ */ jsx(Chrome, {
                className: "mr-2 h-5 w-5"
              }), "Add to Chrome"]
            })]
          })]
        })
      }), /* @__PURE__ */ jsx(SimpleFooter, {})]
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: claudeCode,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-green-500/30",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-green-500/20 text-green-400 font-mono text-sm",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
function meta$3({}) {
  return [{
    title: "Dashboard - Web to MCP"
  }, {
    name: "description",
    content: "Manage your captures and MCP configuration"
  }, {
    property: "og:title",
    content: "Dashboard - Web to MCP"
  }, {
    property: "og:description",
    content: "Manage your captures and MCP configuration"
  }, {
    property: "og:image",
    content: "/og.png"
  }, {
    property: "og:image:width",
    content: "1200"
  }, {
    property: "og:image:height",
    content: "630"
  }, {
    property: "og:image:type",
    content: "image/png"
  }, {
    property: "og:type",
    content: "website"
  }, {
    property: "og:site_name",
    content: "Web to MCP"
  }, {
    property: "og:url",
    content: "https://web-to-mcp.com/dashboard"
  }, {
    name: "twitter:card",
    content: "summary_large_image"
  }, {
    name: "twitter:title",
    content: "Dashboard - Web to MCP"
  }, {
    name: "twitter:description",
    content: "Manage your captures and MCP configuration"
  }, {
    name: "twitter:image",
    content: "/og.png"
  }];
}
function DashboardContent() {
  const {
    user,
    logout
  } = useAuth();
  useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [captures, setCaptures] = useState([]);
  const [isLoadingCaptures, setIsLoadingCaptures] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedButton, setCopiedButton] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    scrollY
  } = useScroll();
  useTransform(scrollY, [0, 800], [0, -80]);
  useTransform(scrollY, [0, 800], [0, -40]);
  const isPaidUser = false;
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target || !(target instanceof Element)) {
        setShowDropdown(false);
        return;
      }
      if (!target.closest(".user-dropdown")) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);
  const fetchCaptures = async (page = 1) => {
    try {
      setIsLoadingCaptures(true);
      const response = await axios.get(`/api/captures/list/?page=${page}`, {
        withCredentials: true
      });
      setCaptures(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      console.error("Failed to fetch captures:", error);
      trackApiError("/api/captures/list/", error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoadingCaptures(false);
    }
  };
  useEffect(() => {
    trackDashboardAccessed();
    trackPageView("Dashboard", window.location.href);
    fetchCaptures(currentPage);
  }, [currentPage]);
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      trackLogout();
      trackButtonClick("logout_button", "dashboard");
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };
  const copyToClipboard = async (text, buttonType) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedButton(buttonType);
      setTimeout(() => setCopiedButton(null), 2e3);
      if (buttonType.includes("capture")) {
        trackCaptureCopied(buttonType);
      } else if (buttonType.includes("mcp")) {
        const configType = buttonType.includes("cursor") ? "cursor" : "claude";
        trackMcpConfigCopied(configType);
      }
      trackButtonClick("copy_button", buttonType);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };
  const getMcpUrl = () => {
    return user?.mcp_url || "";
  };
  const getCursorMcpConfig = () => {
    const mcpUrl = getMcpUrl();
    return `"web-to-mcp": {
  "url": "${mcpUrl}"
}`;
  };
  const getClaudeCodeCommand = () => {
    const mcpUrl = getMcpUrl();
    return `claude mcp add --transport http web-to-mcp ${mcpUrl}`;
  };
  const getPromptText = (captureId) => {
    return `Use the web-to-mcp tool with reference ${captureId} to implement the fetched website component.`;
  };
  const CopyButton = ({
    text,
    buttonType,
    label
  }) => /* @__PURE__ */ jsxs("button", {
    onClick: () => copyToClipboard(text, buttonType),
    className: `
        flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border rounded
        transition-all duration-200 hover:scale-105
        border-emerald-500/40 text-emerald-400 hover:border-emerald-500/60 hover:bg-emerald-500/10 cursor-pointer
        ${copiedButton === buttonType ? "bg-emerald-500/20 border-emerald-500/80" : ""}
      `,
    children: [copiedButton === buttonType ? /* @__PURE__ */ jsx(Check, {
      className: "w-4 h-4"
    }) : /* @__PURE__ */ jsx(Copy, {
      className: "w-4 h-4"
    }), label]
  });
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden",
    children: [/* @__PURE__ */ jsx(Glow, {}), /* @__PURE__ */ jsxs("div", {
      className: "relative z-10",
      children: [/* @__PURE__ */ jsx("header", {
        className: "sticky top-0 z-40 border-b border-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60",
        children: /* @__PURE__ */ jsxs(Container, {
          className: "flex h-16 items-center justify-between",
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex items-center gap-3",
            children: /* @__PURE__ */ jsxs("a", {
              href: "/",
              className: "relative flex items-center gap-2 group",
              children: [/* @__PURE__ */ jsx("img", {
                src: "/favicon.ico",
                alt: "WebToMCP Logo",
                className: "w-8 h-8 sm:w-9 sm:h-9 transition-transform group-hover:scale-105"
              }), /* @__PURE__ */ jsx("span", {
                className: "font-bold text-lg sm:text-xl leading-none",
                children: /* @__PURE__ */ jsx(GradientText, {
                  children: "WebToMCP"
                })
              })]
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4",
            children: [
              isPaidUser,
              /* Simple logout button for free users */
              /* @__PURE__ */ jsx(Button$1, {
                variant: "outline",
                onClick: handleLogout,
                disabled: isLoggingOut,
                className: "border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
                children: isLoggingOut ? "Logging out..." : "Logout"
              })
            ]
          })]
        })
      }), /* @__PURE__ */ jsxs(Container, {
        className: "py-16 md:py-24",
        children: [/* @__PURE__ */ jsx(FadeIn, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "mx-auto mb-16 max-w-3xl text-center",
            children: [/* @__PURE__ */ jsxs(Tag, {
              children: [/* @__PURE__ */ jsx(Terminal, {
                className: "h-4 w-4 text-emerald-400 mr-2"
              }), "Dashboard"]
            }), /* @__PURE__ */ jsxs("h1", {
              className: "mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent",
              children: ["Welcome back,", " ", /* @__PURE__ */ jsx("span", {
                className: "bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent",
                children: user?.full_name?.split(" ")[0] || "Developer"
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "mt-4 text-zinc-400 text-lg leading-relaxed",
              children: "Manage your captures, configure MCP connections, and streamline your development workflow."
            })]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "max-w-4xl mx-auto space-y-8",
          children: [/* @__PURE__ */ jsx(FadeIn, {
            delay: 0.1,
            children: /* @__PURE__ */ jsx(Card$1, {
              className: "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
              children: /* @__PURE__ */ jsx(CardContent$1, {
                className: "pt-6",
                children: /* @__PURE__ */ jsxs("div", {
                  className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                  children: [/* @__PURE__ */ jsxs("div", {
                    className: "flex items-center gap-4",
                    children: [/* @__PURE__ */ jsx("div", {
                      className: "w-12 h-12 bg-emerald-500/20 border border-emerald-500 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 group-hover:border-emerald-400 transition-all duration-300 shrink-0",
                      children: /* @__PURE__ */ jsx(Download, {
                        className: "w-6 h-6 text-emerald-400 shrink-0"
                      })
                    }), /* @__PURE__ */ jsxs("div", {
                      children: [/* @__PURE__ */ jsx("h3", {
                        className: "text-lg font-semibold text-zinc-100",
                        children: "Web to MCP Browser Extension"
                      }), /* @__PURE__ */ jsx("p", {
                        className: "text-zinc-400",
                        children: "Capture any website component and send it directly to your AI coding assistant"
                      })]
                    })]
                  }), /* @__PURE__ */ jsxs(Button$1, {
                    onClick: () => {
                      trackLinkClick("chrome_webstore_link", "https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi");
                      window.open("https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi", "_blank");
                    },
                    className: "bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold",
                    children: [/* @__PURE__ */ jsx(Download, {
                      className: "w-4 h-4 mr-2"
                    }), "Install Extension"]
                  })]
                })
              })
            })
          }), /* @__PURE__ */ jsx(FadeIn, {
            delay: 0.2,
            children: /* @__PURE__ */ jsxs(Card$1, {
              className: "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
              children: [/* @__PURE__ */ jsxs(CardHeader$1, {
                children: [/* @__PURE__ */ jsxs(CardTitle$1, {
                  className: "flex items-center gap-2 text-zinc-100",
                  children: [/* @__PURE__ */ jsx(Code, {
                    className: "w-5 h-5 text-sky-400"
                  }), "MCP Configuration"]
                }), /* @__PURE__ */ jsx(CardDescription$1, {
                  className: "text-zinc-400",
                  children: "Copy these configurations to connect your AI tools"
                })]
              }), /* @__PURE__ */ jsx(CardContent$1, {
                children: /* @__PURE__ */ jsxs("div", {
                  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
                  children: [/* @__PURE__ */ jsx(CopyButton, {
                    text: getMcpUrl(),
                    buttonType: "mcp-url",
                    label: "MCP URL"
                  }), /* @__PURE__ */ jsx(CopyButton, {
                    text: getCursorMcpConfig(),
                    buttonType: "cursor-config",
                    label: "Cursor Config"
                  }), /* @__PURE__ */ jsx(CopyButton, {
                    text: getClaudeCodeCommand(),
                    buttonType: "claude-command",
                    label: "Claude Command"
                  })]
                })
              })]
            })
          }), /* @__PURE__ */ jsx(FadeIn, {
            delay: 0.3,
            children: /* @__PURE__ */ jsxs(Card$1, {
              className: "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1",
              children: [/* @__PURE__ */ jsxs(CardHeader$1, {
                children: [/* @__PURE__ */ jsxs(CardTitle$1, {
                  className: "flex items-center gap-2 text-zinc-100",
                  children: [/* @__PURE__ */ jsx(Terminal, {
                    className: "w-5 h-5 text-fuchsia-400"
                  }), "Recent Captures"]
                }), /* @__PURE__ */ jsx(CardDescription$1, {
                  className: "text-zinc-400",
                  children: "Captures are retained for 1 week only"
                })]
              }), /* @__PURE__ */ jsx(CardContent$1, {
                children: isLoadingCaptures ? /* @__PURE__ */ jsx("div", {
                  className: "flex items-center justify-center py-8",
                  children: /* @__PURE__ */ jsxs("div", {
                    className: "text-center space-y-2",
                    children: [/* @__PURE__ */ jsx(Terminal, {
                      className: "w-8 h-8 text-emerald-400 animate-pulse mx-auto"
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-400",
                      children: "Loading captures..."
                    })]
                  })
                }) : captures.length === 0 ? /* @__PURE__ */ jsxs("div", {
                  className: "text-center py-8",
                  children: [/* @__PURE__ */ jsx("p", {
                    className: "text-zinc-400",
                    children: "No captures found"
                  }), /* @__PURE__ */ jsx("p", {
                    className: "text-sm text-zinc-500 mt-2",
                    children: "Start capturing components using the browser extension"
                  })]
                }) : /* @__PURE__ */ jsxs("div", {
                  className: "space-y-4",
                  children: [captures.map((capture) => /* @__PURE__ */ jsxs("div", {
                    className: "flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors gap-3",
                    children: [/* @__PURE__ */ jsxs("div", {
                      className: "flex-1 min-w-0",
                      children: [/* @__PURE__ */ jsxs("h4", {
                        className: "text-zinc-100 font-medium",
                        children: ["Capture ", capture.slug.slice(0, 8), "..."]
                      }), /* @__PURE__ */ jsx("p", {
                        className: "text-sm text-zinc-400 break-all",
                        children: /* @__PURE__ */ jsx("a", {
                          href: capture.website_url,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "text-emerald-400 hover:text-emerald-300 underline hover:no-underline transition-colors",
                          children: capture.website_url
                        })
                      }), /* @__PURE__ */ jsxs("p", {
                        className: "text-xs text-zinc-500",
                        children: [formatDate(capture.created_at), " • ", capture.token_count.toLocaleString(), " tokens"]
                      })]
                    }), /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2 flex-shrink-0",
                      children: [/* @__PURE__ */ jsx(Button$1, {
                        variant: "outline",
                        size: "sm",
                        onClick: () => copyToClipboard(capture.slug, `ref-${capture.slug}`),
                        className: "text-xs border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
                        children: copiedButton === `ref-${capture.slug}` ? /* @__PURE__ */ jsxs(Fragment, {
                          children: [/* @__PURE__ */ jsx(Check, {
                            className: "w-3 h-3 mr-1"
                          }), "Copied"]
                        }) : /* @__PURE__ */ jsxs(Fragment, {
                          children: [/* @__PURE__ */ jsx(Copy, {
                            className: "w-3 h-3 mr-1"
                          }), "ID"]
                        })
                      }), /* @__PURE__ */ jsx(Button$1, {
                        variant: "outline",
                        size: "sm",
                        onClick: () => copyToClipboard(getPromptText(capture.slug), `prompt-${capture.slug}`),
                        className: "text-xs border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
                        children: copiedButton === `prompt-${capture.slug}` ? /* @__PURE__ */ jsxs(Fragment, {
                          children: [/* @__PURE__ */ jsx(Check, {
                            className: "w-3 h-3 mr-1"
                          }), "Copied"]
                        }) : /* @__PURE__ */ jsxs(Fragment, {
                          children: [/* @__PURE__ */ jsx(Copy, {
                            className: "w-3 h-3 mr-1"
                          }), "Prompt"]
                        })
                      })]
                    })]
                  }, capture.slug)), totalPages > 1 && /* @__PURE__ */ jsxs("div", {
                    className: "flex items-center justify-center gap-2 pt-4",
                    children: [/* @__PURE__ */ jsx(Button$1, {
                      variant: "outline",
                      size: "sm",
                      onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
                      disabled: currentPage === 1,
                      className: "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
                      children: /* @__PURE__ */ jsx(ChevronLeft, {
                        className: "w-4 h-4"
                      })
                    }), /* @__PURE__ */ jsxs("span", {
                      className: "text-xs sm:text-sm text-zinc-400 px-2 sm:px-3",
                      children: ["Page ", currentPage, " of ", totalPages]
                    }), /* @__PURE__ */ jsx(Button$1, {
                      variant: "outline",
                      size: "sm",
                      onClick: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)),
                      disabled: currentPage === totalPages,
                      className: "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
                      children: /* @__PURE__ */ jsx(ChevronRight, {
                        className: "w-4 h-4"
                      })
                    })]
                  })]
                })
              })]
            })
          })]
        })]
      })]
    })]
  });
}
const dashboard = UNSAFE_withComponentProps(function Dashboard() {
  const {
    isAuthenticated,
    isLoading
  } = useAuth();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated, isLoading]);
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden",
      children: [/* @__PURE__ */ jsx(Glow, {}), /* @__PURE__ */ jsx("div", {
        className: "relative z-10 flex items-center justify-center min-h-screen",
        children: /* @__PURE__ */ jsx(FadeIn, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "text-center space-y-4",
            children: [/* @__PURE__ */ jsx(Terminal, {
              className: "w-12 h-12 text-emerald-400 animate-pulse mx-auto"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-zinc-400",
              children: "Loading dashboard..."
            })]
          })
        })
      })]
    });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden",
      children: [/* @__PURE__ */ jsx(Glow, {}), /* @__PURE__ */ jsx("div", {
        className: "relative z-10 flex items-center justify-center min-h-screen",
        children: /* @__PURE__ */ jsx(FadeIn, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "text-center space-y-4",
            children: [/* @__PURE__ */ jsx(Terminal, {
              className: "w-12 h-12 text-emerald-400 animate-pulse mx-auto"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-zinc-400",
              children: "Redirecting to home..."
            })]
          })
        })
      })]
    });
  }
  return /* @__PURE__ */ jsx(DashboardContent, {});
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dashboard,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-green-600 hover:bg-green-700 text-white border border-green-500/50 cyber-glow",
        destructive: "bg-red-600 hover:bg-red-700 text-white border border-red-500/50",
        outline: "border border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-400",
        secondary: "bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 hover:border-green-400",
        ghost: "hover:bg-green-500/10 text-green-400",
        link: "text-green-400 underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const SimpleHeader = () => {
  const { login } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target || !(target instanceof Element)) {
        setIsMobileMenuOpen(false);
        return;
      }
      if (!target.closest(".mobile-menu") && !target.closest(".mobile-menu-toggle")) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-40 border-b border-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 overflow-visible", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute left-1/4 top-1/2 h-16 w-32 rounded-full bg-zinc-800/5 blur-lg",
        animate: {
          x: [0, 10, 0],
          opacity: [0.05, 0.08, 0.05]
        },
        transition: {
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    ) }),
    /* @__PURE__ */ jsxs(Container, { className: "flex h-16 items-center justify-between relative z-10", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs("a", { href: "/", className: "relative flex items-center gap-2 group", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/favicon.ico",
            alt: "WebToMCP Logo",
            className: "w-8 h-8 sm:w-9 sm:h-9 transition-transform group-hover:scale-105"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-lg sm:text-xl leading-none", children: /* @__PURE__ */ jsx(GradientText, { children: "WebToMCP" }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            className: "h-10 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
            onClick: () => login(),
            children: "Log in"
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: "bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold",
            onClick: () => window.open("https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi", "_blank"),
            children: [
              "Install Extension ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ]
          }
        )
      ] }),
      isClient && /* @__PURE__ */ jsx(
        "button",
        {
          className: "mobile-menu-toggle sm:hidden p-2 text-zinc-300 hover:text-zinc-50 transition-colors",
          onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
          "aria-label": "Toggle mobile menu",
          children: isMobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex sm:hidden items-center gap-2 mr-2", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          className: "h-9 px-3 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 text-sm",
          onClick: () => login(),
          children: "Log in"
        }
      ) })
    ] }),
    isClient && isMobileMenuOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "mobile-menu sm:hidden fixed inset-0 top-16 bg-zinc-950/95 backdrop-blur-sm z-30",
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.2 },
        children: /* @__PURE__ */ jsx(Container, { className: "py-6 h-full flex flex-col justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-4 max-w-sm mx-auto w-full", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              className: "w-full h-14 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 text-lg font-medium",
              onClick: () => {
                login();
                setIsMobileMenuOpen(false);
              },
              children: "Log in"
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              className: "w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold text-lg",
              onClick: () => {
                window.open("https://chromewebstore.google.com/detail/web-to-mcp/hbnhkfkblpgjlfonnikijlofeiabolmi", "_blank");
                setIsMobileMenuOpen(false);
              },
              children: [
                "Install Extension ",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
              ]
            }
          )
        ] }) })
      }
    )
  ] });
};
function meta$2({}) {
  return [{
    title: "Terms of Use - Web to MCP"
  }, {
    name: "description",
    content: "Terms of Use for Web to MCP. Read our terms and conditions for using our website and services."
  }, {
    name: "keywords",
    content: "terms of use, terms and conditions, web to mcp, legal, agreement"
  }, {
    property: "og:title",
    content: "Terms of Use - Web to MCP"
  }, {
    property: "og:description",
    content: "Terms of Use for Web to MCP. Read our terms and conditions for using our website and services."
  }, {
    property: "og:image",
    content: "/og.png"
  }, {
    property: "og:image:width",
    content: "1200"
  }, {
    property: "og:image:height",
    content: "630"
  }, {
    property: "og:image:type",
    content: "image/png"
  }, {
    property: "og:type",
    content: "website"
  }, {
    property: "og:site_name",
    content: "Web to MCP"
  }, {
    property: "og:url",
    content: "https://web-to-mcp.com/terms"
  }, {
    name: "twitter:card",
    content: "summary_large_image"
  }, {
    name: "twitter:title",
    content: "Terms of Use - Web to MCP"
  }, {
    name: "twitter:description",
    content: "Terms of Use for Web to MCP. Read our terms and conditions for using our website and services."
  }, {
    name: "twitter:image",
    content: "/og.png"
  }];
}
const terms = UNSAFE_withComponentProps(function Terms() {
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden",
    children: [/* @__PURE__ */ jsx(Glow, {}), /* @__PURE__ */ jsxs("div", {
      className: "absolute inset-0 pointer-events-none",
      children: [/* @__PURE__ */ jsx(motion.div, {
        className: "absolute left-[10%] top-[15%] h-32 w-48 rounded-full bg-zinc-800/10 blur-xl",
        animate: {
          x: [0, 20, 0],
          y: [0, -10, 0],
          opacity: [0.1, 0.15, 0.1]
        },
        transition: {
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }), /* @__PURE__ */ jsx(motion.div, {
        className: "absolute right-[20%] top-[25%] h-24 w-36 rounded-full bg-zinc-700/8 blur-lg",
        animate: {
          x: [0, -15, 0],
          y: [0, 8, 0],
          opacity: [0.08, 0.12, 0.08]
        },
        transition: {
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }
      }), /* @__PURE__ */ jsx(motion.div, {
        className: "absolute left-[60%] top-[40%] h-16 w-24 rounded-full bg-zinc-600/6 blur-md",
        animate: {
          x: [0, 12, 0],
          y: [0, -5, 0],
          opacity: [0.06, 0.1, 0.06]
        },
        transition: {
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8
        }
      })]
    }), /* @__PURE__ */ jsx(SimpleHeader, {}), /* @__PURE__ */ jsx("div", {
      className: "container mx-auto px-4 py-8 sm:py-12",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-4xl mx-auto",
        children: /* @__PURE__ */ jsxs("div", {
          className: "bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/30 rounded-lg p-6 sm:p-8",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl sm:text-3xl font-bold text-zinc-100 mb-4",
              children: "Terms of Use"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-zinc-400",
              children: "Last updated on 20/08/25"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "prose prose-invert max-w-none space-y-6",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsxs("p", {
                className: "text-zinc-300 leading-relaxed",
                children: ['1. These Website Terms of Service ("', /* @__PURE__ */ jsx("strong", {
                  className: "text-zinc-100",
                  children: "Terms"
                }), '") govern the use of our website and any related Web to MCP software (the "', /* @__PURE__ */ jsx("strong", {
                  className: "text-zinc-100",
                  children: "Software"
                }), '") or services (collectively, the "', /* @__PURE__ */ jsx("strong", {
                  className: "text-zinc-100",
                  children: "Services"
                }), '") provided by our company and its subsidiaries, representatives and affiliates (collectively, "', /* @__PURE__ */ jsx("strong", {
                  className: "text-zinc-100",
                  children: "Web to MCP"
                }), '", "', /* @__PURE__ */ jsx("strong", {
                  className: "text-zinc-100",
                  children: "we"
                }), '", "', /* @__PURE__ */ jsx("strong", {
                  className: "text-zinc-100",
                  children: "us"
                }), '" or "', /* @__PURE__ */ jsx("strong", {
                  className: "text-zinc-100",
                  children: "our"
                }), '") regardless of whether you, the customer or user, is a paid user or a non-paying visitor. These Terms, and any other terms and policies referred to in these Terms, form an Agreement between Web to MCP and the user (referred to as "', /* @__PURE__ */ jsx("strong", {
                  className: "text-zinc-100",
                  children: "Customer"
                }), '" or "', /* @__PURE__ */ jsx("strong", {
                  className: "text-zinc-100",
                  children: "you"
                }), '"), collectively referred to as the Parties or each a Party. These Terms govern your use and access to our Services, including our Website and/or Software, our notifications and any materials or content appearing therein.']
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "Please also read our Privacy Policy, which explains how we collect and use your personal information, our Acceptable Use Policy and Cookie Policy, which outline your responsibilities when using our Website and Services. These Terms are relevant for those wishing to use Web to MCP's Website and/or create an account and utilise the Services provided by Web to MCP."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "1. About Us and our Services"
              }), /* @__PURE__ */ jsxs("ol", {
                className: "list-decimal list-inside space-y-2 text-zinc-300",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "We are a company registered in India."
                }), /* @__PURE__ */ jsx("li", {
                  children: "Web to MCP is a tool that helps developers convert websites into MCP (Model Context Protocol) compatible format, enabling seamless integration with AI development environments and tools."
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "2. Acceptance"
              }), /* @__PURE__ */ jsxs("ol", {
                className: "list-decimal list-inside space-y-2 text-zinc-300",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "Web to MCP owns, or holds the relevant rights to the Website and/or Software and will grant a non-exclusive license to the Customer, per the terms of this Agreement, and allow the use of the Website and/or Software."
                }), /* @__PURE__ */ jsxs("li", {
                  children: ['This Agreement sets out the terms upon which Web to MCP has agreed to grant a license to the Customer to use the Website and Software. This Agreement is binding on any use of the Website and Software and applies to the Customer from the time that Web to MCP provides the Customer with an account ("', /* @__PURE__ */ jsx("strong", {
                    className: "text-zinc-100",
                    children: "Customer's account"
                  }), '") to access and use the Website and/or Software ("', /* @__PURE__ */ jsx("strong", {
                    className: "text-zinc-100",
                    children: "Effective Date"
                  }), '").']
                }), /* @__PURE__ */ jsxs("li", {
                  children: ["By accessing and/or using the Website and/or Software you:", /* @__PURE__ */ jsxs("ol", {
                    className: "list-decimal list-inside ml-6 mt-2 space-y-1 text-zinc-300",
                    children: [/* @__PURE__ */ jsx("li", {
                      children: "warrant to us that you have reviewed this Agreement, including our Website Terms of Use (available on the Site) and our Privacy Policy (available on the Site), with your parent or legal guardian (if you are under 18 years of age), and you understand it;"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "warrant to us that you have the legal capacity to enter into a legally binding agreement with us or (if you are under 18 years of age) you have your parent's or legal guardian's permission to access and use the Site and they have agreed to the Terms on your behalf; and"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "agree to use the Services in accordance with this Agreement."
                    })]
                  })]
                }), /* @__PURE__ */ jsx("li", {
                  children: "You must not create a Customer's account unless you are at least 18 years of age. If you are a parent or legal guardian permitting a person who is at least 13 years of age but under 18 years of age (a Minor) create a Customer account and/or use the Site, you agree to: (i) supervise the Minor's use of the Website and their account; (ii) assume all risks associated with, and liabilities resulting from, the Minor's use of the Website and their Customer account; (iii) ensure that the content on the Website is suitable for the Minor; (iv) ensure all information submitted to us by the Minor is accurate; and (v) provide the consents, representations and warranties contained in the Terms on the Minor's behalf."
                }), /* @__PURE__ */ jsx("li", {
                  children: "By using and subscribing to our Services, you acknowledge that you have read, understood, and accepted this Agreement and you have the authority to act on behalf of any person or entity for whom you are using the Services, and you are deemed to have agreed to this Agreement on behalf of any entity for whom you use the Services."
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "3. Limitations of Use"
              }), /* @__PURE__ */ jsxs("ol", {
                className: "list-decimal list-inside space-y-2 text-zinc-300",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "Please read the following limitations and restrictions carefully. Any breach of the limitations and/or restrictions set out in these Terms may result, at Web to MCP's sole discretion, in the termination of your access to the Website and/or Software, and you may be exposed to civil and/or criminal liability."
                }), /* @__PURE__ */ jsxs("li", {
                  children: ["By using the Website and/or Software, you warrant on behalf of yourself, your users, and other parties you represent that you will not:", /* @__PURE__ */ jsxs("ol", {
                    className: "list-decimal list-inside ml-6 mt-2 space-y-1 text-zinc-300",
                    children: [/* @__PURE__ */ jsx("li", {
                      children: "modify, copy, prepare derivative works of, decompile, or reverse engineer any materials and software contained on this Website and/or Software;"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "introduce any code or device intended to interfere with or having the effect of interfering adversely with, the operation of any hardware or software, including any bugs, worms, logic bombs, trojan horses, viruses or any other self-propagating or other such program that may infect or cause damage to the Service or Web to MCP's systems or otherwise;"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "remove any copyright or other proprietary notations from any materials and software on this Website;"
                    }), /* @__PURE__ */ jsx("li", {
                      children: `transfer the materials to another person or "mirror" the materials on any other server without Web to MCP's prior express written consent;`
                    }), /* @__PURE__ */ jsx("li", {
                      children: "knowingly or negligently use this Website or any of its associated services in a way that abuses or disrupts our networks or any other service Web to MCP provides;"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "use this Website or its associated services to transmit or publish any harassing, indecent, obscene, fraudulent, or unlawful material;"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "use this Website or its associated services in violation of any applicable laws or regulations;"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "use this Website in conjunction with sending unauthorised advertising or spam;"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "harvest, collect, or gather user data without consent;"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "sell, license, or exploit for any commercial purposes any use of or access to the content of the Service and/or the Website;"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "use this Website or its associated services in such a way that may infringe the privacy, intellectual property rights, or other rights of third parties;"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "unauthorised use of any scraper, robot, bot, spider, crawler or any other automated device or means to access, acquire, copy or monitor any portion of the Website and/or Software or any data or content found or accessed through the Website; and"
                    }), /* @__PURE__ */ jsxs("li", {
                      children: ["create, store, access, transfer to any third party or otherwise distribute any material which:", /* @__PURE__ */ jsxs("ul", {
                        className: "list-disc list-inside ml-6 mt-2 space-y-1 text-zinc-300",
                        children: [/* @__PURE__ */ jsx("li", {
                          children: "is unlawful;"
                        }), /* @__PURE__ */ jsx("li", {
                          children: "is or contains material which is harmful, obscene, defamatory, infringes any third party's rights including any third party's intellectual property rights;"
                        }), /* @__PURE__ */ jsx("li", {
                          children: "is or contains material which is of a harassing or offensive nature;"
                        }), /* @__PURE__ */ jsx("li", {
                          children: "contains sexually explicit or other offensive material;"
                        }), /* @__PURE__ */ jsx("li", {
                          children: "promotes the use of unlawful violence against a person or property; or"
                        }), /* @__PURE__ */ jsx("li", {
                          children: "is or contains material which is discriminatory based on race, origin, belief, sexual orientation, physical or mental disability, age or any other illegal category; or"
                        }), /* @__PURE__ */ jsx("li", {
                          children: "infringes or violates any of these Terms."
                        })]
                      })]
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("li", {
                  children: ["If you operate a search engine, web crawler, bot, scraping tool, data mining tool, bulk downloading tool, wget utility, or similar data gathering or extraction tool, you may use the Website and/or Software, subject to the following conditions:", /* @__PURE__ */ jsxs("ol", {
                    className: "list-decimal list-inside ml-6 mt-2 space-y-1 text-zinc-300",
                    children: [/* @__PURE__ */ jsx("li", {
                      children: "you must use a descriptive user agent header;"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "you must follow robots.txt at all times;"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "your access must not adversely affect any aspect of the Website and/or Software function; and"
                    }), /* @__PURE__ */ jsx("li", {
                      children: "you must make it clear how to contact you, either in your user agent string, or on your website if you have one. You represent and warrant that you will not use any automated tools such as artificial intelligence or machine learning to (i) create derivative works of any materials and software contained on this Website and/or Software; (ii) to create any service competitive to Web to MCP's Services or (iii) for other commercial purposes except as expressly permitted by these Terms of Service or the written consent of Web to MCP."
                    })]
                  })]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "4. Accounts and Subscriptions"
              }), /* @__PURE__ */ jsx("h4", {
                className: "text-lg font-semibold text-zinc-100",
                children: "4.1. Your Account"
              }), /* @__PURE__ */ jsxs("ol", {
                className: "list-decimal list-inside space-y-2 text-zinc-300",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "By registering for an account with us, you must provide us with accurate and complete information. It is your responsibility to keep your account information up to date."
                }), /* @__PURE__ */ jsx("li", {
                  children: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
                }), /* @__PURE__ */ jsx("li", {
                  children: "You must notify us immediately of any unauthorized use of your account or any other breach of security."
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "5. Intellectual Property Rights"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "The Website and Software contain materials that are protected by copyright, trademark, and other intellectual property laws. Web to MCP retains all rights, title, and interest in and to the Website and Software, including all intellectual property rights."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "6. Privacy and Data Protection"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Services, to understand our practices regarding the collection and use of your personal information."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "7. Disclaimer of Liability"
              }), /* @__PURE__ */ jsxs("ol", {
                className: "list-decimal list-inside space-y-2 text-zinc-300",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "Our Website and the materials on our Website and/or Software are provided on an 'as is' basis and it is solely for reference only. To the extent permitted by law, Web to MCP makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property, or other violation of rights."
                }), /* @__PURE__ */ jsx("li", {
                  children: "In no event shall Web to MCP or its suppliers be liable for any consequential loss suffered or incurred by you or any third party arising from the use or inability to use this Website or the materials on this Website, even if Web to MCP or an authorized representative has been notified, orally or in writing, of the possibility of such damage."
                }), /* @__PURE__ */ jsx("li", {
                  children: 'For the purpose of these Terms, "consequential loss" includes any consequential loss, indirect loss, real or anticipated loss of profit, loss of benefit, loss of revenue, loss of business, loss of goodwill, loss of opportunity, loss of savings, loss of reputation, loss of use and/or loss or corruption of data, whether under statute, contract, equity, tort (including negligence), indemnity, or otherwise.'
                }), /* @__PURE__ */ jsx("li", {
                  children: "Since some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you."
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "8. Indemnification"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "You agree to indemnify Web to MCP and hold harmless Web to MCP and its employees, officers, directors and agents from and against all claims, damages, costs, expenses, losses and liabilities (including but not limited to legal costs and expenses on a full indemnity basis) that arise directly or indirectly as a result from your access to and use of the materials on our Website and/or Software, any violation of these Terms by you, or any claim by any third party that its intellectual property rights have been infringed as a result from your use of the materials on our Website and/or Software."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "9. Accuracy of Materials"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "The materials appearing on our Website are not comprehensive and are for general reference purposes only. Web to MCP does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on this Website, or otherwise relating to such materials or on any resources linked to this website."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "10. Links to External Websites"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "In the case where you are linked to any external website from our Website, Web to MCP has not reviewed any of such external websites and shall not be responsible for the contents of any such linked sites. The inclusion of any link does not imply endorsement, approval, or control by Web to MCP. Use of any such linked site is at your own risk and we strongly advise you to do your own investigations with respect to the suitability of those sites."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "11. Modifications of Terms"
              }), /* @__PURE__ */ jsxs("ol", {
                className: "list-decimal list-inside space-y-2 text-zinc-300",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "Web to MCP reserves the right to review and amend any of these Terms at our sole discretion from time to time. Upon doing so, we will update our Website and provide you with reasonable notice of such changes, such as to the email address which you have provided to us. Unless otherwise stated, any changes to these Terms will take effect immediately once actual or constructive notice is given to you, which includes publication on our Website. Your continued use of the Website and/or Software after Web to MCP provides such notice will confirm your acceptance of the changes. If you do not agree to the amended Terms, you must stop accessing and using the Website and/or Software."
                }), /* @__PURE__ */ jsx("li", {
                  children: "We recommend that you review the Terms periodically for updates and for the avoidance of doubt, we do not assume any responsibility for ensuring your attention and/or understanding to these Terms."
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "12. Modifications to the Services and Software"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "Web to MCP may at its own discretion and without providing prior notice, modify, adapt or change the Software and/or the Service's features, the user interface and design, the extent and availability of the material in the Services and any other aspect related to the Services. You shall have no claim, complaint, or demand against Web to MCP for effecting such changes or for failures incidental to such changes."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "13. Right to Terminate"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "We may at our sole discretion suspend or terminate your access to our Website and terminate these Terms immediately upon written notice to you for any breach of these Terms of Service."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "14. Severance"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "Any term of these Terms which is wholly or partially void or unenforceable is severed to the extent that it is void or unenforceable. The validity of the remainder of these Terms is not affected."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "15. Governing Law and Jurisdiction"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "These Terms are governed by and construed in accordance with the laws of India. You irrevocably submit to the exclusive jurisdiction of the courts in India. The courts of India shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with these terms."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "16. Termination"
              }), /* @__PURE__ */ jsxs("ol", {
                className: "list-decimal list-inside space-y-2 text-zinc-300",
                children: [/* @__PURE__ */ jsxs("li", {
                  children: ["These terms will continue to apply until terminated by either you or us as follows.", /* @__PURE__ */ jsxs("ol", {
                    className: "list-decimal list-inside ml-6 mt-2 space-y-1 text-zinc-300",
                    children: [/* @__PURE__ */ jsx("li", {
                      children: "You may stop using our Services any time by deactivating your account."
                    }), /* @__PURE__ */ jsxs("li", {
                      children: ["We reserve the right to suspend or terminate your access to our Website and/or Software, if we reasonably believe:", /* @__PURE__ */ jsxs("ul", {
                        className: "list-disc list-inside ml-6 mt-2 space-y-1 text-zinc-300",
                        children: [/* @__PURE__ */ jsx("li", {
                          children: "you are in serious or repeated breach of these terms (including a prolonged failure to settle any payment);"
                        }), /* @__PURE__ */ jsx("li", {
                          children: "you are using the Website and/or Software in a manner that would cause a real risk of harm or loss to us, other users, or the public;"
                        }), /* @__PURE__ */ jsx("li", {
                          children: "we are requested to do so by government or regulatory authorities or as required under applicable laws, regulations or legal processes; or"
                        }), /* @__PURE__ */ jsx("li", {
                          children: "our provision of the Website and/or Software to you is no longer possible or commercially viable."
                        })]
                      })]
                    })]
                  })]
                }), /* @__PURE__ */ jsx("li", {
                  children: "In any of the above cases, we will notify you by the email address associated with your account or at the next time you attempt to access your account, unless we are prohibited from notifying you by law."
                }), /* @__PURE__ */ jsx("li", {
                  children: "Upon termination of your access, these Terms will also terminate."
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "17. Contact"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-zinc-300 leading-relaxed",
                children: ["For any questions or problems relating to our Services and/or Website and/or our Software, or these Terms, you can contact us via email at ", /* @__PURE__ */ jsx("span", {
                  className: "text-zinc-100",
                  children: "team@web-to-mcp.com"
                }), "."]
              })]
            })]
          })]
        })
      })
    }), /* @__PURE__ */ jsx(SimpleFooter, {})]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: terms,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function meta$1({}) {
  return [{
    title: "Privacy Policy - Web to MCP"
  }, {
    name: "description",
    content: "Privacy Policy for Web to MCP. Learn how we collect, use, and protect your personal information."
  }, {
    name: "keywords",
    content: "privacy policy, data protection, personal information, web to mcp, privacy"
  }, {
    property: "og:title",
    content: "Privacy Policy - Web to MCP"
  }, {
    property: "og:description",
    content: "Privacy Policy for Web to MCP. Learn how we collect, use, and protect your personal information."
  }, {
    property: "og:image",
    content: "/og.png"
  }, {
    property: "og:image:width",
    content: "1200"
  }, {
    property: "og:image:height",
    content: "630"
  }, {
    property: "og:image:type",
    content: "image/png"
  }, {
    property: "og:type",
    content: "website"
  }, {
    property: "og:site_name",
    content: "Web to MCP"
  }, {
    property: "og:url",
    content: "https://web-to-mcp.com/privacy"
  }, {
    name: "twitter:card",
    content: "summary_large_image"
  }, {
    name: "twitter:title",
    content: "Privacy Policy - Web to MCP"
  }, {
    name: "twitter:description",
    content: "Privacy Policy for Web to MCP. Learn how we collect, use, and protect your personal information."
  }, {
    name: "twitter:image",
    content: "/og.png"
  }];
}
const privacy = UNSAFE_withComponentProps(function Privacy() {
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden",
    children: [/* @__PURE__ */ jsx(Glow, {}), /* @__PURE__ */ jsxs("div", {
      className: "absolute inset-0 pointer-events-none",
      children: [/* @__PURE__ */ jsx(motion.div, {
        className: "absolute left-[10%] top-[15%] h-32 w-48 rounded-full bg-zinc-800/10 blur-xl",
        animate: {
          x: [0, 20, 0],
          y: [0, -10, 0],
          opacity: [0.1, 0.15, 0.1]
        },
        transition: {
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }), /* @__PURE__ */ jsx(motion.div, {
        className: "absolute right-[20%] top-[25%] h-24 w-36 rounded-full bg-zinc-700/8 blur-lg",
        animate: {
          x: [0, -15, 0],
          y: [0, 8, 0],
          opacity: [0.08, 0.12, 0.08]
        },
        transition: {
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }
      }), /* @__PURE__ */ jsx(motion.div, {
        className: "absolute left-[60%] top-[40%] h-16 w-24 rounded-full bg-zinc-600/6 blur-md",
        animate: {
          x: [0, 12, 0],
          y: [0, -5, 0],
          opacity: [0.06, 0.1, 0.06]
        },
        transition: {
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8
        }
      })]
    }), /* @__PURE__ */ jsx(SimpleHeader, {}), /* @__PURE__ */ jsx("div", {
      className: "container mx-auto px-4 py-8 sm:py-12",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-4xl mx-auto",
        children: /* @__PURE__ */ jsxs("div", {
          className: "bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/30 rounded-lg p-6 sm:p-8",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl sm:text-3xl font-bold text-zinc-100 mb-4",
              children: "Privacy Policy"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-zinc-400",
              children: "Last updated on 20/08/25"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "prose prose-invert max-w-none space-y-6",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "Your privacy is important to us. It is Web to MCP's policy to respect your privacy and comply with any applicable law and regulation regarding any personal information we may collect about you, including across the website and softwares we own and operate."
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "Personal information is any information about you which can be used to identify you. This includes information about you as a person (such as name, address, and date of birth), your devices, payment details, and even information about how you use a website or online service."
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "In the event our site contains links to third-party sites and services, please be aware that those sites and services have their own privacy policies. After following a link to any third-party content, you should read their posted privacy policy information about how they collect and use personal information. This Privacy Policy does not apply to any of your activities after you leave our site."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "1. Information We Collect"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-zinc-300 leading-relaxed",
                children: ['Information we collect falls into one of two categories: "', /* @__PURE__ */ jsx("strong", {
                  className: "text-zinc-100",
                  children: "voluntarily provided"
                }), '" information and "', /* @__PURE__ */ jsx("strong", {
                  className: "text-zinc-100",
                  children: "automatically collected"
                }), '" information.']
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: '"Voluntarily provided" information refers to any information you knowingly and actively provide us when using or participating in any of our services and promotions.'
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: '"Automatically collected" information refers to any information automatically sent by your devices in the course of accessing our products and services.'
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "2. Log Data"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "When you visit our website, our servers may automatically log the standard data provided by your web browser. It may include your device's Internet Protocol (IP) address, your browser type and version, the pages you visit, the time and date of your visit, the time spent on each page, and other details about your visit."
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "Additionally, if you encounter certain errors while using the site, we may automatically collect data about the error and the circumstances surrounding its occurrence. This data may include technical details about your device, what you were trying to do when the error happened, and other technical information relating to the problem. You may or may not receive notice of such errors, even in the moment they occur, that they have occurred, or what the nature of the error is."
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "Please be aware that while this information may not be personally identifying by itself, it may be possible to combine it with other data to personally identify individual persons."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "3. Device Data"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "When you visit our website or interact with our services, we may automatically collect data about your device, such as:"
              }), /* @__PURE__ */ jsxs("ul", {
                className: "list-disc list-inside ml-6 space-y-1 text-zinc-300",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "Device Type"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Operating System"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Unique device identifiers"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Device settings"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Geo-location data"
                })]
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "Data we collect can depend on the individual settings of your device and software. We recommend checking the policies of your device manufacturer or software provider to learn what information they make available to us."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "4. Personal Information"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "We may ask for personal information — for example, when you submit content to us or when you contact us — which may include one or more of the following:"
              }), /* @__PURE__ */ jsxs("ul", {
                className: "list-disc list-inside ml-6 space-y-1 text-zinc-300",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "Name"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Email"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Social media profiles"
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "5. User-Generated Content"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: 'We consider "user-generated content" to be materials (text, image and/or video content) voluntarily supplied to us by our users for the purpose of publication on our website or re-publishing on our social media channels. All user-generated content is associated with the account or email address used to submit the materials.'
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "Please be aware that any content you submit for the purpose of publication will be public after posting (and subsequent review or vetting process). Once published, it may be accessible to third parties not covered under this privacy policy."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "6. Legitimate Reasons for Processing Your Personal Information"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "We only collect and use your personal information when we have a legitimate reason for doing so. In which instance, we only collect personal information that is reasonably necessary to provide and improve our services to you."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "7. Collection and Use of Information"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "We may collect personal information from you when you do any of the following on our website:"
              }), /* @__PURE__ */ jsxs("ul", {
                className: "list-disc list-inside ml-6 space-y-1 text-zinc-300",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "Register for an account"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Sign up to receive updates from us via email or social media channels"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Use a mobile device or web browser to access our content"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Contact us via email, social media, or on any similar technologies"
                }), /* @__PURE__ */ jsx("li", {
                  children: "When you mention us on social media"
                })]
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "We may collect, hold, use, and disclose information for the following purposes, and personal information will not be further processed in a manner that is incompatible with these purposes:"
              }), /* @__PURE__ */ jsxs("ul", {
                className: "list-disc list-inside ml-6 space-y-1 text-zinc-300",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "To provide you with our platform's core features and services"
                }), /* @__PURE__ */ jsx("li", {
                  children: "To contact and communicate with you for analytics, market research, and business development, including to operate and improve our website, associated applications, and associated social media platforms"
                }), /* @__PURE__ */ jsx("li", {
                  children: "To enable you to access and use our website, associated applications, and associated social media platforms"
                }), /* @__PURE__ */ jsx("li", {
                  children: "For internal record keeping and administrative purposes to comply with our legal obligations and resolve any disputes that we may have"
                }), /* @__PURE__ */ jsx("li", {
                  children: "For security and fraud prevention, and to ensure that our sites and apps are safe, secure, and used in line with our terms of use"
                }), /* @__PURE__ */ jsx("li", {
                  children: "For technical assessment, including to operate and improve our app, associated applications, and associated social media platforms"
                })]
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "We may combine voluntarily provided and automatically collected personal information with general information or research data we receive from other trusted sources. For example, our marketing and market research activities may uncover data and insights, which we may combine with information about how visitors use our site to improve our site and your experience on it."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "8. Security of Your Personal Information"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "When we collect and process personal information, and while we retain this information, we will protect it within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification."
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "Although we will do our best to protect the personal information you provide to us, we advise that no method of electronic transmission or storage is 100% secure, and no one can guarantee absolute data security."
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "You are responsible for selecting any password and its overall security strength, ensuring the security of your own information within the bounds of our services. For example, ensuring any passwords associated with accessing your personal information and accounts are secure and confidential."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "9. How Long We Keep Your Personal Information"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "We keep your personal information only for as long as we need to. This time period may depend on what we are using your information for, in accordance with this privacy policy. For example, if you have provided us with personal information as part of creating an account with us, we may retain this information for the duration your account exists on our system. If your personal information is no longer required for this purpose, we will delete it or make it anonymous by removing all details that identify you."
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "However, if necessary, we may retain your personal information for our compliance with a legal, accounting, or reporting obligation or for archiving purposes in the public interest, scientific, or historical research purposes or statistical purposes."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "10. Children's Privacy"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "We do not aim any of our products or services directly at children under the age of 13, and we do not knowingly collect personal information about children under 13."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "11. Disclosure of Personal Information to Third Parties"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "We may disclose personal information to:"
              }), /* @__PURE__ */ jsxs("ul", {
                className: "list-disc list-inside ml-6 space-y-1 text-zinc-300",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "A parent, subsidiary, or affiliate of our company"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Third-party service providers for the purpose of enabling them to provide their services, including (without limitation) IT service providers, data storage, hosting and server providers, analytics, error loggers, debt collectors, maintenance or problem-solving providers, marketing providers, professional advisors, and payment systems operators"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Our employees, contractors, and/or related entities"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Our existing or potential agents or business partners"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Credit reporting agencies, courts, tribunals, and regulatory authorities, in the event you fail to pay for goods or services we have provided to you"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Courts, tribunals, regulatory authorities, and law enforcement officers, as required by law, in connection with any actual or prospective legal proceedings, or in order to establish, exercise, or defend our legal rights"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Third parties, including agents or sub-contractors, who assist us in providing information, products, services, or direct marketing to you"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Third parties to collect and process data"
                }), /* @__PURE__ */ jsx("li", {
                  children: "An entity that buys, or to which we transfer all or substantially all of our assets and business"
                })]
              }), /* @__PURE__ */ jsx("h4", {
                className: "text-lg font-semibold text-zinc-100",
                children: "Third parties we currently use include:"
              }), /* @__PURE__ */ jsxs("ul", {
                className: "list-disc list-inside ml-6 space-y-1 text-zinc-300",
                children: [/* @__PURE__ */ jsx("li", {
                  children: "Google Analytics"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Mixpanel"
                }), /* @__PURE__ */ jsx("li", {
                  children: "Sentry"
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "12. International Transfers of Personal Information"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "The personal information we collect is stored and/or processed in United States, or where we or our partners, affiliates, and third-party providers maintain facilities."
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "The countries to which we store, process, or transfer your personal information may not have the same data protection laws as the country in which you initially provided the information. If we transfer your personal information to third parties in other countries: (i) we will perform those transfers in accordance with the requirements of applicable law; and (ii) we will protect the transferred personal information in accordance with this privacy policy."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "13. Your Rights and Controlling Your Personal Information"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsxs("p", {
                  className: "text-zinc-300 leading-relaxed",
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-zinc-100",
                    children: "Your choice:"
                  }), " By providing personal information to us, you understand we will collect, hold, use, and disclose your personal information in accordance with this privacy policy. You do not have to provide personal information to us, however, if you do not, it may affect your use of our website or the products and/or services offered on or through it."]
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-zinc-300 leading-relaxed",
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-zinc-100",
                    children: "Information from third parties:"
                  }), " If we receive personal information about you from a third party, we will protect it as set out in this privacy policy. If you are a third party providing personal information about somebody else, you represent and warrant that you have such person's consent to provide the personal information to us."]
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-zinc-300 leading-relaxed",
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-zinc-100",
                    children: "Marketing permission:"
                  }), " If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by contacting us using the details below."]
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-zinc-300 leading-relaxed",
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-zinc-100",
                    children: "Access:"
                  }), " You may request details of the personal information that we hold about you."]
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-zinc-300 leading-relaxed",
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-zinc-100",
                    children: "Correction:"
                  }), " If you believe that any information we hold about you is inaccurate, out of date, incomplete, irrelevant, or misleading, please contact us using the details provided in this privacy policy. We will take reasonable steps to correct any information found to be inaccurate, incomplete, misleading, or out of date."]
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-zinc-300 leading-relaxed",
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-zinc-100",
                    children: "Non-discrimination:"
                  }), " We will not discriminate against you for exercising any of your rights over your personal information. Unless your personal information is required to provide you with a particular service or offer (for example providing user support), we will not deny you goods or services and/or charge you different prices or rates for goods or services, including through granting discounts or other benefits, or imposing penalties, or provide you with a different level or quality of goods or services."]
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-zinc-300 leading-relaxed",
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-zinc-100",
                    children: "Notification of data breaches:"
                  }), " We will comply with laws applicable to us in respect of any data breach."]
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-zinc-300 leading-relaxed",
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-zinc-100",
                    children: "Complaints:"
                  }), " If you believe that we have breached a relevant data protection law and wish to make a complaint, please contact us using the details below and provide us with full details of the alleged breach. We will promptly investigate your complaint and respond to you, in writing, setting out the outcome of our investigation and the steps we will take to deal with your complaint. You also have the right to contact a regulatory body or data protection authority in relation to your complaint."]
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-zinc-300 leading-relaxed",
                  children: [/* @__PURE__ */ jsx("strong", {
                    className: "text-zinc-100",
                    children: "Unsubscribe:"
                  }), " To unsubscribe from our email database or opt-out of communications (including marketing communications), please contact us using the details provided in this privacy policy, or opt-out using the opt-out facilities provided in the communication. We may need to request specific information from you to help us confirm your identity."]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "14. Business Transfers"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "If we or our assets are acquired, or in the unlikely event that we go out of business or enter bankruptcy, we would include data, including your personal information, among the assets transferred to any parties who acquire us. You acknowledge that such transfers may occur, and that any parties who acquire us may, to the extent permitted by applicable law, continue to use your personal information according to this policy, which they will be required to assume as it is the basis for any ownership or use rights we have over such information."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "15. Limits of Our Policy"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and policies of those sites, and cannot accept responsibility or liability for their respective privacy practices."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "16. Changes to This Policy"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "At our discretion, we may change our privacy policy to reflect updates to our business processes, current acceptable practices, or legislative or regulatory changes. If we decide to change this privacy policy, we will post the changes here at the same link by which you are accessing this privacy policy."
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "If the changes are significant, or if required by applicable law, we will contact you (based on your selected preferences for communications from us) and all our registered users with the new details and links to the updated or changed policy."
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "If required by law, we will get your permission or give you the opportunity to opt in to or opt out of, as applicable, any new uses of your personal information."
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "17. Contact Us"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-zinc-300 leading-relaxed",
                children: ["For any questions or concerns regarding this document, you may contact us via email at ", /* @__PURE__ */ jsx("span", {
                  className: "text-zinc-100",
                  children: "team@web-to-mcp.com"
                }), "."]
              })]
            })]
          })]
        })
      })
    }), /* @__PURE__ */ jsx(SimpleFooter, {})]
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: privacy,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function meta({}) {
  return [{
    title: "Refund Policy - Web to MCP"
  }, {
    name: "description",
    content: "Refund Policy for Web to MCP. Learn about our refund and cancellation policies."
  }, {
    name: "keywords",
    content: "refund policy, cancellation policy, web to mcp, refunds, money back"
  }, {
    property: "og:title",
    content: "Refund Policy - Web to MCP"
  }, {
    property: "og:description",
    content: "Refund Policy for Web to MCP. Learn about our refund and cancellation policies."
  }, {
    property: "og:image",
    content: "/og.png"
  }, {
    property: "og:image:width",
    content: "1200"
  }, {
    property: "og:image:height",
    content: "630"
  }, {
    property: "og:image:type",
    content: "image/png"
  }, {
    property: "og:type",
    content: "website"
  }, {
    property: "og:site_name",
    content: "Web to MCP"
  }, {
    property: "og:url",
    content: "https://web-to-mcp.com/refund"
  }, {
    name: "twitter:card",
    content: "summary_large_image"
  }, {
    name: "twitter:title",
    content: "Refund Policy - Web to MCP"
  }, {
    name: "twitter:description",
    content: "Refund Policy for Web to MCP. Learn about our refund and cancellation policies."
  }, {
    name: "twitter:image",
    content: "/og.png"
  }];
}
const refund = UNSAFE_withComponentProps(function Refund() {
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden",
    children: [/* @__PURE__ */ jsx(Glow, {}), /* @__PURE__ */ jsxs("div", {
      className: "absolute inset-0 pointer-events-none",
      children: [/* @__PURE__ */ jsx(motion.div, {
        className: "absolute left-[10%] top-[15%] h-32 w-48 rounded-full bg-zinc-800/10 blur-xl",
        animate: {
          x: [0, 20, 0],
          y: [0, -10, 0],
          opacity: [0.1, 0.15, 0.1]
        },
        transition: {
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }), /* @__PURE__ */ jsx(motion.div, {
        className: "absolute right-[20%] top-[25%] h-24 w-36 rounded-full bg-zinc-700/8 blur-lg",
        animate: {
          x: [0, -15, 0],
          y: [0, 8, 0],
          opacity: [0.08, 0.12, 0.08]
        },
        transition: {
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }
      }), /* @__PURE__ */ jsx(motion.div, {
        className: "absolute left-[60%] top-[40%] h-16 w-24 rounded-full bg-zinc-600/6 blur-md",
        animate: {
          x: [0, 12, 0],
          y: [0, -5, 0],
          opacity: [0.06, 0.1, 0.06]
        },
        transition: {
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8
        }
      })]
    }), /* @__PURE__ */ jsx(SimpleHeader, {}), /* @__PURE__ */ jsx("div", {
      className: "container mx-auto px-4 py-8 sm:py-12",
      children: /* @__PURE__ */ jsx("div", {
        className: "max-w-4xl mx-auto",
        children: /* @__PURE__ */ jsxs("div", {
          className: "bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/30 rounded-lg p-6 sm:p-8",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "mb-8",
            children: [/* @__PURE__ */ jsx("h2", {
              className: "text-2xl sm:text-3xl font-bold text-zinc-100 mb-4",
              children: "Refund Policy"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-zinc-400",
              children: "Last updated on 20/08/25"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "prose prose-invert max-w-none space-y-6",
            children: [/* @__PURE__ */ jsx("div", {
              className: "space-y-4",
              children: /* @__PURE__ */ jsxs("p", {
                className: "text-zinc-300 leading-relaxed",
                children: ["Strictly no refunds will be offered unless required by the law or at company's sole discretion, if any. In case a refund is offered, it will be processed within 15 days. Please raise all refund requests to email ", /* @__PURE__ */ jsx("span", {
                  className: "text-zinc-100",
                  children: "team@web-to-mcp.com"
                }), "."]
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "Plan Cancellation"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-zinc-300 leading-relaxed",
                children: "You may cancel your Plan any time but please note that such cancellation will only be effective at the end of the then-current Plan period. Unless required by law, you will not receive a refund of any portion of the subscription fee paid for the then-current subscription period at the time of cancellation."
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-zinc-300 leading-relaxed",
                children: ["Cancellation can be initiated from your account dashboard. In case you need our assistance with cancellation, please raise a request to ", /* @__PURE__ */ jsx("span", {
                  className: "text-zinc-100",
                  children: "team@web-to-mcp.com"
                }), "."]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "Refund Process"
              }), /* @__PURE__ */ jsxs("div", {
                className: "space-y-3",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex items-start gap-3",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "text-zinc-100 font-bold text-sm",
                    children: "1."
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-300 font-semibold",
                      children: "Submit Refund Request"
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-xs text-zinc-400 mt-1",
                      children: "Email your refund request to team@web-to-mcp.com with your account details and reason for refund"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex items-start gap-3",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "text-zinc-100 font-bold text-sm",
                    children: "2."
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-300 font-semibold",
                      children: "Review Process"
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-xs text-zinc-400 mt-1",
                      children: "Our team will review your request and determine eligibility based on our refund policy"
                    })]
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex items-start gap-3",
                  children: [/* @__PURE__ */ jsx("span", {
                    className: "text-zinc-100 font-bold text-sm",
                    children: "3."
                  }), /* @__PURE__ */ jsxs("div", {
                    children: [/* @__PURE__ */ jsx("p", {
                      className: "text-sm text-zinc-300 font-semibold",
                      children: "Processing Time"
                    }), /* @__PURE__ */ jsx("p", {
                      className: "text-xs text-zinc-400 mt-1",
                      children: "If approved, refunds will be processed within 15 days to your original payment method"
                    })]
                  })]
                })]
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-4",
              children: [/* @__PURE__ */ jsx("h3", {
                className: "text-xl sm:text-2xl font-semibold text-zinc-100",
                children: "Contact Information"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-zinc-300 leading-relaxed",
                children: ["For any questions regarding refunds or cancellations, please contact us at ", /* @__PURE__ */ jsx("span", {
                  className: "text-zinc-100",
                  children: "team@web-to-mcp.com"
                }), "."]
              })]
            })]
          })]
        })
      })
    }), /* @__PURE__ */ jsx(SimpleFooter, {})]
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: refund,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border border-green-500/30 bg-black text-green-400 shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight text-green-400 font-mono",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-green-300/80 font-mono", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-green-500/30 bg-black px-3 py-1 text-sm text-green-300 font-mono shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-green-500/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const _404 = UNSAFE_withComponentProps(function NotFound() {
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "absolute inset-0 pointer-events-none",
      children: [/* @__PURE__ */ jsx(motion.div, {
        className: "absolute left-[10%] top-[15%] h-32 w-48 rounded-full bg-zinc-800/10 blur-xl",
        animate: {
          x: [0, 20, 0],
          y: [0, -10, 0],
          opacity: [0.1, 0.15, 0.1]
        },
        transition: {
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }), /* @__PURE__ */ jsx(motion.div, {
        className: "absolute right-[20%] top-[25%] h-24 w-36 rounded-full bg-zinc-700/8 blur-lg",
        animate: {
          x: [0, -15, 0],
          y: [0, 8, 0],
          opacity: [0.08, 0.12, 0.08]
        },
        transition: {
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }
      }), /* @__PURE__ */ jsx(motion.div, {
        className: "absolute left-[60%] top-[40%] h-16 w-24 rounded-full bg-zinc-600/6 blur-md",
        animate: {
          x: [0, 12, 0],
          y: [0, -5, 0],
          opacity: [0.06, 0.1, 0.06]
        },
        transition: {
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 8
        }
      })]
    }), /* @__PURE__ */ jsx(SimpleHeader, {}), /* @__PURE__ */ jsx("main", {
      className: "relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4",
      children: /* @__PURE__ */ jsxs("div", {
        className: "text-center max-w-2xl mx-auto",
        children: [/* @__PURE__ */ jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            duration: 0.6
          },
          className: "mb-8",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-8xl font-bold text-zinc-100 mb-4",
            children: "404"
          }), /* @__PURE__ */ jsx("h2", {
            className: "text-2xl font-semibold text-zinc-300 mb-4",
            children: "Page Not Found"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-zinc-400 text-lg leading-relaxed",
            children: "The page you're looking for doesn't exist or has been moved."
          })]
        }), /* @__PURE__ */ jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 20
          },
          animate: {
            opacity: 1,
            y: 0
          },
          transition: {
            duration: 0.6,
            delay: 0.2
          },
          className: "space-y-4",
          children: [/* @__PURE__ */ jsx("a", {
            href: "/",
            className: "inline-block bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-8 py-3 rounded-lg font-medium transition-colors duration-200 border border-zinc-700 hover:border-zinc-600",
            children: "Go Home"
          }), /* @__PURE__ */ jsx("div", {
            className: "text-zinc-500 text-sm",
            children: "Or use the navigation menu above to find what you're looking for."
          })]
        })]
      })
    })]
  });
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _404
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-Jf5gTs0v.js", "imports": ["/assets/chunk-OIYGIGL5-Ts-zf3fD.js", "/assets/index-myKQ8QYU.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-UM1Zmq8w.js", "imports": ["/assets/chunk-OIYGIGL5-Ts-zf3fD.js", "/assets/index-myKQ8QYU.js", "/assets/createLucideIcon-D5afcRJv.js", "/assets/toast-BnMQFhSs.js", "/assets/use-toast-evsOeytk.js", "/assets/index-CVOLSXQ2.js", "/assets/index-CDHdnVW9.js", "/assets/index-COlvqssi.js", "/assets/x-Chz6t08v.js"], "css": ["/assets/root-CCKcMuFd.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-Dlwq9T-r.js", "imports": ["/assets/chunk-OIYGIGL5-Ts-zf3fD.js", "/assets/UtilityComponents-CGL66K5l.js", "/assets/TechReq-DUmc_ASi.js", "/assets/UIComponents-Hsi92piH.js", "/assets/menu-D_HIEtZc.js", "/assets/createLucideIcon-D5afcRJv.js", "/assets/x-Chz6t08v.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/cursor": { "id": "routes/cursor", "parentId": "root", "path": "cursor", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/cursor-BwCod9Wt.js", "imports": ["/assets/chunk-OIYGIGL5-Ts-zf3fD.js", "/assets/TechReq-DUmc_ASi.js", "/assets/SimpleFooter-D-FfmzKM.js", "/assets/UtilityComponents-CGL66K5l.js", "/assets/UIComponents-Hsi92piH.js", "/assets/createLucideIcon-D5afcRJv.js", "/assets/monitor-hgbeRLoK.js", "/assets/menu-D_HIEtZc.js", "/assets/x-Chz6t08v.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/claude-code": { "id": "routes/claude-code", "parentId": "root", "path": "claude-code", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/claude-code-C0oPZfuw.js", "imports": ["/assets/chunk-OIYGIGL5-Ts-zf3fD.js", "/assets/TechReq-DUmc_ASi.js", "/assets/SimpleFooter-D-FfmzKM.js", "/assets/UtilityComponents-CGL66K5l.js", "/assets/UIComponents-Hsi92piH.js", "/assets/createLucideIcon-D5afcRJv.js", "/assets/monitor-hgbeRLoK.js", "/assets/terminal-C25PQKZk.js", "/assets/menu-D_HIEtZc.js", "/assets/x-Chz6t08v.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/dashboard": { "id": "routes/dashboard", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/dashboard-EqNT-Vzd.js", "imports": ["/assets/chunk-OIYGIGL5-Ts-zf3fD.js", "/assets/createLucideIcon-D5afcRJv.js", "/assets/use-toast-evsOeytk.js", "/assets/UtilityComponents-CGL66K5l.js", "/assets/UIComponents-Hsi92piH.js", "/assets/avatar-C7Pgygx3.js", "/assets/terminal-C25PQKZk.js", "/assets/index-CDHdnVW9.js", "/assets/index-myKQ8QYU.js", "/assets/index-CVOLSXQ2.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/terms": { "id": "routes/terms", "parentId": "root", "path": "terms", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/terms-1nfvQ5Vr.js", "imports": ["/assets/chunk-OIYGIGL5-Ts-zf3fD.js", "/assets/SimpleHeader-qcUAa4MV.js", "/assets/SimpleFooter-D-FfmzKM.js", "/assets/UtilityComponents-CGL66K5l.js", "/assets/createLucideIcon-D5afcRJv.js", "/assets/index-CVOLSXQ2.js", "/assets/index-COlvqssi.js", "/assets/menu-D_HIEtZc.js", "/assets/x-Chz6t08v.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/privacy": { "id": "routes/privacy", "parentId": "root", "path": "privacy", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/privacy-YdOhOCAD.js", "imports": ["/assets/chunk-OIYGIGL5-Ts-zf3fD.js", "/assets/SimpleHeader-qcUAa4MV.js", "/assets/SimpleFooter-D-FfmzKM.js", "/assets/UtilityComponents-CGL66K5l.js", "/assets/createLucideIcon-D5afcRJv.js", "/assets/index-CVOLSXQ2.js", "/assets/index-COlvqssi.js", "/assets/menu-D_HIEtZc.js", "/assets/x-Chz6t08v.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/refund": { "id": "routes/refund", "parentId": "root", "path": "refund", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/refund-D6BeJic2.js", "imports": ["/assets/chunk-OIYGIGL5-Ts-zf3fD.js", "/assets/SimpleHeader-qcUAa4MV.js", "/assets/SimpleFooter-D-FfmzKM.js", "/assets/UtilityComponents-CGL66K5l.js", "/assets/createLucideIcon-D5afcRJv.js", "/assets/index-CVOLSXQ2.js", "/assets/index-COlvqssi.js", "/assets/menu-D_HIEtZc.js", "/assets/x-Chz6t08v.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/404": { "id": "routes/404", "parentId": "root", "path": "*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/404-hflBc68v.js", "imports": ["/assets/chunk-OIYGIGL5-Ts-zf3fD.js", "/assets/SimpleHeader-qcUAa4MV.js", "/assets/avatar-C7Pgygx3.js", "/assets/createLucideIcon-D5afcRJv.js", "/assets/toast-BnMQFhSs.js", "/assets/UtilityComponents-CGL66K5l.js", "/assets/index-CVOLSXQ2.js", "/assets/index-COlvqssi.js", "/assets/menu-D_HIEtZc.js", "/assets/x-Chz6t08v.js", "/assets/index-CDHdnVW9.js", "/assets/index-myKQ8QYU.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-908c567d.js", "version": "908c567d", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/cursor": {
    id: "routes/cursor",
    parentId: "root",
    path: "cursor",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/claude-code": {
    id: "routes/claude-code",
    parentId: "root",
    path: "claude-code",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/terms": {
    id: "routes/terms",
    parentId: "root",
    path: "terms",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/privacy": {
    id: "routes/privacy",
    parentId: "root",
    path: "privacy",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/refund": {
    id: "routes/refund",
    parentId: "root",
    path: "refund",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/404": {
    id: "routes/404",
    parentId: "root",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
