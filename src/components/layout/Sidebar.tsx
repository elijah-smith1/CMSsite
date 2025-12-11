import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Info,
  Menu as MenuIcon,
  Calendar,
  Image as ImageIconLucide,
  Mail,
  LogOut,
} from 'lucide-react';
import { useTenant } from '../../hooks/useTenant';
import { useAuth } from '../../hooks/useAuth';
import { capitalize } from '../../utils/formatters';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sectionIcons: Record<string, React.ReactNode> = {
  home: <Home className="h-5 w-5" />,
  about: <Info className="h-5 w-5" />,
  menu: <MenuIcon className="h-5 w-5" />,
  events: <Calendar className="h-5 w-5" />,
  gallery: <ImageIconLucide className="h-5 w-5" />,
  contact: <Mail className="h-5 w-5" />,
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { tenant } = useTenant();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">CMS</h1>
          </div>

          {/* Tenant Info */}
          {tenant && (
            <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
              <p className="text-xs text-gray-600 mb-1">Current Site</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{tenant.name}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mb-2 rounded-lg transition ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
              onClick={onClose}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </NavLink>

            {tenant && tenant.sections.length > 0 && (
              <div className="mt-6">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Sections
                </p>
                {tenant.sections.map((section) => (
                  <NavLink
                    key={section}
                    to={`/sections/${section}`}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 mb-2 rounded-lg transition ${
                        isActive
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                    onClick={onClose}
                  >
                    {sectionIcons[section] || <Home className="h-5 w-5" />}
                    <span className="ml-3">{capitalize(section)}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

