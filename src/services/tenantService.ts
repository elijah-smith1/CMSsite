import { getDocument, getDocuments, where } from '../firebase/firestore';
import { Tenant } from '../utils/types';

/**
 * Get a tenant by ID
 */
export const getTenant = async (tenantId: string): Promise<Tenant | null> => {
  return getDocument<Tenant>('tenants', tenantId);
};

/**
 * Get all tenants (for admin purposes)
 */
export const getAllTenants = async (): Promise<Tenant[]> => {
  return getDocuments<Tenant>('tenants');
};

/**
 * Get tenants for a specific user
 * NOTE: You'll need to implement user-tenant relationship logic
 * This is a placeholder that assumes tenantIds are stored with the user
 */
export const getUserTenants = async (tenantIds: string[]): Promise<Tenant[]> => {
  if (tenantIds.length === 0) return [];
  
  // Fetch each tenant individually
  const tenantPromises = tenantIds.map((id) => getTenant(id));
  const tenants = await Promise.all(tenantPromises);
  
  // Filter out null values
  return tenants.filter((tenant): tenant is Tenant => tenant !== null);
};

/**
 * Check if a tenant has a specific section
 */
export const hasSectionAccess = (tenant: Tenant, section: string): boolean => {
  return tenant.sections.includes(section);
};

