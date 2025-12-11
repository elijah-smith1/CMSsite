import React, { useState, useEffect } from 'react';
import { ImageDividerBlock } from '../../../utils/types/sites';
import { TextInput } from '../../../components/inputs/TextInput';
import { BlockImageUpload } from '../common/BlockImageUpload';
import { BlockSaveBar } from '../common/BlockSaveBar';

interface ImageDividerBlockEditorProps {
  block: ImageDividerBlock;
  siteId: string;
  pageId: string;
  blockIndex: number;
  onSave: (block: ImageDividerBlock) => void;
  isSaving?: boolean;
}

export const ImageDividerBlockEditor: React.FC<ImageDividerBlockEditorProps> = ({
  block,
  siteId,
  pageId,
  blockIndex,
  onSave,
  isSaving,
}) => {
  const [data, setData] = useState<ImageDividerBlock>(block);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setData(block);
    setHasChanges(false);
  }, [block]);

  const updateField = <K extends keyof ImageDividerBlock>(key: K, value: ImageDividerBlock[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(data);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <BlockImageUpload
        label="Image"
        value={data.image}
        onChange={(url) => updateField('image', url)}
        siteId={siteId}
        pageId={pageId}
        blockId={data.id}
        aspectRatio="21/9"
        required
      />

      <TextInput
        label="Alt Text"
        value={data.alt || ''}
        onChange={(value) => updateField('alt', value)}
        placeholder="Describe the image for accessibility"
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Height
        </label>
        <div className="flex gap-2">
          {(['small', 'medium', 'large'] as const).map((height) => (
            <button
              key={height}
              type="button"
              onClick={() => updateField('height', height)}
              className={`px-4 py-2 text-sm rounded-lg border transition ${
                data.height === height
                  ? 'bg-primary-100 border-primary-500 text-primary-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {height.charAt(0).toUpperCase() + height.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <BlockSaveBar
        onSave={handleSave}
        isSaving={isSaving}
        hasChanges={hasChanges}
      />
    </div>
  );
};

