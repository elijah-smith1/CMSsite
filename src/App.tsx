import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { TenantProvider } from './context/TenantContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Login } from './pages/Login';

// CMS Pages
import { SiteList } from './cms/pages/SiteList';
import { SiteEditor } from './cms/pages/SiteEditor';
import { PageEditor } from './cms/pages/PageEditor';

// Public Site Pages
import { SiteLayout } from './site/SiteLayout';
import { SitePage } from './site/SitePage';
import { SITE_ID } from './site/config';

import './styles/index.css';

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <BrowserRouter>
          <Routes>
            {/* ============================================
                CMS ROUTES (require authentication)
                ============================================ */}
            
            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* CMS: Site List */}
            <Route
              path="/cms/sites"
              element={
                <ProtectedRoute>
                  <SiteList />
                </ProtectedRoute>
              }
            />

            {/* CMS: Site Editor with nested routes */}
            <Route
              path="/cms/sites/:siteId"
              element={
                <ProtectedRoute>
                  <SiteEditor />
                </ProtectedRoute>
              }
            >
              <Route index element={<CMSPlaceholder message="Select a page from the sidebar to start editing" />} />
              <Route path="pages/:pageId" element={<PageEditor />} />
              <Route path="navigation" element={<CMSPlaceholder message="Navigation Editor - Coming Soon" />} />
              <Route path="footer" element={<CMSPlaceholder message="Footer Editor - Coming Soon" />} />
              <Route path="settings" element={<CMSPlaceholder message="Site Settings - Coming Soon" />} />
            </Route>

            {/* CMS Root - redirect to sites list */}
            <Route path="/cms" element={<Navigate to="/cms/sites" replace />} />

            {/* ============================================
                PUBLIC SITE ROUTES (no authentication)
                Uses SITE_ID from config
                ============================================ */}
            
            <Route element={<SiteLayout siteId={SITE_ID} />}>
              {/* All public pages use the same renderer */}
              <Route path="/" element={<SitePage siteId={SITE_ID} />} />
              <Route path="/about" element={<SitePage siteId={SITE_ID} />} />
              <Route path="/programs" element={<SitePage siteId={SITE_ID} />} />
              <Route path="/schedule" element={<SitePage siteId={SITE_ID} />} />
              <Route path="/gallery" element={<SitePage siteId={SITE_ID} />} />
              <Route path="/contact" element={<SitePage siteId={SITE_ID} />} />
              
              {/* Catch-all for any other page */}
              <Route path="/:pageId" element={<SitePage siteId={SITE_ID} />} />
            </Route>
          </Routes>
        </BrowserRouter>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </TenantProvider>
    </QueryClientProvider>
  );
};

// Simple placeholder for CMS pages not yet implemented
const CMSPlaceholder: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-8 text-center">
    <p className="text-slate-600">{message}</p>
  </div>
);

export default App;
