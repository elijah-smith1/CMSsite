import React from 'react';
import { Block } from '../../hooks/usePageData';

interface FeatureItem {
  icon?: string;
  title?: string;
  description?: string;
}

interface FeaturesProps extends Partial<Block> {
  items?: FeatureItem[];
}

export const Features: React.FC<FeaturesProps> = ({
  title,
  subtitle,
  items,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Determine grid columns
  const getGridCols = () => {
    if (items.length <= 2) return 'md:grid-cols-2';
    if (items.length === 3) return 'md:grid-cols-3';
    return 'md:grid-cols-4';
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
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

        {/* Feature Grid */}
        <div className={`grid grid-cols-1 ${getGridCols()} gap-8`}>
          {items.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              {feature.icon && (
                <div className="text-4xl mb-4">{feature.icon}</div>
              )}
              {feature.title && (
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
              )}
              {feature.description && (
                <p className="text-gray-600">{feature.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

