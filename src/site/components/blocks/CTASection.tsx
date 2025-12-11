import React from 'react';
import { Block } from '../../hooks/usePageData';

interface CTASectionProps extends Partial<Block> {}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  description,
  image,
  cta,
  buttons,
}) => {
  const hasBackground = image?.src;

  return (
    <section
      className="relative py-16 md:py-24"
      style={
        hasBackground
          ? {
              backgroundImage: `url(${image.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { backgroundColor: '#1e3a5f' }
      }
    >
      {/* Overlay */}
      {hasBackground && (
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
        )}

        {(subtitle || description) && (
          <p className="text-xl text-white opacity-90 mb-8">
            {subtitle || (typeof description === 'string' ? description : '')}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {cta && cta.text && (
            <a
              href={cta.href || '#'}
              className={`inline-flex items-center px-8 py-3 rounded-lg transition font-medium ${
                cta.variant === 'outline'
                  ? 'border-2 border-white text-white hover:bg-white hover:text-gray-900'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {cta.text}
            </a>
          )}

          {buttons && buttons.map((btn: any, i: number) => (
            <a
              key={i}
              href={btn.href || '#'}
              className={`inline-flex items-center px-8 py-3 rounded-lg transition font-medium ${
                btn.variant === 'outline'
                  ? 'border-2 border-white text-white hover:bg-white hover:text-gray-900'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {btn.text}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

