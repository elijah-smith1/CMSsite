import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant } from '../utils/types';
import { getTenant } from '../services/tenantService';

interface TenantContextType {
  currentTenant: Tenant | null;
  setCurrentTenant: (tenant: Tenant | null) => void;
  isLoading: boolean;
  error: string | null;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tenant from localStorage on mount
  useEffect(() => {
    const storedTenantId = localStorage.getItem('selectedTenantId');
    if (storedTenantId) {
      loadTenant(storedTenantId);
    }
  }, []);

  // Save tenant to localStorage when it changes
  useEffect(() => {
    if (currentTenant) {
      localStorage.setItem('selectedTenantId', currentTenant.id);
    } else {
      localStorage.removeItem('selectedTenantId');
    }
  }, [currentTenant]);

  const loadTenant = async (tenantId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const tenant = await getTenant(tenantId);
      setCurrentTenant(tenant);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tenant');
      setCurrentTenant(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTenant = async () => {
    if (currentTenant) {
      await loadTenant(currentTenant.id);
    }
  };

  const handleSetCurrentTenant = (tenant: Tenant | null) => {
    setCurrentTenant(tenant);
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        setCurrentTenant: handleSetCurrentTenant,
        isLoading,
        error,
        refreshTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenantContext = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
};

