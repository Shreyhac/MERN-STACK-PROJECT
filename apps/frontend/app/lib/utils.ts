import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get CSRF token from cookie
 * @returns CSRF token string or null if not found
 */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') {
    return null; // Server-side rendering
  }
  
  // Get cookie value by name
  const name = 'csrftoken=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  
  return null;
}

/**
 * Set CSRF token in cookie
 * @param token - The CSRF token to set
 * @param expires - Optional expiration date (default: session cookie)
 */
export function setCsrfToken(token: string, expires?: Date): void {
  if (typeof document === 'undefined') {
    return; // Server-side rendering
  }
  
  let cookieValue = `csrftoken=${token}`;
  
  // Add expiration if provided
  if (expires) {
    cookieValue += `; expires=${expires.toUTCString()}`;
  }
  
  // Add secure and sameSite attributes for security
  cookieValue += '; path=/; SameSite=Lax';
  
  // Add secure flag if on HTTPS
  if (window.location.protocol === 'https:') {
    cookieValue += '; Secure';
  }
  
  document.cookie = cookieValue;
} 