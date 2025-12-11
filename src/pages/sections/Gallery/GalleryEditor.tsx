import React, { useState, useEffect } from 'react';
import { useTenant } from '../../../hooks/useTenant';
import { useSectionContent, useSaveSectionContent } from '../../../hooks/useFirebaseQuery';
import { GalleryContent, GalleryImage } from '../../../utils/types';
import { getDefaultSectionContent } from '../../../services/contentService';
import { TextInput } from '../../../components/inputs/TextInput';
import { ImageUpload } from '../../../components/inputs/ImageUpload';
import { SaveBar } from '../../../components/forms/SaveBar';
import { LoadingSpinner } from '../../../components/layout/LoadingSpinner';
import { RepeaterField } from '../../../components/forms/RepeaterField';
import { generateId } from '../../../utils/formatters';
import { Plus, X } from 'lucide-react';

export const GalleryEditor: React.FC = () => {
  const { tenant } = useTenant();
  const { data, isLoading } = useSectionContent<GalleryContent>(tenant?.id, 'gallery');
  const { mutate: save, isPending } = useSaveSectionContent(tenant?.id || '', 'gallery');

  const [content, setContent] = useState<GalleryContent>(
    getDefaultSectionContent('gallery') as GalleryContent
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (data) {
      setContent(data);
    }
  }, [data]);

  const handleSave = () => {
    save(content);
    setHasChanges(false);
  };

  const updateContent = (updates: Partial<GalleryContent>) => {
    setContent((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const addCategory = () => {
    if (newCategory.trim() && !content.categories.includes(newCategory.trim())) {
      updateContent({ categories: [...content.categories, newCategory.trim()] });
      setNewCategory('');
    }
  };

  const removeCategory = (index: number) => {
    updateContent({
      categories: content.categories.filter((_, i) => i !== index),
    });
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading gallery content..." />;
  }

  if (!tenant) {
    return <div>Please select a tenant</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery</h1>
        <p className="text-gray-600">Manage your photo gallery and categories</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6 mb-6">
        <TextInput
          label="Gallery Title"
          value={content.title}
          onChange={(value) => updateContent({ title: value })}
          placeholder="Photo Gallery"
          required
        />

        <TextInput
          label="Subtitle (Optional)"
          value={content.subtitle || ''}
          onChange={(value) => updateContent({ subtitle: value })}
          placeholder="Explore our visual collection"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gallery Categories
          </label>
          <div className="space-y-2 mb-3">
            {content.categories.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => {
                    const newCategories = [...content.categories];
                    newCategories[index] = e.target.value;
                    updateContent({ categories: newCategories });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  disabled={content.categories.length === 1}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              placeholder="Add a category..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addCategory}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <RepeaterField
          label="Gallery Images"
          items={content.images}
          onChange={(images) => updateContent({ images })}
          createNewItem={() => ({
            id: generateId(),
            url: '',
            category: content.categories[0] || 'All',
          })}
          addButtonText="Add Image"
          emptyText="No images yet. Click 'Add Image' to upload one."
          renderItem={(image, index, updateItem) => (
            <div className="space-y-4">
              <ImageUpload
                label="Image"
                value={image.url}
                onChange={(value) => updateItem({ url: value })}
                tenantId={tenant.id}
                section="gallery"
                aspectRatio="4/3"
              />

              <TextInput
                label="Caption (Optional)"
                value={image.caption || ''}
                onChange={(value) => updateItem({ caption: value })}
                placeholder="Image caption"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={image.category || content.categories[0]}
                  onChange={(e) => updateItem({ category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {content.categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        />
      </div>

      <SaveBar onSave={handleSave} isSaving={isPending} hasChanges={hasChanges} />
    </div>
  );
};

