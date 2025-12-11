import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadBlockImage, validateImageFile } from '../../../services/storageService';
import toast from 'react-hot-toast';

interface BlockImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  siteId: string;
  pageId: string;
  blockId: string;
  required?: boolean;
  aspectRatio?: string;
}

export const BlockImageUpload: React.FC<BlockImageUploadProps> = ({
  label,
  value,
  onChange,
  siteId,
  pageId,
  blockId,
  required = false,
  aspectRatio = '16/9',
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadBlockImage(siteId, pageId, blockId, file);
      onChange(url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {value ? (
        <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
          <div
            className="relative w-full bg-slate-100"
            style={{ paddingTop: `calc(100% / (${aspectRatio}))` }}
          >
            <img
              src={value}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary-400 transition cursor-pointer bg-slate-50">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id={`file-upload-${blockId}`}
          />
          <label
            htmlFor={`file-upload-${blockId}`}
            className="cursor-pointer"
          >
            <div className="flex flex-col items-center">
              {uploading ? (
                <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-2" />
              ) : (
                <ImageIcon className="h-10 w-10 text-slate-400 mb-2" />
              )}
              <p className="text-sm text-slate-600">
                {uploading ? 'Uploading...' : 'Click to upload'}
              </p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG, WebP up to 10MB</p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};

