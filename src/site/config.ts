/**
 * Site configuration.
 * 
 * IMPORTANT: Set your siteId here.
 * This should match the document ID in Firestore: sites/{siteId}
 */

// For development, you can set this to your test site ID
// In production, this could come from environment variables or subdomain parsing
export const SITE_ID = import.meta.env.VITE_SITE_ID || 'demo-site';

/**
 * Determines if we're in CMS mode or public site mode.
 * CMS routes start with /cms
 */
export function isCMSRoute(pathname: string): boolean {
  return pathname.startsWith('/cms');
}

