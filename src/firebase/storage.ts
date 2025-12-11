import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  StorageReference,
} from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a file to Firebase Storage
 */
export const uploadFile = async (
  path: string,
  file: File
): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

/**
 * Get download URL for a file
 */
export const getFileURL = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

/**
 * Delete a file from Firebase Storage
 */
export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

/**
 * List all files in a directory
 */
export const listFiles = async (path: string): Promise<StorageReference[]> => {
  const storageRef = ref(storage, path);
  const result = await listAll(storageRef);
  return result.items;
};

/**
 * Upload image with tenant-specific path
 */
export const uploadTenantImage = async (
  tenantId: string,
  section: string,
  file: File
): Promise<string> => {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  const path = `tenants/${tenantId}/${section}/${fileName}`;
  return uploadFile(path, file);
};

/**
 * List all images for a tenant
 */
export const listTenantImages = async (
  tenantId: string
): Promise<StorageReference[]> => {
  const path = `tenants/${tenantId}`;
  return listFiles(path);
};

