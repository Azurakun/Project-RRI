import React, { useState, useRef } from 'react';
import { UploadIcon, XIcon, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  maxSize?: number;
  acceptedTypes?: string[];
  placeholder?: string;
  className?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  onError,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  placeholder = 'Upload an image',
  className = ''
}: ImageUploadProps): JSX.Element => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please upload: ${acceptedTypes.join(', ')}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `File size too large. Maximum size: ${maxSize}MB`;
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onError?.(validationError);
      return;
    }

    setUploading(true);
    
    try {
      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('File converted to base64, length:', result.length);
        
        // Validate base64 result
        if (!result || !result.startsWith('data:image/')) {
          onError?.('Failed to process image file');
          setUploading(false);
          return;
        }
        
        onChange(result);
        setUploading(false);
        console.log('Image upload successful');
      };
      reader.onerror = () => {
        console.error('FileReader error');
        onError?.('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File upload error:', error);
      onError?.('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Image Upload
      </label>
      
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-[#0375e5] bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-[#0375e5] border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">{placeholder}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-[#0375e5] text-white rounded-md hover:bg-[#0f4c81] transition-colors"
              >
                <UploadIcon className="w-4 h-4" />
                Choose File
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Or drag and drop your image here
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max size: {maxSize}MB • Formats: JPG, PNG, GIF
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};