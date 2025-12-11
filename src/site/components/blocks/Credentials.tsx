import React from 'react';
import { Block } from '../../hooks/usePageData';

interface CredentialItem {
  title?: string;
  description?: string;
  icon?: string;
  image?: { src?: string; alt?: string };
}

interface CredentialsProps extends Partial<Block> {
  items?: CredentialItem[];
}

export const Credentials: React.FC<CredentialsProps> = ({
  title,
  subtitle,
  items,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((credential, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl"
            >
              {/* Icon or Image */}
              {credential.icon && (
                <div className="flex-shrink-0 text-3xl">
                  {credential.icon}
                </div>
              )}
              {credential.image?.src && !credential.icon && (
                <div className="flex-shrink-0 w-16 h-16">
                  <img
                    src={credential.image.src}
                    alt={credential.image.alt || ''}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Content */}
              <div>
                {credential.title && (
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {credential.title}
                  </h3>
                )}
                {credential.description && (
                  <p className="text-gray-600 text-sm">
                    {credential.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

