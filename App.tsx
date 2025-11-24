import React, { useState } from 'react';
import { FileDropzone } from './components/FileDropzone';
import { TranscriptViewer } from './components/TranscriptViewer';
import { generateVideoTranscript } from './services/geminiService';
import { FileData, ProcessStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<ProcessStatus>(ProcessStatus.IDLE);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelected = async (file: FileData) => {
    setFileData(file);
    setStatus(ProcessStatus.ANALYZING);
    setErrorMessage(null);
    setTranscript(null);

    try {
      // Call the Gemini service
      const result = await generateVideoTranscript(file.base64, file.type);
      setTranscript(result);
      setStatus(ProcessStatus.COMPLETE);
    } catch (error) {
      console.error("Failed to generate transcript:", error);
      setStatus(ProcessStatus.ERROR);
      setErrorMessage("An error occurred while analyzing the video. Please try again or check your internet connection.");
    }
  };

  const resetApp = () => {
    setStatus(ProcessStatus.IDLE);
    setTranscript(null);
    setFileData(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">VideoScribe <span className="text-indigo-600">AI</span></h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">
             Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Intro Section */}
          {status === ProcessStatus.IDLE && (
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Video to Text in Seconds
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Upload a short video clip and let our AI generate a precise transcript with timestamps. 
                Perfect for meeting notes, quick captions, or extracting key information.
              </p>
            </div>
          )}

          {/* Upload Section */}
          {(status === ProcessStatus.IDLE || status === ProcessStatus.ERROR) && (
             <FileDropzone onFileSelected={handleFileSelected} disabled={false} />
          )}

          {/* Loading State */}
          {status === ProcessStatus.ANALYZING && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-indigo-600 animate-pulse">
                    <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Video Content</h3>
              <p className="text-slate-500 animate-pulse">Generating transcript...</p>
              {fileData && (
                <p className="text-xs text-slate-400 mt-4 px-3 py-1 bg-slate-100 rounded-full">
                  Processing: {fileData.name}
                </p>
              )}
            </div>
          )}

          {/* Results Section */}
          {status === ProcessStatus.COMPLETE && transcript && fileData && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <button 
                  onClick={resetApp}
                  className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                  </svg>
                  Upload Another
                </button>
              </div>
              
              <TranscriptViewer transcript={transcript} videoName={fileData.name} />
            </div>
          )}

          {/* Error Message */}
          {status === ProcessStatus.ERROR && errorMessage && (
            <div className="mt-8 max-w-md mx-auto text-center">
               <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Processing Failed</h3>
              <p className="text-slate-600 mb-6">{errorMessage}</p>
              <button 
                onClick={resetApp}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
          )}

        </div>
      </main>

      <footer className="py-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} VideoScribe AI. Private & Secure. Video data is processed in memory.
        </div>
      </footer>
    </div>
  );
};

export default App;