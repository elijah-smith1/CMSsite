import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePageData } from '../hooks/usePageData';
import { SectionRenderer } from './SectionRenderer';

interface PageRendererProps {
  siteId: string;
}

/**
 * Loads and renders a page based on the current URL pathname.
 * Reads blocks[] from Firestore and renders them using SectionRenderer.
 */
export const PageRenderer: React.FC<PageRendererProps> = ({ siteId }) => {
  const location = useLocation();
  const { pageData, loading, error, notFound } = usePageData(siteId, location.pathname);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // 404 state
  if (notFound) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // No page data
  if (!pageData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">No content available.</p>
      </div>
    );
  }

  // Empty blocks
  if (!pageData.blocks || pageData.blocks.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{pageData.title}</h1>
          <p className="text-gray-600">This page has no content blocks yet.</p>
        </div>
      </div>
    );
  }

  // Render blocks
  return (
    <main>
      {Array.isArray(pageData.blocks) &&
        pageData.blocks.map((block, index) => (
          <SectionRenderer key={index} block={block} />
        ))}
    </main>
  );
};

