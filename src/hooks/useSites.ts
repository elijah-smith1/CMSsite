import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllSites,
  getSite,
  updateSite,
  getSitePages,
  getPage,
  updatePage,
  updatePageBlocks,
  updateBlock,
  addBlock,
  removeBlock,
  reorderBlocks,
  getNavigation,
  updateNavigation,
  getFooter,
  updateFooter,
  getPageIndex,
  savePageById,
  PageIndex,
} from '../services/siteService';
import { Site, Page, Block, Navigation, Footer } from '../utils/types/sites';
import toast from 'react-hot-toast';

/**
 * Hook to fetch all sites
 */
export const useSites = () => {
  return useQuery({
    queryKey: ['sites'],
    queryFn: getAllSites,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single site
 */
export const useSite = (siteId: string | undefined) => {
  return useQuery({
    queryKey: ['site', siteId],
    queryFn: () => {
      if (!siteId) throw new Error('Site ID required');
      return getSite(siteId);
    },
    enabled: !!siteId,
  });
};

/**
 * Hook to update site metadata
 */
export const useUpdateSite = (siteId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Site>) => updateSite(siteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site', siteId] });
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success('Site updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update site');
    },
  });
};

/**
 * Hook to fetch all pages for a site
 */
export const useSitePages = (siteId: string | undefined) => {
  return useQuery({
    queryKey: ['site-pages', siteId],
    queryFn: () => {
      if (!siteId) throw new Error('Site ID required');
      return getSitePages(siteId);
    },
    enabled: !!siteId,
  });
};

/**
 * Hook to fetch a single page
 */
export const usePage = (siteId: string | undefined, pageId: string | undefined) => {
  return useQuery({
    queryKey: ['page', siteId, pageId],
    queryFn: () => {
      if (!siteId || !pageId) throw new Error('Site ID and Page ID required');
      return getPage(siteId, pageId);
    },
    enabled: !!siteId && !!pageId,
  });
};

/**
 * Hook to update a page
 */
export const useUpdatePage = (siteId: string, pageId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Page>) => updatePage(siteId, pageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page', siteId, pageId] });
      queryClient.invalidateQueries({ queryKey: ['site-pages', siteId] });
      toast.success('Page updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update page');
    },
  });
};

/**
 * Hook to update page blocks
 */
export const useUpdateBlocks = (siteId: string, pageId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blocks: Block[]) => updatePageBlocks(siteId, pageId, blocks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page', siteId, pageId] });
      toast.success('Blocks updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update blocks');
    },
  });
};

/**
 * Hook to update a single block
 */
export const useUpdateBlock = (siteId: string, pageId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ blockIndex, blockData }: { blockIndex: number; blockData: Block }) =>
      updateBlock(siteId, pageId, blockIndex, blockData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page', siteId, pageId] });
      toast.success('Block saved');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save block');
    },
  });
};

/**
 * Hook to add a new block
 */
export const useAddBlock = (siteId: string, pageId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ block, position }: { block: Block; position?: number }) =>
      addBlock(siteId, pageId, block, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page', siteId, pageId] });
      toast.success('Block added');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add block');
    },
  });
};

/**
 * Hook to remove a block
 */
export const useRemoveBlock = (siteId: string, pageId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (blockIndex: number) => removeBlock(siteId, pageId, blockIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page', siteId, pageId] });
      toast.success('Block removed');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove block');
    },
  });
};

/**
 * Hook to reorder blocks
 */
export const useReorderBlocks = (siteId: string, pageId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fromIndex, toIndex }: { fromIndex: number; toIndex: number }) =>
      reorderBlocks(siteId, pageId, fromIndex, toIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page', siteId, pageId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reorder blocks');
    },
  });
};

/**
 * Hook to fetch site navigation
 */
export const useNavigation = (siteId: string | undefined) => {
  return useQuery({
    queryKey: ['navigation', siteId],
    queryFn: () => {
      if (!siteId) throw new Error('Site ID required');
      return getNavigation(siteId);
    },
    enabled: !!siteId,
  });
};

/**
 * Hook to update navigation
 */
export const useUpdateNavigation = (siteId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (navigation: Navigation) => updateNavigation(siteId, navigation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navigation', siteId] });
      toast.success('Navigation updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update navigation');
    },
  });
};

/**
 * Hook to fetch footer
 */
export const useFooter = (siteId: string | undefined) => {
  return useQuery({
    queryKey: ['footer', siteId],
    queryFn: () => {
      if (!siteId) throw new Error('Site ID required');
      return getFooter(siteId);
    },
    enabled: !!siteId,
  });
};

/**
 * Hook to update footer
 */
export const useUpdateFooter = (siteId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (footer: Footer) => updateFooter(siteId, footer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer', siteId] });
      toast.success('Footer updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update footer');
    },
  });
};

// ============================================
// PAGE INDEX - Canonical page registry hooks
// ============================================

/**
 * Hook to fetch page index.
 * This is the AUTHORITATIVE source for page listing in the CMS.
 * Falls back to generating from existing pages if pageIndex doesn't exist.
 */
export const usePageIndex = (siteId: string | undefined) => {
  return useQuery({
    queryKey: ['page-index', siteId],
    queryFn: () => {
      if (!siteId) throw new Error('Site ID required');
      return getPageIndex(siteId);
    },
    enabled: !!siteId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to save a page by its Firestore document ID.
 * This is the DETERMINISTIC save function.
 */
export const useSavePage = (siteId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      title,
      blocks,
    }: {
      pageId: string;
      title: string;
      blocks: Block[];
    }) => {
      // Validate pageId before save
      if (!pageId) {
        throw new Error('Page ID is required for save');
      }
      return savePageById(siteId, pageId, { title, blocks });
    },
    onSuccess: (_, variables) => {
      // Invalidate specific page and page list
      queryClient.invalidateQueries({ queryKey: ['page', siteId, variables.pageId] });
      queryClient.invalidateQueries({ queryKey: ['site-pages', siteId] });
      queryClient.invalidateQueries({ queryKey: ['page-index', siteId] });
      toast.success('Page saved');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save page');
    },
  });
};

