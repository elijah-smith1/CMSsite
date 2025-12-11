import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from '../firebase/firebase';

/**
 * Upload an image for a specific block
 * Path: /sites/{siteId}/{pageId}/{blockId}/image.jpg
 */
export const uploadBlockImage = async (
  siteId: string,
  pageId: string,
  blockId: string,
  file: File,
  filename?: string
): Promise<string> => {
  const extension = file.name.split('.').pop() || 'jpg';
  const finalFilename = filename || `image-${Date.now()}.${extension}`;
  const path = `sites/${siteId}/${pageId}/${blockId}/${finalFilename}`;
  
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};

/**
 * Upload a general site image (logo, etc.)
 * Path: /sites/{siteId}/assets/{filename}
 */
export const uploadSiteAsset = async (
  siteId: string,
  file: File,
  filename?: string
): Promise<string> => {
  const extension = file.name.split('.').pop() || 'jpg';
  const finalFilename = filename || `asset-${Date.now()}.${extension}`;
  const path = `sites/${siteId}/assets/${finalFilename}`;
  
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};

/**
 * Delete an image from storage
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract path from URL
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - image might already be deleted
  }
};

/**
 * Delete all images for a block
 */
export const deleteBlockImages = async (
  siteId: string,
  pageId: string,
  blockId: string
): Promise<void> => {
  const path = `sites/${siteId}/${pageId}/${blockId}`;
  const storageRef = ref(storage, path);
  
  try {
    const result = await listAll(storageRef);
    await Promise.all(result.items.map((item) => deleteObject(item)));
  } catch (error) {
    console.error('Error deleting block images:', error);
  }
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP',
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit',
    };
  }
  
  return { valid: true };
};

