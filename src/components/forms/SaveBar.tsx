import React from 'react';
import { Save, Loader2 } from 'lucide-react';

interface SaveBarProps {
  onSave: () => void;
  isSaving?: boolean;
  isAutoSaving?: boolean;
  hasChanges?: boolean;
  lastSaved?: Date | null;
}

export const SaveBar: React.FC<SaveBarProps> = ({
  onSave,
  isSaving = false,
  isAutoSaving = false,
  hasChanges = false,
  lastSaved,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isAutoSaving && (
              <div className="flex items-center text-sm text-gray-600">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Auto-saving...
              </div>
            )}
            {!isAutoSaving && lastSaved && (
              <p className="text-sm text-gray-600">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            )}
            {hasChanges && !isAutoSaving && (
              <span className="text-sm text-amber-600 font-medium">Unsaved changes</span>
            )}
          </div>

          <button
            onClick={onSave}
            disabled={isSaving || !hasChanges}
            className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

