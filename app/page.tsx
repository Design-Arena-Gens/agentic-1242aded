'use client';

import { useState, useRef } from 'react';
import VideoUploader from '@/components/VideoUploader';
import VideoPlayer from '@/components/VideoPlayer';
import HawkEyeVisualization from '@/components/HawkEyeVisualization';
import AnalysisPanel from '@/components/AnalysisPanel';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoUpload = (url: string) => {
    setVideoUrl(url);
    setAnalysisData(null);
    setCurrentFrame(0);
  };

  const handleAnalyze = async () => {
    if (!videoRef.current) return;

    setIsAnalyzing(true);

    // Simulate video analysis with realistic cricket bowling trajectory
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate realistic bowling analysis data
    const frames = 60;
    const trajectory: Array<{x: number, y: number, z: number}> = [];
    const pitchLength = 20.12; // meters

    // Simulate bowling trajectory from bowler to batsman
    for (let i = 0; i < frames; i++) {
      const t = i / frames;

      // Initial release point (bowler's hand)
      const startX = -10;
      const startY = 2.5; // Release height
      const startZ = 0;

      // End point (batsman/stumps)
      const endX = 10;
      const endY = 0.7; // Stump height
      const endZ = 0;

      // Calculate position with realistic curve
      const x = startX + (endX - startX) * t;

      // Parabolic trajectory with bounce
      let y;
      const bouncePoint = 0.6; // Ball bounces 60% through

      if (t < bouncePoint) {
        // Before bounce - descending parabola
        const localT = t / bouncePoint;
        y = startY + (0.3 - startY) * localT * localT; // Lands at 0.3m
      } else {
        // After bounce - ascending then to stump
        const localT = (t - bouncePoint) / (1 - bouncePoint);
        const bounceHeight = 0.3;
        const peak = 1.2;
        y = bounceHeight + (peak - bounceHeight) * Math.sin(localT * Math.PI * 0.6) - localT * (peak - endY);
      }

      // Slight lateral movement (swing/spin)
      const z = Math.sin(t * Math.PI) * 0.5 - t * 0.3; // Curves inward

      trajectory.push({ x, y, z });
    }

    setAnalysisData({
      trajectory,
      metrics: {
        speed: (130 + Math.random() * 20).toFixed(1), // km/h
        releaseAngle: (12 + Math.random() * 3).toFixed(1),
        pitchPoint: (pitchLength * (0.5 + Math.random() * 0.2)).toFixed(2),
        swing: (0.3 + Math.random() * 0.5).toFixed(1),
        spin: (Math.random() * 500 + 300).toFixed(0),
        seam: (15 + Math.random() * 10).toFixed(1),
        impactPoint: {
          x: (10 + (Math.random() - 0.5) * 0.2).toFixed(2),
          y: (0.7 + (Math.random() - 0.5) * 0.3).toFixed(2),
          z: ((Math.random() - 0.5) * 0.2).toFixed(2)
        },
        prediction: Math.random() > 0.5 ? 'Hitting Stumps' : 'Missing Leg',
        lineLength: pitchLength.toFixed(2)
      }
    });

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Cricket Hawk-Eye Analyzer
          </h1>
          <p className="text-gray-400 text-lg">
            Professional bowling analysis with DRS-style trajectory visualization
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Panel: Video Upload and Player */}
          <div className="space-y-6">
            {!videoUrl ? (
              <VideoUploader onVideoUpload={handleVideoUpload} />
            ) : (
              <div className="space-y-4">
                <VideoPlayer
                  videoUrl={videoUrl}
                  videoRef={videoRef}
                  onFrameChange={setCurrentFrame}
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      '🎯 Analyze Bowling'
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setVideoUrl(null);
                      setAnalysisData(null);
                    }}
                    className="px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
                  >
                    New Video
                  </button>
                </div>
              </div>
            )}

            {analysisData && (
              <AnalysisPanel metrics={analysisData.metrics} />
            )}
          </div>

          {/* Right Panel: Hawk-Eye Visualization */}
          <div>
            <HawkEyeVisualization
              trajectory={analysisData?.trajectory}
              currentFrame={currentFrame}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm mt-12 pb-8">
          <p>Professional cricket bowling analysis • DRS Hawk-Eye visualization • Ball tracking technology</p>
        </footer>
      </div>
    </div>
  );
}
