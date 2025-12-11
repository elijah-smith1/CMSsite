import React, { useState, useEffect } from 'react';
import { ScheduleBlock, Session } from '../../../utils/types/sites';
import { TextInput } from '../../../components/inputs/TextInput';
import { BlockSaveBar } from '../common/BlockSaveBar';
import { Plus, Trash2, X } from 'lucide-react';
import { generateId } from '../../../utils/formatters';

interface ScheduleBlockEditorProps {
  block: ScheduleBlock;
  siteId: string;
  pageId: string;
  blockIndex: number;
  onSave: (block: ScheduleBlock) => void;
  isSaving?: boolean;
}

export const ScheduleBlockEditor: React.FC<ScheduleBlockEditorProps> = ({
  block,
  siteId,
  pageId,
  blockIndex,
  onSave,
  isSaving,
}) => {
  const [data, setData] = useState<ScheduleBlock>({
    ...block,
    filters: block.filters ?? [],
    sessions: block.sessions ?? [],
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [newFilter, setNewFilter] = useState('');

  useEffect(() => {
    setData({
      ...block,
      filters: block.filters ?? [],
      sessions: block.sessions ?? [],
    });
    setHasChanges(false);
  }, [block]);

  const updateField = <K extends keyof ScheduleBlock>(key: K, value: ScheduleBlock[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(data);
    setHasChanges(false);
  };

  const addFilter = () => {
    if (newFilter.trim() && !(data.filters ?? []).includes(newFilter.trim())) {
      updateField('filters', [...(data.filters ?? []), newFilter.trim()]);
      setNewFilter('');
    }
  };

  const removeFilter = (filter: string) => {
    updateField('filters', (data.filters ?? []).filter((f) => f !== filter));
  };

  const addSession = () => {
    const newSession: Session = {
      id: generateId(),
      name: 'New Session',
      time: '9:00 AM',
    };
    updateField('sessions', [...(data.sessions ?? []), newSession]);
  };

  const updateSession = (index: number, updates: Partial<Session>) => {
    const sessions = [...(data.sessions ?? [])];
    sessions[index] = { ...sessions[index], ...updates };
    updateField('sessions', sessions);
  };

  const removeSession = (index: number) => {
    const sessions = (data.sessions ?? []).filter((_, i) => i !== index);
    updateField('sessions', sessions);
  };

  return (
    <div className="space-y-6">
      <TextInput
        label="Section Title"
        value={data.title || ''}
        onChange={(value) => updateField('title', value)}
        placeholder="Schedule"
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Filter Categories
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(data.filters || []).map((filter) => (
            <span
              key={filter}
              className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
            >
              {filter}
              <button
                type="button"
                onClick={() => removeFilter(filter)}
                className="ml-2 text-slate-400 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newFilter}
            onChange={(e) => setNewFilter(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addFilter()}
            placeholder="Add filter category"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
          />
          <button
            type="button"
            onClick={addFilter}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            Sessions ({data.sessions.length})
          </label>
          <button
            type="button"
            onClick={addSession}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Session
          </button>
        </div>

        {data.sessions.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
            <p className="text-sm text-slate-500">No sessions added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.sessions.map((session, index) => (
              <div key={session.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">Session {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeSession(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <TextInput
                    label="Name"
                    value={session.name}
                    onChange={(value) => updateSession(index, { name: value })}
                    required
                  />
                  <TextInput
                    label="Time"
                    value={session.time}
                    onChange={(value) => updateSession(index, { time: value })}
                    placeholder="9:00 AM"
                    required
                  />
                  <TextInput
                    label="Day"
                    value={session.day || ''}
                    onChange={(value) => updateSession(index, { day: value })}
                    placeholder="Monday"
                  />
                  <TextInput
                    label="Category"
                    value={session.category || ''}
                    onChange={(value) => updateSession(index, { category: value })}
                    placeholder="Filter category"
                  />
                  <TextInput
                    label="Instructor"
                    value={session.instructor || ''}
                    onChange={(value) => updateSession(index, { instructor: value })}
                  />
                  <TextInput
                    label="Location"
                    value={session.location || ''}
                    onChange={(value) => updateSession(index, { location: value })}
                  />
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

