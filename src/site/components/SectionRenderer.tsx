import React from 'react';
import { Block } from '../hooks/usePageData';

// Block Components
import { IntroSection } from './blocks/IntroSection';
import { Hero } from './blocks/Hero';
import { ContentBlock } from './blocks/ContentBlock';
import { MediaRow } from './blocks/MediaRow';
import { ImageDivider } from './blocks/ImageDivider';
import { Features } from './blocks/Features';
import { Programs } from './blocks/Programs';
import { Schedule } from './blocks/Schedule';
import { Credentials } from './blocks/Credentials';
import { CTASection } from './blocks/CTASection';

interface SectionRendererProps {
  block: Block;
}

/**
 * Routes block data to the appropriate component based on block.type.
 * Unknown block types log a warning and render nothing.
 */
export const SectionRenderer: React.FC<SectionRendererProps> = ({ block }) => {
  switch (block.type) {
    case 'intro-section':
      return <IntroSection {...block} />;

    case 'hero':
      return <Hero {...block} />;

    case 'content-block':
      return <ContentBlock {...block} />;

    case 'media-row':
      return <MediaRow items={block.items} />;

    case 'image-divider':
      return <ImageDivider {...block} />;

    case 'features':
      return <Features {...block} />;

    case 'programs':
      return <Programs {...block} />;

    case 'schedule':
      return <Schedule {...block} />;

    case 'credentials':
      return <Credentials {...block} />;

    case 'cta':
      return <CTASection {...block} />;

    default:
      console.warn('⚠️ Unknown block type:', block.type);
      return null;
  }
};

