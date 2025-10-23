
import React, { useRef } from 'react';
import type { ImageFile } from '../types';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  id: string;
  image: ImageFile | null;
  onImageChange: (id: string, image: ImageFile | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, image, onImageChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        const [header, base64Data] = base64String.split(',');
        if (base64Data) {
            onImageChange(id, { base64: base64Data, mimeType: file.type });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(id, null);
    if (inputRef.current) {
        inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  }

  return (
    <div 
      className="relative w-full h-48 sm:w-64 sm:h-64 bg-gray-900 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors duration-300 overflow-hidden"
      onClick={handleClick}
    >
      <input
        type="file"
        ref={inputRef}
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
        aria-label={`Upload image ${id.slice(-1)}`}
      />
      {image ? (
        <>
          <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Uploaded preview" className="w-full h-full object-cover" />
          <button 
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
            aria-label="Remove image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </>
      ) : (
        <div className="text-center text-gray-500">
          <UploadIcon />
          <p className="mt-2 text-sm">Click to upload</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
