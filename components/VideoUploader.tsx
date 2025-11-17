'use client';

import { useRef } from 'react';

interface VideoUploaderProps {
  onVideoUpload: (url: string) => void;
}

export default function VideoUploader({ onVideoUpload }: VideoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      onVideoUpload(url);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border-2 border-dashed border-gray-600 hover:border-green-500 transition-all shadow-2xl">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-green-500/20 p-6 rounded-full">
            <svg
              className="w-16 h-16 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Upload Bowling Video</h3>
          <p className="text-gray-400">
            Upload a cricket bowling video for advanced DRS-style analysis
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          📹 Choose Video File
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="text-sm text-gray-500">
          Supported formats: MP4, MOV, AVI, WebM
        </div>
      </div>
    </div>
  );
}
