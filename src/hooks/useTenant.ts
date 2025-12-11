import { useTenantContext } from '../context/TenantContext';

/**
 * Hook to access the current tenant
 */
export const useTenant = () => {
  const { currentTenant, setCurrentTenant, isLoading, error, refreshTenant } = useTenantContext();

  return {
    tenant: currentTenant,
    setTenant: setCurrentTenant,
    isLoading,
    error,
    refreshTenant,
  };
};

