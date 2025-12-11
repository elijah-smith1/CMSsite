import React from 'react';

interface MediaItem {
  src?: string;
  alt?: string;
  caption?: string;
}

interface MediaRowProps {
  items?: MediaItem[];
  title?: string;
}

export const MediaRow: React.FC<MediaRowProps> = ({ items, title }) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Determine grid columns based on item count
  const getGridCols = () => {
    if (items.length === 1) return 'grid-cols-1';
    if (items.length === 2) return 'grid-cols-1 md:grid-cols-2';
    if (items.length === 3) return 'grid-cols-1 md:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-4';
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            {title}
          </h2>
        )}

        <div className={`grid ${getGridCols()} gap-4 md:gap-6`}>
          {items.map((item, index) => (
            <div key={index} className="relative group">
              {item.src && (
                <img
                  src={item.src}
                  alt={item.alt || ''}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              )}
              {item.caption && (
                <p className="mt-2 text-sm text-gray-600 text-center">
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

