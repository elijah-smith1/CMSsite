import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Site, Page, Block, Navigation, Footer } from '../utils/types/sites';
import { generateId } from '../utils/formatters';

/**
 * Get all sites from /sites collection
 */
export const getAllSites = async (): Promise<Site[]> => {
  const sitesRef = collection(db, 'sites');
  const snapshot = await getDocs(sitesRef);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Site[];
};

/**
 * Get a single site by ID
 */
export const getSite = async (siteId: string): Promise<Site | null> => {
  const siteRef = doc(db, 'sites', siteId);
  const snapshot = await getDoc(siteRef);
  
  if (!snapshot.exists()) return null;
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Site;
};

/**
 * Update site metadata
 */
export const updateSite = async (siteId: string, data: Partial<Site>): Promise<void> => {
  const siteRef = doc(db, 'sites', siteId);
  await updateDoc(siteRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

/**
 * Get all pages for a site
 */
export const getSitePages = async (siteId: string): Promise<Page[]> => {
  const pagesRef = collection(db, 'sites', siteId, 'pages');
  const q = query(pagesRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => normalizePage({ id: doc.id, ...doc.data() }, doc.id));
};

/**
 * Get a single page
 */
export const getPage = async (siteId: string, pageId: string): Promise<Page | null> => {
  const pageRef = doc(db, 'sites', siteId, 'pages', pageId);
  const snapshot = await getDoc(pageRef);
  
  if (!snapshot.exists()) return null;
  
  return normalizePage({ id: snapshot.id, ...snapshot.data() }, pageId);
};

/**
 * Update a page
 */
export const updatePage = async (
  siteId: string,
  pageId: string,
  data: Partial<Page>
): Promise<void> => {
  const pageRef = doc(db, 'sites', siteId, 'pages', pageId);
  await updateDoc(pageRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

/**
 * Update page blocks only
 */
export const updatePageBlocks = async (
  siteId: string,
  pageId: string,
  blocks: Block[]
): Promise<void> => {
  const pageRef = doc(db, 'sites', siteId, 'pages', pageId);
  await updateDoc(pageRef, {
    blocks,
    updatedAt: Timestamp.now(),
  });
};

/**
 * Update a single block within a page
 */
export const updateBlock = async (
  siteId: string,
  pageId: string,
  blockIndex: number,
  blockData: Block
): Promise<void> => {
  const page = await getPage(siteId, pageId);
  if (!page) throw new Error('Page not found');
  
  const blocks = [...page.blocks];
  blocks[blockIndex] = blockData;
  
  await updatePageBlocks(siteId, pageId, blocks);
};

/**
 * Add a new block to a page
 */
export const addBlock = async (
  siteId: string,
  pageId: string,
  block: Block,
  position?: number
): Promise<void> => {
  const page = await getPage(siteId, pageId);
  if (!page) throw new Error('Page not found');
  
  const blocks = [...page.blocks];
  
  if (position !== undefined) {
    blocks.splice(position, 0, block);
  } else {
    blocks.push(block);
  }
  
  // Update order for all blocks
  const orderedBlocks = blocks.map((b, index) => ({ ...b, order: index }));
  
  await updatePageBlocks(siteId, pageId, orderedBlocks);
};

/**
 * Remove a block from a page
 */
export const removeBlock = async (
  siteId: string,
  pageId: string,
  blockIndex: number
): Promise<void> => {
  const page = await getPage(siteId, pageId);
  if (!page) throw new Error('Page not found');
  
  const blocks = page.blocks.filter((_, index) => index !== blockIndex);
  
  // Update order for remaining blocks
  const orderedBlocks = blocks.map((b, index) => ({ ...b, order: index }));
  
  await updatePageBlocks(siteId, pageId, orderedBlocks);
};

/**
 * Reorder blocks in a page
 */
export const reorderBlocks = async (
  siteId: string,
  pageId: string,
  fromIndex: number,
  toIndex: number
): Promise<void> => {
  const page = await getPage(siteId, pageId);
  if (!page) throw new Error('Page not found');
  
  const blocks = [...page.blocks];
  const [removed] = blocks.splice(fromIndex, 1);
  blocks.splice(toIndex, 0, removed);
  
  // Update order for all blocks
  const orderedBlocks = blocks.map((b, index) => ({ ...b, order: index }));
  
  await updatePageBlocks(siteId, pageId, orderedBlocks);
};

/**
 * Get site navigation
 */
export const getNavigation = async (siteId: string): Promise<Navigation | null> => {
  const navRef = doc(db, 'sites', siteId, 'navigation', 'main');
  const snapshot = await getDoc(navRef);
  
  if (!snapshot.exists()) return null;
  
  return snapshot.data() as Navigation;
};

/**
 * Update site navigation
 */
export const updateNavigation = async (
  siteId: string,
  navigation: Navigation
): Promise<void> => {
  const navRef = doc(db, 'sites', siteId, 'navigation', 'main');
  await setDoc(navRef, navigation);
};

/**
 * Get site footer
 */
export const getFooter = async (siteId: string): Promise<Footer | null> => {
  const footerRef = doc(db, 'sites', siteId, 'components', 'footer');
  const snapshot = await getDoc(footerRef);
  
  if (!snapshot.exists()) return null;
  
  return snapshot.data() as Footer;
};

/**
 * Update site footer
 */
export const updateFooter = async (siteId: string, footer: Footer): Promise<void> => {
  const footerRef = doc(db, 'sites', siteId, 'components', 'footer');
  await setDoc(footerRef, footer);
};

/**
 * Create a new page
 */
export const createPage = async (
  siteId: string,
  pageData: Omit<Page, 'id'>
): Promise<string> => {
  const pagesRef = collection(db, 'sites', siteId, 'pages');
  const pageRef = doc(pagesRef);
  
  await setDoc(pageRef, {
    ...pageData,
    updatedAt: Timestamp.now(),
  });
  
  return pageRef.id;
};

/**
 * Delete a page
 */
export const deletePage = async (siteId: string, pageId: string): Promise<void> => {
  const pageRef = doc(db, 'sites', siteId, 'pages', pageId);
  await deleteDoc(pageRef);
};

// --------------------------------------------
// Normalization helpers (legacy → CMS types)
// --------------------------------------------

function asArray<T>(v: any): T[] {
  return Array.isArray(v) ? v : [];
}

function normalizeBlocks(rawBlocks: any[]): Block[] {
  return asArray<any>(rawBlocks).map((b, idx) => {
    const id = b?.id ?? `blk_${generateId()}`;
    const order = typeof b?.order === 'number' ? b.order : idx;

    switch (b?.type) {
      case 'media-row': {
        const legacyItems = asArray<any>(b.items);
        const images = asArray<any>(b.images).length
          ? asArray<any>(b.images)
          : legacyItems.map((it) => ({
              id: it.id ?? `img_${generateId()}`,
              src: it.src ?? '',
              alt: it.alt ?? '',
              caption: it.caption ?? '',
            }));
        return { id, order, type: 'media-row', columns: b.columns ?? 3, images } as Block;
      }

      case 'features': {
        const legacyItems = asArray<any>(b.items);
        const features = asArray<any>(b.features).length
          ? asArray<any>(b.features)
          : legacyItems.map((it) => ({
              id: it.id ?? `fea_${generateId()}`,
              icon: it.icon ?? '',
              title: it.title ?? '',
              description: it.description ?? '',
            }));
        return {
          id,
          order,
          type: 'features',
          title: b.title,
          subtitle: b.subtitle,
          columns: b.columns ?? 3,
          features,
        } as Block;
      }

      case 'image-divider':
        return {
          id,
          order,
          type: 'image-divider',
          image: b.image ?? b.src ?? '',
          alt: b.alt,
        } as Block;

      case 'content-block': {
        const text =
          typeof b.text === 'string'
            ? b.text
            : Array.isArray(b.description)
            ? b.description.join('\n\n')
            : b.description ?? '';
        const image = b.image?.src ?? b.image ?? '';
        const imagePosition = b.imagePosition ?? (b.reverse ? 'right' : 'left');
        const cta = b.cta
          ? {
              id: b.cta.id ?? `cta_${generateId()}`,
              text: b.cta.text ?? '',
              url: b.cta.url ?? b.cta.href ?? '',
              variant: b.cta.variant,
            }
          : undefined;
        return {
          id,
          order,
          type: 'content-block',
          label: b.label,
          title: b.title ?? '',
          text,
          image,
          imagePosition,
          cta,
        } as Block;
      }

      case 'cta': {
        const buttons = asArray<any>(b.buttons).map((btn) => ({
          id: btn.id ?? `btn_${generateId()}`,
          text: btn.text ?? '',
          url: btn.url ?? btn.href ?? '',
          variant: btn.variant,
        }));
        return {
          id,
          order,
          type: 'cta',
          title: b.title ?? '',
          description: b.description,
          buttons,
        } as Block;
      }

      case 'programs': {
        const programs = asArray<any>(b.programs).map((p) => ({
          ...p,
          id: p.id ?? `prg_${generateId()}`,
        }));
        return {
          id,
          order,
          type: 'programs',
          title: b.title,
          subtitle: b.subtitle,
          programs,
        } as Block;
      }

      case 'schedule': {
        const sessions = asArray<any>(b.sessions).map((s) => ({
          ...s,
          id: s.id ?? `ses_${generateId()}`,
        }));
        return {
          id,
          order,
          type: 'schedule',
          title: b.title,
          filters: asArray<string>(b.filters),
          sessions,
        } as Block;
      }

      case 'hero': {
        const ctas = asArray<any>(b.ctas).map((c) => ({
          ...c,
          id: c.id ?? `cta_${generateId()}`,
        }));
        return {
          id,
          order,
          type: 'hero',
          title: b.title ?? '',
          subtitle: b.subtitle,
          backgroundImage: b.backgroundImage ?? b.image ?? '',
          overlayOpacity: b.overlayOpacity,
          ctas,
          alignment: b.alignment,
        } as Block;
      }

      default:
        // Preserve unknown types but ensure id/order exist
        return { ...b, id, order } as Block;
    }
  });
}

function normalizePage(raw: any, pageId: string): Page {
  return {
    id: raw.id ?? pageId,
    title: raw.title ?? pageId,
    slug: raw.slug ?? pageId,
    description: raw.description,
    order: raw.order,
    isPublished: raw.isPublished,
    blocks: normalizeBlocks(raw.blocks ?? []),
    updatedAt: raw.updatedAt,
  } as Page;
}
// ============================================
// PAGE INDEX - Canonical page registry
// ============================================

export interface PageIndexEntry {
  id: string;      // Firestore document ID (e.g., "home", "about")
  path: string;    // URL path (e.g., "/", "/about")
  title: string;   // Display title
}

export interface PageIndex {
  pages: PageIndexEntry[];
}

/**
 * Default page index if none exists in Firestore.
 * This ensures CMS works even without a pageIndex document.
 */
const DEFAULT_PAGE_INDEX: PageIndex = {
  pages: [
    { id: 'home', path: '/', title: 'Home' },
    { id: 'about', path: '/about', title: 'About' },
    { id: 'programs', path: '/programs', title: 'Programs' },
    { id: 'schedule', path: '/schedule', title: 'Schedule' },
    { id: 'gallery', path: '/gallery', title: 'Gallery' },
    { id: 'contact', path: '/contact', title: 'Contact' },
  ],
};

/**
 * Get page index from Firestore.
 * Falls back to default if not found.
 * Path: sites/{siteId}/pageIndex/main
 */
export const getPageIndex = async (siteId: string): Promise<PageIndex> => {
  const indexRef = doc(db, 'sites', siteId, 'pageIndex', 'main');
  const snapshot = await getDoc(indexRef);
  
  if (!snapshot.exists()) {
    // Fall back to generating index from existing pages
    return generatePageIndexFromPages(siteId);
  }
  
  return snapshot.data() as PageIndex;
};

/**
 * Generate page index from existing pages in Firestore.
 * Used as fallback when pageIndex document doesn't exist.
 */
export const generatePageIndexFromPages = async (siteId: string): Promise<PageIndex> => {
  const pages = await getSitePages(siteId);
  
  if (pages.length === 0) {
    return DEFAULT_PAGE_INDEX;
  }
  
  return {
    pages: pages.map((page) => ({
      id: page.id, // Firestore document ID
      path: page.id === 'home' ? '/' : `/${page.id}`,
      title: page.title || page.id,
    })),
  };
};

/**
 * Save page index to Firestore.
 */
export const savePageIndex = async (siteId: string, pageIndex: PageIndex): Promise<void> => {
  const indexRef = doc(db, 'sites', siteId, 'pageIndex', 'main');
  await setDoc(indexRef, pageIndex);
};

/**
 * Save a page using ONLY the Firestore document ID.
 * This is the DETERMINISTIC save function.
 * 
 * IMPORTANT: pageId MUST be the Firestore document ID.
 * Never pass route strings, array indexes, or navigation hrefs.
 */
export const savePageById = async (
  siteId: string,
  pageId: string,
  data: { title: string; blocks: Block[] }
): Promise<void> => {
  // Validate pageId is not empty or a path
  if (!pageId || pageId.includes('/')) {
    throw new Error(`Invalid pageId: "${pageId}". Must be a Firestore document ID.`);
  }
  
  const pageRef = doc(db, 'sites', siteId, 'pages', pageId);
  
  // Debug logging
  console.log(`[CMS] Saving page: siteId="${siteId}", pageId="${pageId}"`);
  
  await setDoc(
    pageRef,
    {
      title: data.title,
      blocks: data.blocks,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};

