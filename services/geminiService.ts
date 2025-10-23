
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageFile } from '../types';

if (!process.env.API_KEY) {
    // This is a check for development time. The environment is expected to have the API key.
    console.warn("API_KEY environment variable not set. App may not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const editImageWithGemini = async (images: ImageFile[], prompt: string): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  
  const imageParts = images.map(image => ({
    inlineData: {
      data: image.base64,
      mimeType: image.mimeType,
    },
  }));

  const textPart = { text: prompt };

  const parts = [...imageParts, textPart];

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    throw new Error("No image data was found in the Gemini API response.");

  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the image generation service.");
  }
};
