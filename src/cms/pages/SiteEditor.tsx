import React, { useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { useSite, useSitePages } from '../../hooks/useSites';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import {
  ArrowLeft,
  FileText,
  Navigation,
  LayoutTemplate,
  Settings,
  Eye,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

export const SiteEditor: React.FC = () => {
  const { siteId, pageId } = useParams<{ siteId: string; pageId?: string }>();
  const navigate = useNavigate();
  const { data: site, isLoading: siteLoading } = useSite(siteId);
  const { data: pages, isLoading: pagesLoading } = useSitePages(siteId);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (siteLoading || pagesLoading) {
    return <LoadingSpinner fullScreen text="Loading site..." />;
  }

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Site not found</p>
          <button
            onClick={() => navigate('/cms/sites')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg"
          >
            Back to Sites
          </button>
        </div>
      </div>
    );
  }

  const currentPageId = pageId || pages?.[0]?.id;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate('/cms/sites')}
              className="flex items-center text-sm text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              All Sites
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-slate-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <h2 className="font-semibold text-slate-900 truncate">{site.name}</h2>
          {site.tagline && (
            <p className="text-xs text-slate-500 truncate mt-1">{site.tagline}</p>
          )}
        </div>

        {/* Pages List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Pages
          </h3>
          <nav className="space-y-1">
            {pages?.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  navigate(`/cms/sites/${siteId}/pages/${page.id}`);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition ${
                  currentPageId === page.id
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="truncate">{page.title}</span>
                {currentPageId === page.id && (
                  <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />
                )}
              </button>
            ))}
          </nav>

          {/* Site Components */}
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 mt-8">
            Components
          </h3>
          <nav className="space-y-1">
            <button
              onClick={() => {
                navigate(`/cms/sites/${siteId}/navigation`);
                setMobileSidebarOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <Navigation className="h-4 w-4 mr-3" />
              Navigation
            </button>
            <button
              onClick={() => {
                navigate(`/cms/sites/${siteId}/footer`);
                setMobileSidebarOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <LayoutTemplate className="h-4 w-4 mr-3" />
              Footer
            </button>
          </nav>

          {/* Site Settings */}
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 mt-8">
            Settings
          </h3>
          <nav className="space-y-1">
            <button
              onClick={() => {
                navigate(`/cms/sites/${siteId}/settings`);
                setMobileSidebarOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <Settings className="h-4 w-4 mr-3" />
              Site Settings
            </button>
          </nav>
        </div>

        {/* Preview Button */}
        <div className="p-4 border-t border-slate-200">
          <a
            href={site.domain ? `https://${site.domain}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview Site
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg mr-3"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-slate-900 truncate">{site.name}</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ siteId, site, pages }} />
        </main>
      </div>
    </div>
  );
};

// Export hook for child routes to access site context
import { useOutletContext } from 'react-router-dom';
import { Site, Page } from '../../utils/types/sites';

interface SiteEditorContext {
  siteId: string;
  site: Site;
  pages: Page[];
}

export const useSiteEditorContext = () => useOutletContext<SiteEditorContext>();

