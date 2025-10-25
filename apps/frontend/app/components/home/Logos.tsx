import React from "react";

// ---- Logo marks (simple inline SVG placeholders) ----
interface LogoProps {
  className?: string;
}

export const CursorLogo: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 40 40" aria-hidden className={`h-6 w-6 ${props.className || ""}`}>
    <rect width="40" height="40" rx="8" fill="#1e1e1e" />
    <path d="M11 11l18 7-7 2-2 7-9-16z" fill="#0ea5e9" />
  </svg>
);

export const ClaudeLogo: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 40 40" aria-hidden className={`h-6 w-6 ${props.className || ""}`}>
    <rect width="40" height="40" rx="8" fill="#f59e0b" />
    <path d="M20 8c6.6 0 12 5.4 12 12s-5.4 12-12 12S8 26.6 8 20 13.4 8 20 8zm0 3c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm0 3c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z" fill="white" />
  </svg>
);

// Brand Favicons for integration guides
export const CursorFavicon: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden className={`h-4 w-4 ${props.className || ""}`}>
    <rect width="24" height="24" rx="4" fill="#0ea5e9" />
    <path d="M6 6l12 4.5-4.5 1.2-1.2 4.5L6 6z" fill="white" />
  </svg>
);

export const ClaudeFavicon: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden className={`h-4 w-4 ${props.className || ""}`}>
    <rect width="24" height="24" rx="4" fill="#f59e0b" />
    <circle cx="12" cy="12" r="6" fill="white" />
    <circle cx="12" cy="12" r="3" fill="#f59e0b" />
  </svg>
);

export const GoogleLogo: React.FC<LogoProps> = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden className={`h-5 w-5 ${props.className || ""}`}>
    <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.4-5.1 3.4-3.1 0-5.6-2.6-5.6-5.8s2.5-5.8 5.6-5.8c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.7 3 14.6 2 12 2 6.9 2 2.7 6.2 2.7 11.4S6.9 20.8 12 20.8c6.3 0 8.7-4.4 8.7-6.6 0-.5 0-.8-.1-1.2H12z"/>
    <path fill="#34A853" d="M3.6 7.4l3 2.2c.8-2.3 3-4 5.4-4 1.8 0 3 .7 3.7 1.4l2.5-2.4C16.7 3 14.6 2 12 2 8 2 4.7 4.3 3.6 7.4z"/>
    <path fill="#FBBC05" d="M12 22c2.6 0 4.7-.9 6.2-2.5l-2.9-2.3c-.8.6-1.9 1-3.3 1-2.5 0-4.6-1.7-5.3-4.1l-3 .2C4.9 19.7 8.1 22 12 22z"/>
    <path fill="#4285F4" d="M20.7 14.2c.2-.7.3-1.4.3-2.2 0-.8-.1-1.5-.3-2.2H12v4.4h8.7z"/>
  </svg>
);
