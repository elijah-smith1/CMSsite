import React from 'react';
import { Block } from '../../hooks/usePageData';

interface ImageDividerProps extends Partial<Block> {}

export const ImageDivider: React.FC<ImageDividerProps> = ({ image, title }) => {
  if (!image?.src) {
    return null;
  }

  return (
    <section className="relative">
      <div
        className="h-64 md:h-96 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${image.src})` }}
      >
        {/* Optional overlay with title */}
        {title && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center px-4">
              {title}
            </h2>
          </div>
        )}
      </div>
    </section>
  );
};

