import { Timestamp } from 'firebase/firestore';

// User types
export interface User {
  id: string;
  email: string;
  tenantIds: string[];
}

// Tenant types
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  createdAt: Timestamp;
  sections: string[];
}

// Section types
export type SectionType = 'home' | 'about' | 'menu' | 'events' | 'gallery' | 'contact';

// Block types for home page
export interface CheckerboardBlock {
  type: 'checkerboard';
  title: string;
  body: string;
  image: string;
  position: 'left' | 'right';
}

export interface TextBlock {
  type: 'text';
  title: string;
  body: string;
}

export interface ImageBlock {
  type: 'image';
  image: string;
  caption?: string;
}

export type ContentBlock = CheckerboardBlock | TextBlock | ImageBlock;

// Home section
export interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  blocks: ContentBlock[];
}

// About section
export interface AboutContent {
  title: string;
  subtitle: string;
  mainImage: string;
  story: string;
  mission?: string;
  vision?: string;
  values?: string[];
}

// Menu item
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  featured?: boolean;
}

// Menu section
export interface MenuContent {
  title: string;
  subtitle?: string;
  categories: string[];
  items: MenuItem[];
}

// Event
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  registrationLink?: string;
}

// Events section
export interface EventsContent {
  title: string;
  subtitle?: string;
  events: Event[];
}

// Gallery image
export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  category?: string;
}

// Gallery section
export interface GalleryContent {
  title: string;
  subtitle?: string;
  categories: string[];
  images: GalleryImage[];
}

// Contact section
export interface ContactContent {
  title: string;
  subtitle?: string;
  email: string;
  phone: string;
  address: string;
  hours?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

// Union type for all section content
export type SectionContent =
  | HomeContent
  | AboutContent
  | MenuContent
  | EventsContent
  | GalleryContent
  | ContactContent;

// Media file type
export interface MediaFile {
  id: string;
  url: string;
  name: string;
  path: string;
  uploadedAt: string;
}

