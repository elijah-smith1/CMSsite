import React, { useState, useEffect } from 'react';
import { FeaturesBlock, Feature } from '../../../utils/types/sites';
import { TextInput } from '../../../components/inputs/TextInput';
import { BlockSaveBar } from '../common/BlockSaveBar';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { generateId } from '../../../utils/formatters';

interface FeaturesBlockEditorProps {
  block: FeaturesBlock;
  siteId: string;
  pageId: string;
  blockIndex: number;
  onSave: (block: FeaturesBlock) => void;
  isSaving?: boolean;
}

export const FeaturesBlockEditor: React.FC<FeaturesBlockEditorProps> = ({
  block,
  siteId,
  pageId,
  blockIndex,
  onSave,
  isSaving,
}) => {
  const [data, setData] = useState<FeaturesBlock>(block);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setData(block);
    setHasChanges(false);
  }, [block]);

  const updateField = <K extends keyof FeaturesBlock>(key: K, value: FeaturesBlock[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(data);
    setHasChanges(false);
  };

  const addFeature = () => {
    const newFeature: Feature = {
      id: generateId(),
      title: 'New Feature',
      description: 'Feature description',
    };
    updateField('features', [...data.features, newFeature]);
  };

  const updateFeature = (index: number, updates: Partial<Feature>) => {
    const features = [...data.features];
    features[index] = { ...features[index], ...updates };
    updateField('features', features);
  };

  const removeFeature = (index: number) => {
    const features = data.features.filter((_, i) => i !== index);
    updateField('features', features);
  };

  return (
    <div className="space-y-6">
      <TextInput
        label="Section Title"
        value={data.title || ''}
        onChange={(value) => updateField('title', value)}
        placeholder="Our Features"
      />

      <TextInput
        label="Section Subtitle"
        value={data.subtitle || ''}
        onChange={(value) => updateField('subtitle', value)}
        placeholder="What we offer"
      />

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
            Features ({data.features.length})
          </label>
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Feature
          </button>
        </div>

        {data.features.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
            <p className="text-sm text-slate-500">No features added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.features.map((feature, index) => (
              <div key={feature.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex items-start gap-3">
                  <GripVertical className="h-5 w-5 text-slate-400 mt-2 cursor-grab" />
                  <div className="flex-1 space-y-3">
                    <TextInput
                      label="Icon (emoji or icon name)"
                      value={feature.icon || ''}
                      onChange={(value) => updateFeature(index, { icon: value })}
                      placeholder="⭐"
                    />
                    <TextInput
                      label="Title"
                      value={feature.title}
                      onChange={(value) => updateFeature(index, { title: value })}
                      placeholder="Feature title"
                      required
                    />
                    <TextInput
                      label="Description"
                      value={feature.description}
                      onChange={(value) => updateFeature(index, { description: value })}
                      placeholder="Feature description"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
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

