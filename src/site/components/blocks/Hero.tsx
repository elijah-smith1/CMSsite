import React from 'react';
import { Block } from '../../hooks/usePageData';

interface HeroProps extends Partial<Block> {}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  image,
  cta,
  buttons,
  darkText,
}) => {
  const textColor = darkText ? 'text-gray-900' : 'text-white';
  const hasBackground = image?.src;

  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center"
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
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {title && (
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${textColor}`}>
            {title}
          </h1>
        )}

        {subtitle && (
          <p className={`text-xl md:text-2xl mb-8 ${textColor} opacity-90`}>
            {subtitle}
          </p>
        )}

        {description && (
          <div className={`text-lg mb-8 ${textColor} opacity-80`}>
            {Array.isArray(description) ? (
              description.map((p, i) => <p key={i} className="mb-2">{p}</p>)
            ) : (
              <p>{description}</p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {cta && cta.text && (
            <a
              href={cta.href || '#'}
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              {cta.text}
            </a>
          )}
          
          {buttons && buttons.map((btn: any, i: number) => (
            <a
              key={i}
              href={btn.href || '#'}
              className={`inline-flex items-center px-8 py-3 rounded-lg transition font-medium ${
                btn.variant === 'secondary' || btn.variant === 'outline'
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
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

