import React, { useState, useEffect } from 'react';
import { useTenant } from '../../../hooks/useTenant';
import { useSectionContent, useSaveSectionContent } from '../../../hooks/useFirebaseQuery';
import { MenuContent, MenuItem } from '../../../utils/types';
import { getDefaultSectionContent } from '../../../services/contentService';
import { TextInput } from '../../../components/inputs/TextInput';
import { ImageUpload } from '../../../components/inputs/ImageUpload';
import { Switcher } from '../../../components/inputs/Switcher';
import { SaveBar } from '../../../components/forms/SaveBar';
import { LoadingSpinner } from '../../../components/layout/LoadingSpinner';
import { RepeaterField } from '../../../components/forms/RepeaterField';
import { generateId } from '../../../utils/formatters';
import { Plus, X } from 'lucide-react';

export const MenuEditor: React.FC = () => {
  const { tenant } = useTenant();
  const { data, isLoading } = useSectionContent<MenuContent>(tenant?.id, 'menu');
  const { mutate: save, isPending } = useSaveSectionContent(tenant?.id || '', 'menu');

  const [content, setContent] = useState<MenuContent>(
    getDefaultSectionContent('menu') as MenuContent
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

  const updateContent = (updates: Partial<MenuContent>) => {
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
    return <LoadingSpinner text="Loading menu content..." />;
  }

  if (!tenant) {
    return <div>Please select a tenant</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu</h1>
        <p className="text-gray-600">Manage your menu items and categories</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6 mb-6">
        <TextInput
          label="Menu Title"
          value={content.title}
          onChange={(value) => updateContent({ title: value })}
          placeholder="Our Menu"
          required
        />

        <TextInput
          label="Subtitle (Optional)"
          value={content.subtitle || ''}
          onChange={(value) => updateContent({ subtitle: value })}
          placeholder="Explore our offerings"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
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
          label="Menu Items"
          items={content.items}
          onChange={(items) => updateContent({ items })}
          createNewItem={() => ({
            id: generateId(),
            name: '',
            description: '',
            price: '',
            category: content.categories[0] || '',
            featured: false,
          })}
          addButtonText="Add Menu Item"
          emptyText="No menu items yet. Click 'Add Menu Item' to create one."
          renderItem={(item, index, updateItem) => (
            <div className="space-y-4">
              <TextInput
                label="Item Name"
                value={item.name}
                onChange={(value) => updateItem({ name: value })}
                placeholder="Item name"
              />

              <TextInput
                label="Description"
                value={item.description}
                onChange={(value) => updateItem({ description: value })}
                placeholder="Brief description"
              />

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Price"
                  value={item.price}
                  onChange={(value) => updateItem({ price: value })}
                  placeholder="$9.99"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={item.category}
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

              <ImageUpload
                label="Item Image (Optional)"
                value={item.image || ''}
                onChange={(value) => updateItem({ image: value })}
                tenantId={tenant.id}
                section="menu"
                aspectRatio="4/3"
              />

              <Switcher
                label="Featured Item"
                value={item.featured || false}
                onChange={(value) => updateItem({ featured: value })}
                description="Show this item prominently"
              />
            </div>
          )}
        />
      </div>

      <SaveBar onSave={handleSave} isSaving={isPending} hasChanges={hasChanges} />
    </div>
  );
};

