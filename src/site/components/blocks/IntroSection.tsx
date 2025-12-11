import React from 'react';
import { Block } from '../../hooks/usePageData';

interface IntroSectionProps extends Partial<Block> {}

export const IntroSection: React.FC<IntroSectionProps> = ({
  title,
  subtitle,
  description,
  image,
  cta,
}) => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {title && (
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h1>
          )}
          
          {subtitle && (
            <p className="text-xl text-gray-600 mb-8">
              {subtitle}
            </p>
          )}

          {description && (
            <div className="prose prose-lg mx-auto text-gray-700">
              {Array.isArray(description) ? (
                description.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>{description}</p>
              )}
            </div>
          )}

          {image?.src && (
            <div className="mt-10">
              <img
                src={image.src}
                alt={image.alt || ''}
                className="rounded-lg shadow-lg mx-auto"
              />
            </div>
          )}

          {cta && cta.text && (
            <div className="mt-10">
              <a
                href={cta.href || '#'}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
              >
                {cta.text}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

