import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

/**
 * Generates a transcript from a video file using Gemini 2.5 Flash.
 * @param base64Data The base64 encoded string of the video file (without the data URL prefix).
 * @param mimeType The mime type of the video (e.g., 'video/mp4').
 * @returns The generated transcript text.
 */
export const generateVideoTranscript = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    // Clean the base64 string if it contains the data URL prefix
    const cleanBase64 = base64Data.includes('base64,') 
      ? base64Data.split('base64,')[1] 
      : base64Data;

    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          },
          {
            text: "Please provide a comprehensive transcript of the audio in this video. Format the output clearly with timestamps (e.g., [MM:SS]) at the beginning of each new speaker's turn or significant segment. If there are multiple speakers, try to identify them as Speaker 1, Speaker 2, etc."
          }
        ]
      },
      config: {
        temperature: 0.2, // Lower temperature for more accurate transcription
        maxOutputTokens: 8192, // Allow long transcripts
      }
    });

    if (!response.text) {
      throw new Error("No transcript generated.");
    }

    return response.text;

  } catch (error) {
    console.error("Error in generateVideoTranscript:", error);
    throw error;
  }
};