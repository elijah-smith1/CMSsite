import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export interface NavItem {
  id: string;
  text: string;
  href: string;
  children?: NavItem[];
}

export interface Navigation {
  items: NavItem[];
}

/**
 * Hook to load navigation from Firestore with real-time updates.
 * Reads from: sites/{siteId}/navigation/main
 */
export function useNavigation(siteId: string) {
  const [navigation, setNavigation] = useState<Navigation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const navRef = doc(db, `sites/${siteId}/navigation/main`);

    const unsubscribe = onSnapshot(
      navRef,
      (snap) => {
        if (snap.exists()) {
          setNavigation(snap.data() as Navigation);
        } else {
          setNavigation({ items: [] });
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error loading navigation:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [siteId]);

  return { navigation, loading };
}

