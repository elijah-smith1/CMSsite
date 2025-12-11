import React from 'react';
import { PageRenderer } from './components/PageRenderer';

interface SitePageProps {
  siteId: string;
}

/**
 * Wrapper component for rendering site pages.
 * Used as the element for all public site routes.
 */
export const SitePage: React.FC<SitePageProps> = ({ siteId }) => {
  return <PageRenderer siteId={siteId} />;
};

