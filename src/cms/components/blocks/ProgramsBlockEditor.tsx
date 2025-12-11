import React, { useState, useEffect } from 'react';
import { ProgramsBlock, Program, CTA } from '../../../utils/types/sites';
import { TextInput } from '../../../components/inputs/TextInput';
import { RichTextEditor } from '../../../components/inputs/RichTextEditor';
import { BlockImageUpload } from '../common/BlockImageUpload';
import { CTAEditor } from '../common/CTAEditor';
import { BlockSaveBar } from '../common/BlockSaveBar';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { generateId } from '../../../utils/formatters';

interface ProgramsBlockEditorProps {
  block: ProgramsBlock;
  siteId: string;
  pageId: string;
  blockIndex: number;
  onSave: (block: ProgramsBlock) => void;
  isSaving?: boolean;
}

export const ProgramsBlockEditor: React.FC<ProgramsBlockEditorProps> = ({
  block,
  siteId,
  pageId,
  blockIndex,
  onSave,
  isSaving,
}) => {
  const [data, setData] = useState<ProgramsBlock>(block);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set());

  useEffect(() => {
    setData(block);
    setHasChanges(false);
  }, [block]);

  const updateField = <K extends keyof ProgramsBlock>(key: K, value: ProgramsBlock[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(data);
    setHasChanges(false);
  };

  const toggleProgram = (id: string) => {
    const expanded = new Set(expandedPrograms);
    if (expanded.has(id)) {
      expanded.delete(id);
    } else {
      expanded.add(id);
    }
    setExpandedPrograms(expanded);
  };

  const addProgram = () => {
    const newProgram: Program = {
      id: generateId(),
      name: 'New Program',
      description: 'Program description',
    };
    updateField('programs', [...data.programs, newProgram]);
    setExpandedPrograms(new Set([...expandedPrograms, newProgram.id]));
  };

  const updateProgram = (index: number, updates: Partial<Program>) => {
    const programs = [...data.programs];
    programs[index] = { ...programs[index], ...updates };
    updateField('programs', programs);
  };

  const removeProgram = (index: number) => {
    if (!confirm('Remove this program?')) return;
    const programs = data.programs.filter((_, i) => i !== index);
    updateField('programs', programs);
  };

  return (
    <div className="space-y-6">
      <TextInput
        label="Section Title"
        value={data.title || ''}
        onChange={(value) => updateField('title', value)}
        placeholder="Our Programs"
      />

      <TextInput
        label="Section Subtitle"
        value={data.subtitle || ''}
        onChange={(value) => updateField('subtitle', value)}
        placeholder="What we offer"
      />

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            Programs ({data.programs.length})
          </label>
          <button
            type="button"
            onClick={addProgram}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Program
          </button>
        </div>

        {data.programs.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
            <p className="text-sm text-slate-500">No programs added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.programs.map((program, index) => {
              const isExpanded = expandedPrograms.has(program.id);
              return (
                <div key={program.id} className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
                    onClick={() => toggleProgram(program.id)}
                  >
                    <span className="font-medium text-slate-900">{program.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeProgram(index);
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-4 pt-0 space-y-4 border-t border-slate-100">
                      <TextInput
                        label="Program Name"
                        value={program.name}
                        onChange={(value) => updateProgram(index, { name: value })}
                        required
                      />
                      
                      <RichTextEditor
                        label="Description"
                        value={program.description}
                        onChange={(value) => updateProgram(index, { description: value })}
                        minHeight="100px"
                      />
                      
                      <BlockImageUpload
                        label="Image"
                        value={program.image || ''}
                        onChange={(url) => updateProgram(index, { image: url })}
                        siteId={siteId}
                        pageId={pageId}
                        blockId={`${data.id}-${program.id}`}
                        aspectRatio="16/9"
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <TextInput
                          label="Age Group"
                          value={program.age || ''}
                          onChange={(value) => updateProgram(index, { age: value })}
                          placeholder="e.g., Ages 5-12"
                        />
                        <TextInput
                          label="Schedule"
                          value={program.schedule || ''}
                          onChange={(value) => updateProgram(index, { schedule: value })}
                          placeholder="e.g., Mon-Fri 9am"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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

