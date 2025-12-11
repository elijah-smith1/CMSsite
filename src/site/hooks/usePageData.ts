import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { resolvePageId } from '../../utils/resolvePageId';

export interface BlockImage {
  src: string | null;
  alt: string;
  placeholder?: string;
}

export interface BlockCTA {
  text: string;
  href?: string;
  variant?: string;
}

export interface BlockStat {
  number: string;
  label: string;
}

export interface Block {
  type: string;
  title?: string;
  subtitle?: string;
  label?: string;
  description?: string | string[];
  image?: BlockImage;
  cta?: BlockCTA | null;
  stats?: BlockStat[] | null;
  reverse?: boolean;
  darkText?: boolean;
  items?: any[];
  buttons?: any[];
  programs?: any[];
  sessions?: any[];
  [key: string]: any; // Allow additional fields
}

export interface PageData {
  id: string;
  title: string;
  blocks: Block[];
}

interface UsePageDataResult {
  pageData: PageData | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

/**
 * Hook to load page data from Firestore with real-time updates.
 * Uses resolvePageId for URL → document ID mapping.
 */
export function usePageData(siteId: string, pathname: string): UsePageDataResult {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const pageId = resolvePageId(pathname);
    
    // Debug logging (remove after verified working)
    console.log('Resolved pageId:', pageId);

    const pageRef = doc(db, `sites/${siteId}/pages/${pageId}`);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      pageRef,
      (pageSnap) => {
        if (!pageSnap.exists()) {
          console.warn('Page not found:', pageId);
          setNotFound(true);
          setPageData(null);
          setLoading(false);
          return;
        }

        const data = pageSnap.data() as PageData;
        
        // Debug logging (remove after verified working)
        console.log('Loaded page blocks:', data.blocks);

        setPageData({
          id: pageSnap.id,
          title: data.title || '',
          blocks: Array.isArray(data.blocks) ? data.blocks : [],
        });
        setNotFound(false);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading page:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [siteId, pathname]);

  return { pageData, loading, error, notFound };
}

