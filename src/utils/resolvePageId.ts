/**
 * Resolves a URL pathname to a Firestore page document ID.
 * 
 * This is the SINGLE SOURCE OF TRUTH for page ID resolution.
 * Use this function EVERYWHERE page IDs are derived from URLs.
 * 
 * CRITICAL MAPPING:
 *   "/" or ""       → "home"
 *   "/about"        → "about"
 *   "/programs"     → "programs"
 *   "/schedule"     → "schedule"
 *   "/gallery"      → "gallery"
 *   "/contact"      → "contact"
 * 
 * RULES:
 * 1. Route "/" MUST map to "home"
 * 2. No other page may map to "/"
 * 3. All other routes strip the leading slash
 * 4. No fallback logic - deterministic only
 */
export function resolvePageId(pathname: string): string {
  // Normalize: remove leading/trailing slashes
  const route = pathname.replace(/^\/+|\/+$/g, '');
  
  // CRITICAL: "/" maps to "home" - no other mapping allowed
  if (route === '' || route === '/') {
    return 'home';
  }
  
  // All other routes: use the path as the page ID
  // e.g., "/about" → "about"
  return route;
}

/**
 * Resolves a page ID to a URL path.
 * Inverse of resolvePageId.
 */
export function resolvePagePath(pageId: string): string {
  // CRITICAL: "home" maps to "/"
  if (pageId === 'home') {
    return '/';
  }
  
  // All other pages: prepend slash
  return `/${pageId}`;
}

/**
 * Validates that a string is a valid Firestore document ID.
 * Used to prevent invalid page IDs from being used.
 */
export function isValidPageId(pageId: string): boolean {
  // Must not be empty
  if (!pageId) return false;
  
  // Must not contain slashes (would indicate a path, not an ID)
  if (pageId.includes('/')) return false;
  
  // Must not start with a dot (Firestore restriction)
  if (pageId.startsWith('.')) return false;
  
  // Must be reasonable length
  if (pageId.length > 100) return false;
  
  return true;
}
