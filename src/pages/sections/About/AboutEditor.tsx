import React, { useState, useEffect } from 'react';
import { useTenant } from '../../../hooks/useTenant';
import { useSectionContent, useSaveSectionContent } from '../../../hooks/useFirebaseQuery';
import { AboutContent } from '../../../utils/types';
import { getDefaultSectionContent } from '../../../services/contentService';
import { TextInput } from '../../../components/inputs/TextInput';
import { ImageUpload } from '../../../components/inputs/ImageUpload';
import { RichTextEditor } from '../../../components/inputs/RichTextEditor';
import { SaveBar } from '../../../components/forms/SaveBar';
import { LoadingSpinner } from '../../../components/layout/LoadingSpinner';
import { Plus, X } from 'lucide-react';

export const AboutEditor: React.FC = () => {
  const { tenant } = useTenant();
  const { data, isLoading } = useSectionContent<AboutContent>(tenant?.id, 'about');
  const { mutate: save, isPending } = useSaveSectionContent(tenant?.id || '', 'about');

  const [content, setContent] = useState<AboutContent>(
    getDefaultSectionContent('about') as AboutContent
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    if (data) {
      setContent(data);
    }
  }, [data]);

  const handleSave = () => {
    save(content);
    setHasChanges(false);
  };

  const updateContent = (updates: Partial<AboutContent>) => {
    setContent((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const addValue = () => {
    if (newValue.trim()) {
      updateContent({ values: [...(content.values || []), newValue.trim()] });
      setNewValue('');
    }
  };

  const removeValue = (index: number) => {
    updateContent({
      values: content.values?.filter((_, i) => i !== index) || [],
    });
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading about content..." />;
  }

  if (!tenant) {
    return <div>Please select a tenant</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">About Page</h1>
        <p className="text-gray-600">Tell your story and share your mission</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <TextInput
          label="Title"
          value={content.title}
          onChange={(value) => updateContent({ title: value })}
          placeholder="About Us"
          required
        />

        <TextInput
          label="Subtitle"
          value={content.subtitle}
          onChange={(value) => updateContent({ subtitle: value })}
          placeholder="Learn more about our story"
          required
        />

        <ImageUpload
          label="Main Image"
          value={content.mainImage}
          onChange={(value) => updateContent({ mainImage: value })}
          tenantId={tenant.id}
          section="about"
          required
          aspectRatio="16/9"
        />

        <RichTextEditor
          label="Our Story"
          value={content.story}
          onChange={(value) => updateContent({ story: value })}
          placeholder="Tell your story here..."
          required
          minHeight="250px"
        />

        <RichTextEditor
          label="Mission (Optional)"
          value={content.mission || ''}
          onChange={(value) => updateContent({ mission: value })}
          placeholder="Our mission..."
          minHeight="150px"
        />

        <RichTextEditor
          label="Vision (Optional)"
          value={content.vision || ''}
          onChange={(value) => updateContent({ vision: value })}
          placeholder="Our vision..."
          minHeight="150px"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Core Values (Optional)
          </label>
          <div className="space-y-2 mb-3">
            {content.values?.map((value, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const newValues = [...(content.values || [])];
                    newValues[index] = e.target.value;
                    updateContent({ values: newValues });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeValue(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addValue()}
              placeholder="Add a value..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addValue}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <SaveBar onSave={handleSave} isSaving={isPending} hasChanges={hasChanges} />
    </div>
  );
};

