import React, { useState, useEffect } from 'react';
import { useTenant } from '../../../hooks/useTenant';
import { useSectionContent, useSaveSectionContent } from '../../../hooks/useFirebaseQuery';
import { HomeContent } from '../../../utils/types';
import { getDefaultSectionContent } from '../../../services/contentService';
import { TextInput } from '../../../components/inputs/TextInput';
import { ImageUpload } from '../../../components/inputs/ImageUpload';
import { RichTextEditor } from '../../../components/inputs/RichTextEditor';
import { SaveBar } from '../../../components/forms/SaveBar';
import { LoadingSpinner } from '../../../components/layout/LoadingSpinner';
import { RepeaterField } from '../../../components/forms/RepeaterField';
import { generateId } from '../../../utils/formatters';
import { CheckerboardBlock } from '../../../utils/types';

export const HomeEditor: React.FC = () => {
  const { tenant } = useTenant();
  const { data, isLoading } = useSectionContent<HomeContent>(tenant?.id, 'home');
  const { mutate: save, isPending } = useSaveSectionContent(tenant?.id || '', 'home');

  const [content, setContent] = useState<HomeContent>(
    getDefaultSectionContent('home') as HomeContent
  );
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setContent(data);
    }
  }, [data]);

  const handleSave = () => {
    save(content);
    setHasChanges(false);
  };

  const updateContent = (updates: Partial<HomeContent>) => {
    setContent((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading home content..." />;
  }

  if (!tenant) {
    return <div>Please select a tenant</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Page</h1>
        <p className="text-gray-600">Edit your homepage hero section and content blocks</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
          
          <TextInput
            label="Hero Title"
            value={content.heroTitle}
            onChange={(value) => updateContent({ heroTitle: value })}
            placeholder="Welcome to our website"
            required
          />

          <TextInput
            label="Hero Subtitle"
            value={content.heroSubtitle}
            onChange={(value) => updateContent({ heroSubtitle: value })}
            placeholder="Discover what we have to offer"
            required
          />

          <ImageUpload
            label="Hero Background Image"
            value={content.heroImage}
            onChange={(value) => updateContent({ heroImage: value })}
            tenantId={tenant.id}
            section="home"
            required
            aspectRatio="16/9"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Content Blocks</h2>
          <RepeaterField
            label="Checkerboard Blocks"
            items={content.blocks.filter((b) => b.type === 'checkerboard') as CheckerboardBlock[]}
            onChange={(blocks) => updateContent({ blocks })}
            createNewItem={() => ({
              id: generateId(),
              type: 'checkerboard' as const,
              title: '',
              body: '',
              image: 'https://via.placeholder.com/600x400',
              position: 'left' as const,
            })}
            addButtonText="Add Block"
            emptyText="No content blocks yet. Add one to get started."
            renderItem={(block, index, updateItem) => (
              <div className="space-y-4">
                <TextInput
                  label="Block Title"
                  value={block.title}
                  onChange={(value) => updateItem({ title: value })}
                  placeholder="Enter block title"
                />

                <RichTextEditor
                  label="Block Content"
                  value={block.body}
                  onChange={(value) => updateItem({ body: value })}
                  placeholder="Enter block content"
                  minHeight="150px"
                />

                <ImageUpload
                  label="Block Image"
                  value={block.image}
                  onChange={(value) => updateItem({ image: value })}
                  tenantId={tenant.id}
                  section="home"
                  aspectRatio="4/3"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Position
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => updateItem({ position: 'left' })}
                      className={`px-4 py-2 rounded-lg border transition ${
                        block.position === 'left'
                          ? 'bg-primary-100 border-primary-500 text-primary-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Left
                    </button>
                    <button
                      type="button"
                      onClick={() => updateItem({ position: 'right' })}
                      className={`px-4 py-2 rounded-lg border transition ${
                        block.position === 'right'
                          ? 'bg-primary-100 border-primary-500 text-primary-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Right
                    </button>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </div>

      <SaveBar onSave={handleSave} isSaving={isPending} hasChanges={hasChanges} />
    </div>
  );
};

