import React from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigation } from './hooks/useNavigation';
import { useFooter } from './hooks/useFooter';
import { useSite } from '../hooks/useSites';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';

interface SiteLayoutProps {
  siteId: string;
}

/**
 * Site layout wrapper that provides navigation and footer.
 * Persists across page transitions.
 */
export const SiteLayout: React.FC<SiteLayoutProps> = ({ siteId }) => {
  const { data: site } = useSite(siteId);
  const { navigation, loading: navLoading } = useNavigation(siteId);
  const { footer, loading: footerLoading } = useFooter(siteId);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Navigation */}
      {!navLoading && navigation && (
        <SiteHeader
          siteName={site?.name}
          items={navigation.items || []}
        />
      )}

      {/* Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      {!footerLoading && (
        <SiteFooter footer={footer} siteName={site?.name} />
      )}
    </div>
  );
};

