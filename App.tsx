
import React, { useState, useCallback } from 'react';
import type { ImageFile } from './types';
import ImageUploader from './components/ImageUploader';
import GeneratedImageViewer from './components/GeneratedImageViewer';
import { PlusIcon } from './components/icons';
import { editImageWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [image1, setImage1] = useState<ImageFile | null>(null);
  const [image2, setImage2] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleImageChange = useCallback((id: string, image: ImageFile | null) => {
    if (id === 'image1') {
      setImage1(image);
    } else {
      setImage2(image);
    }
  }, []);

  const handleGenerate = async () => {
    const imagesToProcess: ImageFile[] = [];
    if (image1) imagesToProcess.push(image1);
    if (image2) imagesToProcess.push(image2);

    if (imagesToProcess.length === 0) {
      setError('Please upload at least one image to edit.');
      return;
    }
    if (!prompt.trim()) {
      setError('Please enter a prompt to describe the edit.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const result = await editImageWithGemini(imagesToProcess, prompt);
      setGeneratedImage(result);
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Gemini Image Mixer
          </h1>
          <p className="text-gray-400 mt-2">
            Combine images and ideas. Edit with a prompt. Create something new.
          </p>
        </header>

        <main className="space-y-8">
          <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">1. Upload Your Images</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ImageUploader id="image1" image={image1} onImageChange={handleImageChange} />
              <div className="text-gray-500">
                <PlusIcon />
              </div>
              <ImageUploader id="image2" image={image2} onImageChange={handleImageChange} />
            </div>
             <p className="text-center text-sm text-gray-500 mt-4">Upload one image for editing, or two for combining.</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">2. Describe Your Vision</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Make the first image look like a watercolor painting' or 'Combine these two images in a surreal style'"
              className="w-full h-24 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none transition resize-none"
              rows={3}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="mt-4 w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : '✨ Generate Image'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          <div className="bg-gray-800/50 rounded-lg p-6 shadow-lg border border-gray-700">
             <h2 className="text-xl font-semibold mb-4 text-gray-300">3. Result</h2>
             <GeneratedImageViewer 
                isLoading={isLoading} 
                generatedImage={generatedImage} 
             />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
