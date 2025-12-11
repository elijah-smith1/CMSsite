import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../hooks/useTenant';
import { useAuth } from '../../hooks/useAuth';
import { getAllTenants } from '../../services/tenantService';
import { Tenant } from '../../utils/types';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { Globe, ChevronRight, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export const SiteSelector: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const { setTenant } = useTenant();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTenants();
  }, [user]);

  const loadTenants = async () => {
    setLoading(true);
    try {
      // NOTE: For demo/testing purposes, we fetch all tenants
      // In production, implement user-tenant relationships:
      // Option 1: Store tenantIds in user document: const userDoc = await getDocument('users', user.uid);
      // Option 2: Use Firebase custom claims: user.customClaims.tenantIds
      // Option 3: Create a members subcollection on each tenant
      const allTenants = await getAllTenants();
      setTenants(allTenants);
    } catch (error) {
      console.error('Error loading tenants:', error);
      toast.error('Failed to load websites');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTenant = (tenant: Tenant) => {
    setTenant(tenant);
    navigate('/dashboard');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your websites..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="max-w-4xl mx-auto pt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Select a Website</h1>
            <p className="text-gray-600">Choose which website you want to manage</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center text-gray-600 hover:text-gray-900 transition"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>

        {tenants.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Websites Found</h3>
            <p className="text-gray-600 mb-6">
              You don't have access to any websites yet. Please contact your administrator.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenants.map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => handleSelectTenant(tenant)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 text-left transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Globe className="h-6 w-6 text-primary-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">{tenant.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tenant.domain}</p>
                    <div className="flex flex-wrap gap-2">
                      {tenant.sections.map((section) => (
                        <span
                          key={section}
                          className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md font-medium"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

