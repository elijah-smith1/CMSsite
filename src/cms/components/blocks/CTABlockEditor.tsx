import React, { useState, useEffect } from 'react';
import { CTABlock, CTA } from '../../../utils/types/sites';
import { TextInput } from '../../../components/inputs/TextInput';
import { BlockImageUpload } from '../common/BlockImageUpload';
import { CTAEditor } from '../common/CTAEditor';
import { BlockSaveBar } from '../common/BlockSaveBar';
import { Plus } from 'lucide-react';
import { generateId } from '../../../utils/formatters';

interface CTABlockEditorProps {
  block: CTABlock;
  siteId: string;
  pageId: string;
  blockIndex: number;
  onSave: (block: CTABlock) => void;
  isSaving?: boolean;
}

export const CTABlockEditor: React.FC<CTABlockEditorProps> = ({
  block,
  siteId,
  pageId,
  blockIndex,
  onSave,
  isSaving,
}) => {
  const [data, setData] = useState<CTABlock>(block);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setData(block);
    setHasChanges(false);
  }, [block]);

  const updateField = <K extends keyof CTABlock>(key: K, value: CTABlock[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(data);
    setHasChanges(false);
  };

  const addButton = () => {
    const newCTA: CTA = {
      id: generateId(),
      text: 'Button',
      url: '#',
      variant: 'primary',
    };
    updateField('buttons', [...data.buttons, newCTA]);
  };

  const updateButton = (index: number, cta: CTA) => {
    const buttons = [...data.buttons];
    buttons[index] = cta;
    updateField('buttons', buttons);
  };

  const removeButton = (index: number) => {
    const buttons = data.buttons.filter((_, i) => i !== index);
    updateField('buttons', buttons);
  };

  return (
    <div className="space-y-6">
      <TextInput
        label="Title"
        value={data.title}
        onChange={(value) => updateField('title', value)}
        placeholder="Ready to get started?"
        required
      />

      <TextInput
        label="Description"
        value={data.description || ''}
        onChange={(value) => updateField('description', value)}
        placeholder="Take the next step today"
      />

      <BlockImageUpload
        label="Background Image (Optional)"
        value={data.backgroundImage || ''}
        onChange={(url) => updateField('backgroundImage', url)}
        siteId={siteId}
        pageId={pageId}
        blockId={data.id}
        aspectRatio="21/9"
      />

      <TextInput
        label="Background Color (if no image)"
        value={data.backgroundColor || ''}
        onChange={(value) => updateField('backgroundColor', value)}
        placeholder="#1a365d or blue-900"
      />

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            Buttons ({data.buttons.length})
          </label>
          <button
            type="button"
            onClick={addButton}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Button
          </button>
        </div>

        {data.buttons.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No buttons added</p>
        ) : (
          <div className="space-y-3">
            {data.buttons.map((button, index) => (
              <CTAEditor
                key={button.id}
                cta={button}
                onChange={(updated) => updateButton(index, updated)}
                onRemove={() => removeButton(index)}
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

