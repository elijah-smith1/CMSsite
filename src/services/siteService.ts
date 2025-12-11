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
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Page[];
};

/**
 * Get a single page
 */
export const getPage = async (siteId: string, pageId: string): Promise<Page | null> => {
  const pageRef = doc(db, 'sites', siteId, 'pages', pageId);
  const snapshot = await getDoc(pageRef);
  
  if (!snapshot.exists()) return null;
  
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Page;
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

