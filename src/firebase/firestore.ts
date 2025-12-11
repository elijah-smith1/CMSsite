import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
  CollectionReference,
  DocumentReference,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Generic function to get a document
 */
export const getDocument = async <T>(
  collectionPath: string,
  docId: string
): Promise<T | null> => {
  const docRef = doc(db, collectionPath, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
};

/**
 * Generic function to get multiple documents
 */
export const getDocuments = async <T>(
  collectionPath: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  const collectionRef = collection(db, collectionPath);
  const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
};

/**
 * Generic function to set a document
 */
export const setDocument = async <T>(
  collectionPath: string,
  docId: string,
  data: T
): Promise<void> => {
  const docRef = doc(db, collectionPath, docId);
  await setDoc(docRef, data);
};

/**
 * Generic function to update a document
 */
export const updateDocument = async (
  collectionPath: string,
  docId: string,
  data: Partial<unknown>
): Promise<void> => {
  const docRef = doc(db, collectionPath, docId);
  await updateDoc(docRef, data);
};

/**
 * Generic function to delete a document
 */
export const deleteDocument = async (
  collectionPath: string,
  docId: string
): Promise<void> => {
  const docRef = doc(db, collectionPath, docId);
  await deleteDoc(docRef);
};

/**
 * Get a collection reference
 */
export const getCollectionRef = (collectionPath: string): CollectionReference => {
  return collection(db, collectionPath);
};

/**
 * Get a document reference
 */
export const getDocRef = (collectionPath: string, docId: string): DocumentReference => {
  return doc(db, collectionPath, docId);
};

export { Timestamp, where, orderBy, limit };

