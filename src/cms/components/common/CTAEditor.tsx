import React from 'react';
import { CTA } from '../../../utils/types/sites';
import { Trash2 } from 'lucide-react';

interface CTAEditorProps {
  cta: CTA;
  onChange: (cta: CTA) => void;
  onRemove: () => void;
}

export const CTAEditor: React.FC<CTAEditorProps> = ({ cta, onChange, onRemove }) => {
  const updateField = <K extends keyof CTA>(key: K, value: CTA[K]) => {
    onChange({ ...cta, [key]: value });
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <div className="flex-1 grid grid-cols-3 gap-3">
        <input
          type="text"
          value={cta.text}
          onChange={(e) => updateField('text', e.target.value)}
          placeholder="Button text"
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <input
          type="text"
          value={cta.url}
          onChange={(e) => updateField('url', e.target.value)}
          placeholder="Link URL"
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <select
          value={cta.variant || 'primary'}
          onChange={(e) => updateField('variant', e.target.value as CTA['variant'])}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
        </select>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

