import React from 'react';
import { Menu, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../hooks/useTenant';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title, showBack = false }) => {
  const { tenant } = useTenant();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="h-6 w-6" />
          </button>

          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {title || tenant?.name || 'CMS'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {tenant && (
            <button
              onClick={() => navigate('/site-selector')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Switch Site
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

