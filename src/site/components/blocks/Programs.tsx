import React from 'react';
import { Block } from '../../hooks/usePageData';

interface ProgramItem {
  name?: string;
  title?: string;
  description?: string;
  image?: { src?: string; alt?: string };
  age?: string;
  schedule?: string;
  cta?: { text?: string; href?: string };
}

interface ProgramsProps extends Partial<Block> {
  programs?: ProgramItem[];
}

export const Programs: React.FC<ProgramsProps> = ({
  title,
  subtitle,
  programs,
}) => {
  if (!programs || programs.length === 0) {
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

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              {/* Image */}
              {program.image?.src && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={program.image.src}
                    alt={program.image.alt || program.name || ''}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {(program.name || program.title) && (
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {program.name || program.title}
                  </h3>
                )}

                {program.age && (
                  <p className="text-sm text-primary-600 font-medium mb-2">
                    {program.age}
                  </p>
                )}

                {program.schedule && (
                  <p className="text-sm text-gray-500 mb-3">
                    {program.schedule}
                  </p>
                )}

                {program.description && (
                  <p className="text-gray-600 mb-4">{program.description}</p>
                )}

                {program.cta && program.cta.text && (
                  <a
                    href={program.cta.href || '#'}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {program.cta.text}
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

