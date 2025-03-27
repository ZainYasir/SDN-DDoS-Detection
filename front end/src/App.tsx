import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import type { UploadState } from './types';

function App() {
  const [uploadState, setUploadState] = useState<UploadState>({ status: 'idle' });

  return (
    <div className="min-h-screen bg-[#e6e9f0] p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl neumorphic rounded-3xl overflow-hidden">
        {/* Window Controls */}
        <div className="bg-[#2A2F35] window-controls">
          <div className="window-control window-close"></div>
          <div className="window-control window-minimize"></div>
          <div className="window-control window-maximize"></div>
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#2A2F35] mb-2 tracking-tight">
              SDN DDOS Detection
            </h1>
            <p className="text-lg text-gray-600">
              Network traffic logs
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <FileUpload onUploadComplete={setUploadState} />
          </div>

          {/* Results Section */}
          {uploadState.status === 'success' && uploadState.data && (
            <ResultsDisplay data={uploadState.data} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;