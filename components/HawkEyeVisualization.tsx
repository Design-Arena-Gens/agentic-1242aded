'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Line, Sphere, Box, Text } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface HawkEyeVisualizationProps {
  trajectory: Array<{x: number, y: number, z: number}> | null;
  currentFrame: number;
  isAnalyzing: boolean;
}

function CricketPitch() {
  const pitchLength = 20.12;
  const pitchWidth = 3.05;

  return (
    <group>
      {/* Pitch surface */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[pitchLength + 5, pitchWidth + 2]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>

      {/* Pitch rectangle (lighter) */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[pitchLength, pitchWidth]} />
        <meshStandardMaterial color="#4a7c2a" />
      </mesh>

      {/* Crease lines */}
      <Line
        points={[[-10, 0.03, -1.5], [-10, 0.03, 1.5]]}
        color="white"
        lineWidth={3}
      />
      <Line
        points={[[10, 0.03, -1.5], [10, 0.03, 1.5]]}
        color="white"
        lineWidth={3}
      />

      {/* Stumps at both ends */}
      {[-10, 10].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <Box args={[0.05, 0.71, 0.05]} position={[-0.12, 0.355, 0]}>
            <meshStandardMaterial color="#f4e4c1" />
          </Box>
          <Box args={[0.05, 0.71, 0.05]} position={[0, 0.355, 0]}>
            <meshStandardMaterial color="#f4e4c1" />
          </Box>
          <Box args={[0.05, 0.71, 0.05]} position={[0.12, 0.355, 0]}>
            <meshStandardMaterial color="#f4e4c1" />
          </Box>
          {/* Bails */}
          <Box args={[0.3, 0.03, 0.03]} position={[0, 0.73, 0]}>
            <meshStandardMaterial color="#f4e4c1" />
          </Box>
        </group>
      ))}
    </group>
  );
}

function BallTrajectory({ trajectory, currentFrame }: { trajectory: Array<{x: number, y: number, z: number}>, currentFrame: number }) {
  const points = useMemo(() => {
    return trajectory.map(p => new THREE.Vector3(p.x, p.y, p.z));
  }, [trajectory]);

  const currentPosition = trajectory[Math.min(currentFrame, trajectory.length - 1)];

  return (
    <group>
      {/* Full trajectory line */}
      <Line
        points={points}
        color="#ff0000"
        lineWidth={3}
        dashed={false}
      />

      {/* Ball at current position */}
      <Sphere args={[0.15, 32, 32]} position={[currentPosition.x, currentPosition.y, currentPosition.z]}>
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </Sphere>

      {/* Shadow projection on ground */}
      <Sphere args={[0.1, 16, 16]} position={[currentPosition.x, 0.05, currentPosition.z]}>
        <meshStandardMaterial color="#000000" opacity={0.3} transparent />
      </Sphere>

      {/* Trajectory point markers */}
      {trajectory.map((point, i) => {
        if (i % 5 === 0) {
          return (
            <Sphere key={i} args={[0.05, 16, 16]} position={[point.x, point.y, point.z]}>
              <meshStandardMaterial color="#ffaa00" opacity={0.6} transparent />
            </Sphere>
          );
        }
        return null;
      })}
    </group>
  );
}

export default function HawkEyeVisualization({ trajectory, currentFrame, isAnalyzing }: HawkEyeVisualizationProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 h-[600px]">
      <div className="bg-gradient-to-r from-green-900 to-emerald-900 px-6 py-4 border-b border-gray-700">
        <h3 className="text-xl font-bold text-white">🎯 DRS Hawk-Eye View</h3>
      </div>

      <div className="relative h-[540px] bg-gray-950">
        {isAnalyzing ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
              <p className="text-gray-400 text-lg">Analyzing ball trajectory...</p>
            </div>
          </div>
        ) : !trajectory ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <div className="text-6xl">🏏</div>
              <p className="text-gray-400 text-lg">Upload a video and click "Analyze Bowling"</p>
              <p className="text-gray-500 text-sm">3D trajectory visualization will appear here</p>
            </div>
          </div>
        ) : (
          <Canvas>
            <PerspectiveCamera makeDefault position={[15, 8, 15]} />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxPolarAngle={Math.PI / 2}
            />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
            <directionalLight position={[-10, 10, -10]} intensity={0.5} />
            <pointLight position={[0, 10, 0]} intensity={0.8} />

            {/* Grid */}
            <Grid
              args={[30, 30]}
              position={[0, 0, 0]}
              cellSize={1}
              cellColor="#3a3a3a"
              sectionSize={5}
              sectionColor="#4a4a4a"
            />

            {/* Cricket pitch and stumps */}
            <CricketPitch />

            {/* Ball trajectory */}
            {trajectory && <BallTrajectory trajectory={trajectory} currentFrame={currentFrame % trajectory.length} />}

            {/* Coordinate axes helper */}
            <axesHelper args={[5]} />
          </Canvas>
        )}

        {/* HUD Overlay */}
        {trajectory && (
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-500/50">
            <p className="text-green-400 text-sm font-mono">
              Frame: {currentFrame} / {trajectory.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
