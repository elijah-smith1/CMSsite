import { getDocument, setDocument, updateDocument } from '../firebase/firestore';
import { SectionContent } from '../utils/types';
import { validateSectionContent } from '../utils/validators';

/**
 * Get section content for a tenant
 */
export const getSectionContent = async <T extends SectionContent>(
  tenantId: string,
  sectionId: string
): Promise<T | null> => {
  const path = `tenants/${tenantId}/content`;
  return getDocument<T>(path, sectionId);
};

/**
 * Save section content for a tenant
 */
export const saveSectionContent = async (
  tenantId: string,
  sectionId: string,
  content: SectionContent,
  validate = true
): Promise<void> => {
  // Validate content before saving
  if (validate) {
    validateSectionContent(sectionId, content);
  }
  
  const path = `tenants/${tenantId}/content`;
  await setDocument(path, sectionId, content);
};

/**
 * Update section content for a tenant (partial update)
 */
export const updateSectionContent = async (
  tenantId: string,
  sectionId: string,
  updates: Partial<SectionContent>
): Promise<void> => {
  const path = `tenants/${tenantId}/content`;
  await updateDocument(path, sectionId, updates);
};

/**
 * Get default content for a section type
 * This provides starter content when a section is first created
 */
export const getDefaultSectionContent = (sectionType: string): SectionContent => {
  switch (sectionType) {
    case 'home':
      return {
        heroTitle: 'Welcome to Our Site',
        heroSubtitle: 'Edit this section to customize your homepage',
        heroImage: 'https://via.placeholder.com/1200x600',
        blocks: [],
      };
    
    case 'about':
      return {
        title: 'About Us',
        subtitle: 'Learn more about our story',
        mainImage: 'https://via.placeholder.com/800x600',
        story: 'Tell your story here...',
        values: [],
      };
    
    case 'menu':
      return {
        title: 'Our Menu',
        subtitle: 'Explore our offerings',
        categories: ['Appetizers', 'Main Courses', 'Desserts'],
        items: [],
      };
    
    case 'events':
      return {
        title: 'Upcoming Events',
        subtitle: 'Join us for these exciting events',
        events: [],
      };
    
    case 'gallery':
      return {
        title: 'Photo Gallery',
        subtitle: 'Explore our visual collection',
        categories: ['All'],
        images: [],
      };
    
    case 'contact':
      return {
        title: 'Contact Us',
        subtitle: 'Get in touch',
        email: 'contact@example.com',
        phone: '(555) 123-4567',
        address: '123 Main St, City, State 12345',
      };
    
    default:
      throw new Error(`Unknown section type: ${sectionType}`);
  }
};

