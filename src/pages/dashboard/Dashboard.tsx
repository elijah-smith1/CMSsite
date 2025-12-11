import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../hooks/useTenant';
import {
  Home,
  Info,
  Menu as MenuIcon,
  Calendar,
  Image as ImageIconLucide,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { capitalize } from '../../utils/formatters';

const sectionIcons: Record<string, React.ReactNode> = {
  home: <Home className="h-8 w-8" />,
  about: <Info className="h-8 w-8" />,
  menu: <MenuIcon className="h-8 w-8" />,
  events: <Calendar className="h-8 w-8" />,
  gallery: <ImageIconLucide className="h-8 w-8" />,
  contact: <Mail className="h-8 w-8" />,
};

const sectionDescriptions: Record<string, string> = {
  home: 'Edit hero section, banners, and homepage content',
  about: 'Update your story, mission, and company information',
  menu: 'Manage menu items, categories, and pricing',
  events: 'Add and edit upcoming events',
  gallery: 'Upload and organize your photo gallery',
  contact: 'Update contact information and social media links',
};

export const Dashboard: React.FC = () => {
  const { tenant } = useTenant();
  const navigate = useNavigate();

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select a website to continue</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Manage content for <span className="font-semibold">{tenant.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenant.sections.map((section) => (
          <button
            key={section}
            onClick={() => navigate(`/sections/${section}`)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl p-6 text-left transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
                {sectionIcons[section] || <Home className="h-8 w-8" />}
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {capitalize(section)}
            </h3>
            <p className="text-sm text-gray-600">
              {sectionDescriptions[section] || `Edit ${section} content`}
            </p>
          </button>
        ))}
      </div>

      {tenant.sections.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No sections available for this website</p>
        </div>
      )}
    </div>
  );
};

