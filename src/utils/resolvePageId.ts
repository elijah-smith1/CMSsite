/**
 * Resolves a URL pathname to a Firestore page document ID.
 * 
 * This is the SINGLE SOURCE OF TRUTH for page ID resolution.
 * Use this function EVERYWHERE page IDs are derived from URLs.
 * 
 * Mapping:
 *   "/" or ""       → "home"
 *   "/about"        → "about"
 *   "/programs"     → "programs"
 *   "/schedule"     → "schedule"
 *   "/gallery"      → "gallery"
 *   "/contact"      → "contact"
 */
export function resolvePageId(pathname: string): string {
  // Handle root path
  if (pathname === '/' || pathname === '') {
    return 'home';
  }
  
  // Remove leading slash and return
  return pathname.replace(/^\//, '');
}
