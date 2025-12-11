import React from 'react';
import { X } from 'lucide-react';
import { Block, BlockType, BLOCK_TYPE_META } from '../../utils/types/sites';
import { generateId } from '../../utils/formatters';

interface AddBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (block: Block) => void;
}

const blockTypes: BlockType[] = [
  'hero',
  'content-block',
  'text',
  'media-row',
  'image-divider',
  'features',
  'programs',
  'schedule',
  'cta',
  'gallery',
  'testimonials',
];

export const AddBlockModal: React.FC<AddBlockModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  if (!isOpen) return null;

  const handleAddBlock = (type: BlockType) => {
    const baseBlock = {
      id: generateId(),
      type,
      order: 0,
    };

    let block: Block;

    switch (type) {
      case 'hero':
        block = {
          ...baseBlock,
          type: 'hero',
          title: 'Hero Title',
          subtitle: 'Hero subtitle text goes here',
          ctas: [],
        };
        break;

      case 'content-block':
        block = {
          ...baseBlock,
          type: 'content-block',
          title: 'Content Title',
          text: 'Content text goes here...',
          imagePosition: 'right',
        };
        break;

      case 'text':
        block = {
          ...baseBlock,
          type: 'text',
          title: 'Section Title',
          content: '<p>Add your text content here...</p>',
        };
        break;

      case 'media-row':
        block = {
          ...baseBlock,
          type: 'media-row',
          images: [],
          columns: 3,
        };
        break;

      case 'image-divider':
        block = {
          ...baseBlock,
          type: 'image-divider',
          image: '',
          height: 'medium',
        };
        break;

      case 'features':
        block = {
          ...baseBlock,
          type: 'features',
          title: 'Our Features',
          features: [],
          columns: 3,
        };
        break;

      case 'programs':
        block = {
          ...baseBlock,
          type: 'programs',
          title: 'Our Programs',
          programs: [],
        };
        break;

      case 'schedule':
        block = {
          ...baseBlock,
          type: 'schedule',
          title: 'Schedule',
          sessions: [],
          filters: [],
        };
        break;

      case 'cta':
        block = {
          ...baseBlock,
          type: 'cta',
          title: 'Ready to Get Started?',
          description: 'Take the next step today.',
          buttons: [],
        };
        break;

      case 'gallery':
        block = {
          ...baseBlock,
          type: 'gallery',
          title: 'Gallery',
          images: [],
          layout: 'grid',
        };
        break;

      case 'testimonials':
        block = {
          ...baseBlock,
          type: 'testimonials',
          title: 'What People Say',
          testimonials: [],
        };
        break;

      default:
        block = baseBlock as Block;
    }

    onAdd(block);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Add Block</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Block Types Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {blockTypes.map((type) => {
              const meta = BLOCK_TYPE_META[type];
              return (
                <button
                  key={type}
                  onClick={() => handleAddBlock(type)}
                  className="flex flex-col items-center p-4 border border-slate-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition text-center group"
                >
                  <div className="w-12 h-12 bg-slate-100 group-hover:bg-primary-100 rounded-lg flex items-center justify-center mb-3 transition">
                    <span className="text-lg font-semibold text-slate-600 group-hover:text-primary-600">
                      {meta?.label?.charAt(0) || type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {meta?.label || type}
                  </span>
                  <span className="text-xs text-slate-500 mt-1">
                    {meta?.description || ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

