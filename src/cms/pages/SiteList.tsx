import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSites } from '../../hooks/useSites';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { Globe, ChevronRight, LogOut, Plus, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export const SiteList: React.FC = () => {
  const { data: sites, isLoading, error } = useSites();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading sites..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading sites</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Site Manager</h1>
                <p className="text-xs text-slate-500">CMS Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center text-slate-600 hover:text-slate-900 transition px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your Sites</h2>
            <p className="text-slate-600 mt-1">Select a site to manage its content</p>
          </div>
          {/* Future: Add new site button */}
          {/* <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
            <Plus className="h-5 w-5 mr-2" />
            New Site
          </button> */}
        </div>

        {sites && sites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <Globe className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Sites Found</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              No sites are available in the database. Create a site document in Firestore
              under the <code className="bg-slate-100 px-2 py-1 rounded text-sm">sites</code> collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites?.map((site) => (
              <button
                key={site.id}
                onClick={() => navigate(`/cms/sites/${site.id}`)}
                className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-left transition-all hover:shadow-lg hover:border-primary-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-primary-700 transition">
                  {site.name || 'Unnamed Site'}
                </h3>
                
                {site.tagline && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {site.tagline}
                  </p>
                )}
                
                <div className="flex items-center text-xs text-slate-500">
                  <code className="bg-slate-100 px-2 py-1 rounded font-mono">
                    {site.id}
                  </code>
                </div>
                
                {site.domain && (
                  <p className="text-xs text-slate-500 mt-2">
                    {site.domain}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

