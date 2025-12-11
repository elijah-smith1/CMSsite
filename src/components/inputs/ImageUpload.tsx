import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage, validateImageFile } from '../../services/mediaService';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  tenantId: string;
  section: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  tenantId,
  section,
  required = false,
  error,
  disabled = false,
  aspectRatio,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(tenantId, section, file);
      onChange(url);
      toast.success('Image uploaded successfully');
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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {value ? (
        <div className="relative border rounded-lg overflow-hidden bg-gray-50">
          <div
            className="relative w-full bg-gray-100 flex items-center justify-center"
            style={{ paddingTop: aspectRatio ? `calc(100% / (${aspectRatio}))` : '56.25%' }}
          >
            <img
              src={value}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="hidden"
            id={`file-upload-${section}`}
          />
          <label
            htmlFor={`file-upload-${section}`}
            className={`cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            <div className="flex flex-col items-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              ) : (
                <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
              )}
              <p className="text-sm text-gray-600 mb-1">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 5MB</p>
            </div>
          </label>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

