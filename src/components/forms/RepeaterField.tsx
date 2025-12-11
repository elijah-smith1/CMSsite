import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface RepeaterFieldProps<T> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, updateItem: (updates: Partial<T>) => void) => React.ReactNode;
  createNewItem: () => T;
  disabled?: boolean;
  addButtonText?: string;
  emptyText?: string;
}

export function RepeaterField<T extends { id: string }>({
  label,
  items,
  onChange,
  renderItem,
  createNewItem,
  disabled = false,
  addButtonText = 'Add Item',
  emptyText = 'No items yet. Click "Add Item" to create one.',
}: RepeaterFieldProps<T>) {
  const handleAdd = () => {
    onChange([...items, createNewItem()]);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, updates: Partial<T>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange(newItems);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled}
          className="inline-flex items-center px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Plus className="h-4 w-4 mr-1" />
          {addButtonText}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-sm">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-2 mr-3">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  {renderItem(item, index, (updates) => handleUpdate(index, updates))}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                  className="flex-shrink-0 ml-3 p-2 text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

