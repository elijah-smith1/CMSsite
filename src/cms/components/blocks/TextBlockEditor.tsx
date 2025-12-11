import React, { useState, useEffect } from 'react';
import { TextBlock } from '../../../utils/types/sites';
import { TextInput } from '../../../components/inputs/TextInput';
import { RichTextEditor } from '../../../components/inputs/RichTextEditor';
import { BlockSaveBar } from '../common/BlockSaveBar';

interface TextBlockEditorProps {
  block: TextBlock;
  siteId: string;
  pageId: string;
  blockIndex: number;
  onSave: (block: TextBlock) => void;
  isSaving?: boolean;
}

export const TextBlockEditor: React.FC<TextBlockEditorProps> = ({
  block,
  siteId,
  pageId,
  blockIndex,
  onSave,
  isSaving,
}) => {
  const [data, setData] = useState<TextBlock>(block);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setData(block);
    setHasChanges(false);
  }, [block]);

  const updateField = <K extends keyof TextBlock>(key: K, value: TextBlock[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(data);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <TextInput
        label="Section Title (Optional)"
        value={data.title || ''}
        onChange={(value) => updateField('title', value)}
        placeholder="Enter section title"
      />

      <RichTextEditor
        label="Content"
        value={data.content}
        onChange={(value) => updateField('content', value)}
        placeholder="Enter your text content..."
        minHeight="250px"
      />

      <BlockSaveBar
        onSave={handleSave}
        isSaving={isSaving}
        hasChanges={hasChanges}
      />
    </div>
  );
};

