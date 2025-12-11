import React from 'react';
import { Block } from '../../utils/types/sites';
import { HeroBlockEditor } from './blocks/HeroBlockEditor';
import { ContentBlockEditor } from './blocks/ContentBlockEditor';
import { MediaRowBlockEditor } from './blocks/MediaRowBlockEditor';
import { ImageDividerBlockEditor } from './blocks/ImageDividerBlockEditor';
import { FeaturesBlockEditor } from './blocks/FeaturesBlockEditor';
import { ProgramsBlockEditor } from './blocks/ProgramsBlockEditor';
import { ScheduleBlockEditor } from './blocks/ScheduleBlockEditor';
import { CTABlockEditor } from './blocks/CTABlockEditor';
import { TextBlockEditor } from './blocks/TextBlockEditor';
import { GalleryBlockEditor } from './blocks/GalleryBlockEditor';
import { TestimonialsBlockEditor } from './blocks/TestimonialsBlockEditor';

interface BlockEditorProps {
  block: Block;
  siteId: string;
  pageId: string;
  blockIndex: number;
  onSave: (block: Block) => void;
  isSaving?: boolean;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  block,
  siteId,
  pageId,
  blockIndex,
  onSave,
  isSaving,
}) => {
  const commonProps = {
    siteId,
    pageId,
    blockIndex,
    onSave,
    isSaving,
  };

  switch (block.type) {
    case 'hero':
      return <HeroBlockEditor block={block} {...commonProps} />;
    
    case 'content-block':
      return <ContentBlockEditor block={block} {...commonProps} />;
    
    case 'media-row':
      return <MediaRowBlockEditor block={block} {...commonProps} />;
    
    case 'image-divider':
      return <ImageDividerBlockEditor block={block} {...commonProps} />;
    
    case 'features':
      return <FeaturesBlockEditor block={block} {...commonProps} />;
    
    case 'programs':
      return <ProgramsBlockEditor block={block} {...commonProps} />;
    
    case 'schedule':
      return <ScheduleBlockEditor block={block} {...commonProps} />;
    
    case 'cta':
      return <CTABlockEditor block={block} {...commonProps} />;
    
    case 'text':
      return <TextBlockEditor block={block} {...commonProps} />;
    
    case 'gallery':
      return <GalleryBlockEditor block={block} {...commonProps} />;
    
    case 'testimonials':
      return <TestimonialsBlockEditor block={block} {...commonProps} />;
    
    default:
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Unknown block type: <code className="font-mono">{(block as any).type}</code>
          </p>
          <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
            {JSON.stringify(block, null, 2)}
          </pre>
        </div>
      );
  }
};

