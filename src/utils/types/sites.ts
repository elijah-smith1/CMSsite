import { Timestamp } from 'firebase/firestore';

// Site metadata stored at /sites/{siteId}
export interface Site {
  id: string;
  name: string;
  tagline?: string;
  domain?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  theme?: SiteTheme;
}

export interface SiteTheme {
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

// Page stored at /sites/{siteId}/pages/{pageId}
export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  blocks: Block[];
  order?: number;
  isPublished?: boolean;
  updatedAt?: Timestamp;
}

// Block types
export type BlockType = 
  | 'hero'
  | 'content-block'
  | 'media-row'
  | 'image-divider'
  | 'features'
  | 'programs'
  | 'schedule'
  | 'cta'
  | 'text'
  | 'gallery'
  | 'testimonials'
  | 'contact-form'
  | 'map';

// Base block interface
export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
}

// Hero block
export interface HeroBlock extends BaseBlock {
  type: 'hero';
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  ctas?: CTA[];
  alignment?: 'left' | 'center' | 'right';
}

// Content block (checkerboard style)
export interface ContentBlock extends BaseBlock {
  type: 'content-block';
  label?: string;
  title: string;
  text: string;
  image?: string;
  imagePosition?: 'left' | 'right';
  cta?: CTA;
}

// Media row (multiple images)
export interface MediaRowBlock extends BaseBlock {
  type: 'media-row';
  images: MediaImage[];
  columns?: 2 | 3 | 4;
}

export interface MediaImage {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
}

// Image divider (full-width image)
export interface ImageDividerBlock extends BaseBlock {
  type: 'image-divider';
  image: string;
  alt?: string;
  height?: 'small' | 'medium' | 'large';
}

// Features block
export interface FeaturesBlock extends BaseBlock {
  type: 'features';
  title?: string;
  subtitle?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
}

export interface Feature {
  id: string;
  icon?: string;
  title: string;
  description: string;
}

// Programs block
export interface ProgramsBlock extends BaseBlock {
  type: 'programs';
  title?: string;
  subtitle?: string;
  programs: Program[];
}

export interface Program {
  id: string;
  name: string;
  description: string;
  image?: string;
  age?: string;
  schedule?: string;
  cta?: CTA;
}

// Schedule block
export interface ScheduleBlock extends BaseBlock {
  type: 'schedule';
  title?: string;
  filters?: string[];
  sessions: Session[];
}

export interface Session {
  id: string;
  name: string;
  time: string;
  day?: string;
  category?: string;
  instructor?: string;
  location?: string;
}

// CTA block
export interface CTABlock extends BaseBlock {
  type: 'cta';
  title: string;
  description?: string;
  buttons: CTA[];
  backgroundImage?: string;
  backgroundColor?: string;
}

// Text block
export interface TextBlock extends BaseBlock {
  type: 'text';
  title?: string;
  content: string; // HTML content
}

// Gallery block
export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  title?: string;
  images: MediaImage[];
  layout?: 'grid' | 'masonry' | 'carousel';
}

// Testimonials block
export interface TestimonialsBlock extends BaseBlock {
  type: 'testimonials';
  title?: string;
  testimonials: Testimonial[];
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  image?: string;
}

// Contact form block
export interface ContactFormBlock extends BaseBlock {
  type: 'contact-form';
  title?: string;
  subtitle?: string;
  email: string;
  fields?: FormField[];
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select';
  label: string;
  required?: boolean;
  options?: string[];
}

// Map block
export interface MapBlock extends BaseBlock {
  type: 'map';
  address: string;
  lat?: number;
  lng?: number;
  zoom?: number;
}

// CTA button
export interface CTA {
  id: string;
  text: string;
  url: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

// Union type for all blocks
export type Block = 
  | HeroBlock
  | ContentBlock
  | MediaRowBlock
  | ImageDividerBlock
  | FeaturesBlock
  | ProgramsBlock
  | ScheduleBlock
  | CTABlock
  | TextBlock
  | GalleryBlock
  | TestimonialsBlock
  | ContactFormBlock
  | MapBlock;

// Navigation stored at /sites/{siteId}/navigation/main
export interface Navigation {
  items: NavItem[];
}

export interface NavItem {
  id: string;
  label: string;
  url: string;
  children?: NavItem[];
}

// Footer stored at /sites/{siteId}/components/footer
export interface Footer {
  logo?: string;
  tagline?: string;
  columns?: FooterColumn[];
  copyright?: string;
  socialLinks?: SocialLink[];
}

export interface FooterColumn {
  id: string;
  title: string;
  links: { label: string; url: string }[];
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube';
  url: string;
}

// Block type metadata for CMS
export const BLOCK_TYPE_META: Record<BlockType, { label: string; icon: string; description: string }> = {
  'hero': { label: 'Hero Section', icon: 'Image', description: 'Full-width hero with title and CTAs' },
  'content-block': { label: 'Content Block', icon: 'LayoutList', description: 'Text and image side by side' },
  'media-row': { label: 'Media Row', icon: 'Images', description: 'Grid of images' },
  'image-divider': { label: 'Image Divider', icon: 'ImageIcon', description: 'Full-width image separator' },
  'features': { label: 'Features', icon: 'Star', description: 'Feature cards with icons' },
  'programs': { label: 'Programs', icon: 'GraduationCap', description: 'Program/service cards' },
  'schedule': { label: 'Schedule', icon: 'Calendar', description: 'Session schedule with filters' },
  'cta': { label: 'Call to Action', icon: 'MousePointer', description: 'CTA section with buttons' },
  'text': { label: 'Text Content', icon: 'Type', description: 'Rich text content area' },
  'gallery': { label: 'Gallery', icon: 'Grid', description: 'Image gallery' },
  'testimonials': { label: 'Testimonials', icon: 'Quote', description: 'Customer testimonials' },
  'contact-form': { label: 'Contact Form', icon: 'Mail', description: 'Contact form' },
  'map': { label: 'Map', icon: 'MapPin', description: 'Location map' },
};

