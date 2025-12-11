import React, { useState, useEffect } from 'react';
import { MediaRowBlock, MediaImage } from '../../../utils/types/sites';
import { TextInput } from '../../../components/inputs/TextInput';
import { BlockImageUpload } from '../common/BlockImageUpload';
import { BlockSaveBar } from '../common/BlockSaveBar';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '../../../utils/formatters';

interface MediaRowBlockEditorProps {
  block: MediaRowBlock;
  siteId: string;
  pageId: string;
  blockIndex: number;
  onSave: (block: MediaRowBlock) => void;
  isSaving?: boolean;
}

export const MediaRowBlockEditor: React.FC<MediaRowBlockEditorProps> = ({
  block,
  siteId,
  pageId,
  blockIndex,
  onSave,
  isSaving,
}) => {
  const [data, setData] = useState<MediaRowBlock>({
    ...block,
    images: block.images ?? [],
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setData({
      ...block,
      images: block.images ?? [],
    });
    setHasChanges(false);
  }, [block]);

  const updateField = <K extends keyof MediaRowBlock>(key: K, value: MediaRowBlock[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(data);
    setHasChanges(false);
  };

  const addImage = () => {
    const newImage: MediaImage = {
      id: generateId(),
      src: '',
      alt: '',
    };
    updateField('images', [...(data.images ?? []), newImage]);
  };

  const updateImage = (index: number, updates: Partial<MediaImage>) => {
    const images = [...(data.images ?? [])];
    images[index] = { ...images[index], ...updates };
    updateField('images', images);
  };

  const removeImage = (index: number) => {
    const images = (data.images ?? []).filter((_, i) => i !== index);
    updateField('images', images);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Columns
        </label>
        <div className="flex gap-2">
          {([2, 3, 4] as const).map((cols) => (
            <button
              key={cols}
              type="button"
              onClick={() => updateField('columns', cols)}
              className={`px-4 py-2 text-sm rounded-lg border transition ${
                data.columns === cols
                  ? 'bg-primary-100 border-primary-500 text-primary-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cols} Columns
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            Images ({(data.images ?? []).length})
          </label>
          <button
            type="button"
            onClick={addImage}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Image
          </button>
        </div>

        {data.images.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
            <p className="text-sm text-slate-500">No images added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {data.images.map((image, index) => (
              <div key={image.id} className="relative border border-slate-200 rounded-lg p-3 bg-slate-50">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                
                <BlockImageUpload
                  label=""
                  value={image.src}
                  onChange={(url) => updateImage(index, { src: url })}
                  siteId={siteId}
                  pageId={pageId}
                  blockId={`${data.id}-${image.id}`}
                  aspectRatio="1/1"
                />
                
                <TextInput
                  label="Caption"
                  value={image.caption || ''}
                  onChange={(value) => updateImage(index, { caption: value })}
                  placeholder="Image caption"
                />
              </div>
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

