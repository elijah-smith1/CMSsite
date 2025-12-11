import React from 'react';
import { Block } from '../../hooks/usePageData';

interface ContentBlockProps extends Partial<Block> {}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  label,
  title,
  description,
  image,
  cta,
  stats,
  reverse,
  darkText,
}) => {
  const bgColor = darkText ? 'bg-white' : 'bg-gray-50';

  return (
    <section className={`py-16 md:py-24 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
          {/* Image */}
          {image?.src && (
            <div className="w-full md:w-1/2">
              <img
                src={image.src}
                alt={image.alt || ''}
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className={`w-full ${image?.src ? 'md:w-1/2' : ''}`}>
            {label && (
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
                {label}
              </span>
            )}

            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {title}
              </h2>
            )}

            {description && (
              <div className="text-gray-700 text-lg leading-relaxed space-y-4">
                {Array.isArray(description) ? (
                  description.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <p>{description}</p>
                )}
              </div>
            )}

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            {cta && cta.text && (
              <div className="mt-8">
                <a
                  href={cta.href || '#'}
                  className={`inline-flex items-center px-6 py-3 rounded-lg transition font-medium ${
                    cta.variant === 'outline'
                      ? 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {cta.text}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

