import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Footer {
  logo?: string;
  tagline?: string;
  columns?: FooterColumn[];
  copyright?: string;
  socialLinks?: SocialLink[];
  [key: string]: any;
}

/**
 * Hook to load footer from Firestore with real-time updates.
 * Reads from: sites/{siteId}/components/footer
 */
export function useFooter(siteId: string) {
  const [footer, setFooter] = useState<Footer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const footerRef = doc(db, `sites/${siteId}/components/footer`);

    const unsubscribe = onSnapshot(
      footerRef,
      (snap) => {
        if (snap.exists()) {
          setFooter(snap.data() as Footer);
        } else {
          setFooter(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error loading footer:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [siteId]);

  return { footer, loading };
}

