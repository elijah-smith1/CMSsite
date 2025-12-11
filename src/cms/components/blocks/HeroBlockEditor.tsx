import React, { useState, useEffect } from 'react';
import { HeroBlock, CTA } from '../../../utils/types/sites';
import { TextInput } from '../../../components/inputs/TextInput';
import { BlockImageUpload } from '../common/BlockImageUpload';
import { CTAEditor } from '../common/CTAEditor';
import { BlockSaveBar } from '../common/BlockSaveBar';
import { Plus } from 'lucide-react';
import { generateId } from '../../../utils/formatters';

interface HeroBlockEditorProps {
  block: HeroBlock;
  siteId: string;
  pageId: string;
  blockIndex: number;
  onSave: (block: HeroBlock) => void;
  isSaving?: boolean;
}

export const HeroBlockEditor: React.FC<HeroBlockEditorProps> = ({
  block,
  siteId,
  pageId,
  blockIndex,
  onSave,
  isSaving,
}) => {
  const [data, setData] = useState<HeroBlock>(block);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setData(block);
    setHasChanges(false);
  }, [block]);

  const updateField = <K extends keyof HeroBlock>(key: K, value: HeroBlock[K]) => {
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
      text: 'Button',
      url: '#',
      variant: 'primary',
    };
    updateField('ctas', [...(data.ctas || []), newCTA]);
  };

  const updateCTA = (index: number, cta: CTA) => {
    const ctas = [...(data.ctas || [])];
    ctas[index] = cta;
    updateField('ctas', ctas);
  };

  const removeCTA = (index: number) => {
    const ctas = (data.ctas || []).filter((_, i) => i !== index);
    updateField('ctas', ctas);
  };

  return (
    <div className="space-y-6">
      <TextInput
        label="Title"
        value={data.title}
        onChange={(value) => updateField('title', value)}
        placeholder="Enter hero title"
        required
      />

      <TextInput
        label="Subtitle"
        value={data.subtitle || ''}
        onChange={(value) => updateField('subtitle', value)}
        placeholder="Enter hero subtitle"
      />

      <BlockImageUpload
        label="Background Image"
        value={data.backgroundImage || ''}
        onChange={(url) => updateField('backgroundImage', url)}
        siteId={siteId}
        pageId={pageId}
        blockId={data.id}
        aspectRatio="16/9"
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Text Alignment
        </label>
        <div className="flex gap-2">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => updateField('alignment', align)}
              className={`px-4 py-2 text-sm rounded-lg border transition ${
                data.alignment === align
                  ? 'bg-primary-100 border-primary-500 text-primary-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            Call to Action Buttons
          </label>
          <button
            type="button"
            onClick={addCTA}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Button
          </button>
        </div>
        
        {(data.ctas || []).length === 0 ? (
          <p className="text-sm text-slate-500 italic">No buttons added</p>
        ) : (
          <div className="space-y-3">
            {(data.ctas || []).map((cta, index) => (
              <CTAEditor
                key={cta.id}
                cta={cta}
                onChange={(updated) => updateCTA(index, updated)}
                onRemove={() => removeCTA(index)}
              />
            ))}
          </div>
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

