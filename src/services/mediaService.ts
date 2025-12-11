import {
  uploadTenantImage,
  listTenantImages,
  deleteFile,
  getFileURL,
} from '../firebase/storage';
import { MediaFile } from '../utils/types';
import { StorageReference, getDownloadURL } from 'firebase/storage';

/**
 * Upload an image for a tenant section
 */
export const uploadImage = async (
  tenantId: string,
  section: string,
  file: File
): Promise<string> => {
  return uploadTenantImage(tenantId, section, file);
};

/**
 * Get all media files for a tenant
 */
export const getTenantMedia = async (tenantId: string): Promise<MediaFile[]> => {
  try {
    const refs = await listTenantImages(tenantId);
    
    const mediaPromises = refs.map(async (ref: StorageReference) => {
      const url = await getDownloadURL(ref);
      return {
        id: ref.name,
        url,
        name: ref.name,
        path: ref.fullPath,
        uploadedAt: new Date().toISOString(), // Note: Firebase Storage doesn't store upload date in metadata by default
      };
    });
    
    return Promise.all(mediaPromises);
  } catch (error) {
    console.error('Error getting tenant media:', error);
    return [];
  }
};

/**
 * Delete a media file
 */
export const deleteMedia = async (path: string): Promise<void> => {
  return deleteFile(path);
};

/**
 * Get URL for a media file
 */
export const getMediaURL = async (path: string): Promise<string> => {
  return getFileURL(path);
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP',
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit',
    };
  }
  
  return { valid: true };
};

