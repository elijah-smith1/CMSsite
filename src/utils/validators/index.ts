import { z } from 'zod';

// Tenant schema
export const tenantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Tenant name is required'),
  domain: z.string().min(1, 'Domain is required'),
  createdAt: z.any(),
  sections: z.array(z.string()),
});

// Content block schemas
export const checkerboardBlockSchema = z.object({
  type: z.literal('checkerboard'),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  image: z.string().url('Must be a valid URL'),
  position: z.enum(['left', 'right']),
});

export const textBlockSchema = z.object({
  type: z.literal('text'),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
});

export const imageBlockSchema = z.object({
  type: z.literal('image'),
  image: z.string().url('Must be a valid URL'),
  caption: z.string().optional(),
});

export const contentBlockSchema = z.discriminatedUnion('type', [
  checkerboardBlockSchema,
  textBlockSchema,
  imageBlockSchema,
]);

// Home section schema
export const homeContentSchema = z.object({
  heroTitle: z.string().min(1, 'Hero title is required'),
  heroSubtitle: z.string().min(1, 'Hero subtitle is required'),
  heroImage: z.string().url('Must be a valid URL'),
  blocks: z.array(contentBlockSchema),
});

// About section schema
export const aboutContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  mainImage: z.string().url('Must be a valid URL'),
  story: z.string().min(10, 'Story must be at least 10 characters'),
  mission: z.string().optional(),
  vision: z.string().optional(),
  values: z.array(z.string()).optional(),
});

// Menu item schema
export const menuItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Item name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().url('Must be a valid URL').optional(),
  featured: z.boolean().optional(),
});

// Menu section schema
export const menuContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  items: z.array(menuItemSchema),
});

// Event schema
export const eventSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Event title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required'),
  image: z.string().url('Must be a valid URL').optional(),
  registrationLink: z.string().url('Must be a valid URL').optional(),
});

// Events section schema
export const eventsContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  events: z.array(eventSchema),
});

// Gallery image schema
export const galleryImageSchema = z.object({
  id: z.string(),
  url: z.string().url('Must be a valid URL'),
  caption: z.string().optional(),
  category: z.string().optional(),
});

// Gallery section schema
export const galleryContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  categories: z.array(z.string()),
  images: z.array(galleryImageSchema),
});

// Contact section schema
export const contactContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  email: z.string().email('Must be a valid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  hours: z.string().optional(),
  socialMedia: z
    .object({
      facebook: z.string().url('Must be a valid URL').optional(),
      instagram: z.string().url('Must be a valid URL').optional(),
      twitter: z.string().url('Must be a valid URL').optional(),
      linkedin: z.string().url('Must be a valid URL').optional(),
    })
    .optional(),
});

// Helper function to validate section content
export const validateSectionContent = (sectionType: string, data: unknown) => {
  switch (sectionType) {
    case 'home':
      return homeContentSchema.parse(data);
    case 'about':
      return aboutContentSchema.parse(data);
    case 'menu':
      return menuContentSchema.parse(data);
    case 'events':
      return eventsContentSchema.parse(data);
    case 'gallery':
      return galleryContentSchema.parse(data);
    case 'contact':
      return contactContentSchema.parse(data);
    default:
      throw new Error(`Unknown section type: ${sectionType}`);
  }
};

