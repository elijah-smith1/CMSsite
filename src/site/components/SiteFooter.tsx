import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../hooks/useFooter';

interface SiteFooterProps {
  footer: Footer | null;
  siteName?: string;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ footer, siteName }) => {
  if (!footer) {
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {siteName || 'All rights reserved.'}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Tagline */}
          <div className="md:col-span-1">
            {footer.logo ? (
              <img src={footer.logo} alt={siteName || ''} className="h-10 mb-4" />
            ) : (
              <h3 className="text-xl font-bold mb-4">{siteName}</h3>
            )}
            {footer.tagline && (
              <p className="text-gray-400 text-sm">{footer.tagline}</p>
            )}

            {/* Social Links */}
            {footer.socialLinks && footer.socialLinks.length > 0 && (
              <div className="flex space-x-4 mt-4">
                {footer.socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Footer Columns */}
          {footer.columns && footer.columns.map((column) => (
            <div key={column.id}>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link, i) => (
                  <li key={i}>
                    {link.url.startsWith('/') ? (
                      <Link
                        to={link.url}
                        className="text-gray-400 hover:text-white text-sm transition"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.url}
                        className="text-gray-400 hover:text-white text-sm transition"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {footer.copyright || `© ${new Date().getFullYear()} ${siteName || 'All rights reserved.'}`}
          </p>
        </div>
      </div>
    </footer>
  );
};

