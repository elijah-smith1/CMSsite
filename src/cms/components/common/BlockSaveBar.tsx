import React from 'react';
import { Save, Loader2 } from 'lucide-react';

interface BlockSaveBarProps {
  onSave: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}

export const BlockSaveBar: React.FC<BlockSaveBarProps> = ({
  onSave,
  isSaving = false,
  hasChanges = false,
}) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
      <div className="text-sm">
        {hasChanges ? (
          <span className="text-amber-600 font-medium">Unsaved changes</span>
        ) : (
          <span className="text-slate-500">No changes</span>
        )}
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving || !hasChanges}
        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Block
          </>
        )}
      </button>
    </div>
  );
};

