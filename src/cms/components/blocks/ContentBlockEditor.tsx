import React, { useState, useEffect } from 'react';
import { ContentBlock, CTA } from '../../../utils/types/sites';
import { TextInput } from '../../../components/inputs/TextInput';
import { RichTextEditor } from '../../../components/inputs/RichTextEditor';
import { BlockImageUpload } from '../common/BlockImageUpload';
import { CTAEditor } from '../common/CTAEditor';
import { BlockSaveBar } from '../common/BlockSaveBar';
import { Plus } from 'lucide-react';
import { generateId } from '../../../utils/formatters';

interface ContentBlockEditorProps {
  block: ContentBlock;
  siteId: string;
  pageId: string;
  blockIndex: number;
  onSave: (block: ContentBlock) => void;
  isSaving?: boolean;
}

export const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  block,
  siteId,
  pageId,
  blockIndex,
  onSave,
  isSaving,
}) => {
  const [data, setData] = useState<ContentBlock>(block);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setData(block);
    setHasChanges(false);
  }, [block]);

  const updateField = <K extends keyof ContentBlock>(key: K, value: ContentBlock[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(data);
    setHasChanges(false);
  };

  const addCTA = () => {
    const newCTA: CTA = {
      id: generateId(),
      text: 'Learn More',
      url: '#',
      variant: 'primary',
    };
    updateField('cta', newCTA);
  };

  const removeCTA = () => {
    updateField('cta', undefined);
  };

  return (
    <div className="space-y-6">
      <TextInput
        label="Label (Optional)"
        value={data.label || ''}
        onChange={(value) => updateField('label', value)}
        placeholder="e.g., About Us"
      />

      <TextInput
        label="Title"
        value={data.title}
        onChange={(value) => updateField('title', value)}
        placeholder="Enter section title"
        required
      />

      <RichTextEditor
        label="Content"
        value={data.text}
        onChange={(value) => updateField('text', value)}
        placeholder="Enter content text..."
        minHeight="150px"
      />

      <BlockImageUpload
        label="Image"
        value={data.image || ''}
        onChange={(url) => updateField('image', url)}
        siteId={siteId}
        pageId={pageId}
        blockId={data.id}
        aspectRatio="4/3"
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Image Position
        </label>
        <div className="flex gap-2">
          {(['left', 'right'] as const).map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => updateField('imagePosition', pos)}
              className={`px-4 py-2 text-sm rounded-lg border transition ${
                data.imagePosition === pos
                  ? 'bg-primary-100 border-primary-500 text-primary-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Image on {pos.charAt(0).toUpperCase() + pos.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            Call to Action (Optional)
          </label>
          {!data.cta && (
            <button
              type="button"
              onClick={addCTA}
              className="flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Button
            </button>
          )}
        </div>
        
        {data.cta && (
          <CTAEditor
            cta={data.cta}
            onChange={(updated) => updateField('cta', updated)}
            onRemove={removeCTA}
          />
        )}
      </div>

      <BlockSaveBar
        onSave={handleSave}
        isSaving={isSaving}
        hasChanges={hasChanges}
      />
    </div>
  );
};

