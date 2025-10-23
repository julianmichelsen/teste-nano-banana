
import React from 'react';
import { LoadingIcon } from './icons';

interface GeneratedImageViewerProps {
  isLoading: boolean;
  generatedImage: string | null;
}

const GeneratedImageViewer: React.FC<GeneratedImageViewerProps> = ({ isLoading, generatedImage }) => {
  return (
    <div className="w-full min-h-[30rem] bg-gray-900 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center p-4">
      {isLoading ? (
        <div className="text-center text-gray-400">
          <LoadingIcon />
          <p className="mt-4 text-lg">Gemini is creating your image...</p>
          <p className="text-sm text-gray-500">This might take a moment.</p>
        </div>
      ) : generatedImage ? (
        <img src={generatedImage} alt="Generated result" className="max-w-full max-h-[40rem] rounded-md object-contain" />
      ) : (
        <div className="text-center text-gray-500">
          <p>Your generated image will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default GeneratedImageViewer;
