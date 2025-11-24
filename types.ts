export enum ProcessStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING', // Converting to base64
  ANALYZING = 'ANALYZING', // Sending to Gemini
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface TranscriptionResult {
  text: string;
  timestamp: number;
}

export interface FileData {
  name: string;
  type: string;
  size: number;
  base64: string;
}