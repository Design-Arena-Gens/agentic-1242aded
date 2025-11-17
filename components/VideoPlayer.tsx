'use client';

import { useEffect, RefObject } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  videoRef: RefObject<HTMLVideoElement>;
  onFrameChange: (frame: number) => void;
}

export default function VideoPlayer({ videoUrl, videoRef, onFrameChange }: VideoPlayerProps) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const fps = 30;
      const frame = Math.floor(video.currentTime * fps);
      onFrameChange(frame);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [videoRef, onFrameChange]);

  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 border-b border-gray-700">
        <h3 className="text-xl font-bold text-white">Bowling Video</h3>
      </div>
      <div className="p-4">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full rounded-lg shadow-lg"
          style={{ maxHeight: '400px' }}
        />
      </div>
    </div>
  );
}
