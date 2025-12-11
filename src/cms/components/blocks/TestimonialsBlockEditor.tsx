import React, { useState, useEffect } from 'react';
import { TestimonialsBlock, Testimonial } from '../../../utils/types/sites';
import { TextInput } from '../../../components/inputs/TextInput';
import { BlockImageUpload } from '../common/BlockImageUpload';
import { BlockSaveBar } from '../common/BlockSaveBar';
import { Plus, Trash2, Quote } from 'lucide-react';
import { generateId } from '../../../utils/formatters';

interface TestimonialsBlockEditorProps {
  block: TestimonialsBlock;
  siteId: string;
  pageId: string;
  blockIndex: number;
  onSave: (block: TestimonialsBlock) => void;
  isSaving?: boolean;
}

export const TestimonialsBlockEditor: React.FC<TestimonialsBlockEditorProps> = ({
  block,
  siteId,
  pageId,
  blockIndex,
  onSave,
  isSaving,
}) => {
  const [data, setData] = useState<TestimonialsBlock>({
    ...block,
    testimonials: block.testimonials ?? [],
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setData({
      ...block,
      testimonials: block.testimonials ?? [],
    });
    setHasChanges(false);
  }, [block]);

  const updateField = <K extends keyof TestimonialsBlock>(key: K, value: TestimonialsBlock[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(data);
    setHasChanges(false);
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: generateId(),
      quote: 'Add testimonial quote here',
      author: 'Customer Name',
    };
    updateField('testimonials', [...(data.testimonials ?? []), newTestimonial]);
  };

  const updateTestimonial = (index: number, updates: Partial<Testimonial>) => {
    const testimonials = [...(data.testimonials ?? [])];
    testimonials[index] = { ...testimonials[index], ...updates };
    updateField('testimonials', testimonials);
  };

  const removeTestimonial = (index: number) => {
    const testimonials = (data.testimonials ?? []).filter((_, i) => i !== index);
    updateField('testimonials', testimonials);
  };

  return (
    <div className="space-y-6">
      <TextInput
        label="Section Title"
        value={data.title || ''}
        onChange={(value) => updateField('title', value)}
        placeholder="What People Say"
      />

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            Testimonials ({data.testimonials.length})
          </label>
          <button
            type="button"
            onClick={addTestimonial}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Testimonial
          </button>
        </div>

        {data.testimonials.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
            <Quote className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No testimonials added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex items-start justify-between mb-3">
                  <Quote className="h-5 w-5 text-primary-400" />
                  <button
                    type="button"
                    onClick={() => removeTestimonial(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quote</label>
                    <textarea
                      value={testimonial.quote}
                      onChange={(e) => updateTestimonial(index, { quote: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter testimonial quote"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      label="Author Name"
                      value={testimonial.author}
                      onChange={(value) => updateTestimonial(index, { author: value })}
                      required
                    />
                    <TextInput
                      label="Role/Title"
                      value={testimonial.role || ''}
                      onChange={(value) => updateTestimonial(index, { role: value })}
                      placeholder="CEO, Company"
                    />
                  </div>
                  
                  <BlockImageUpload
                    label="Author Photo (Optional)"
                    value={testimonial.image || ''}
                    onChange={(url) => updateTestimonial(index, { image: url })}
                    siteId={siteId}
                    pageId={pageId}
                    blockId={`${data.id}-${testimonial.id}`}
                    aspectRatio="1/1"
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

