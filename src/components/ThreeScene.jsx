// src/components/ThreeScene.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress, PerspectiveCamera } from "@react-three/drei";
// Removed Environment for now
import Model from "./Model";
import BuildingMarker from "./BuildingMarker";
import PathLine from "./PathLine";
import CameraControls from "./CameraControls";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      {/* Simplified Loader - no framer-motion for now */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <p style={{ color: '#333', fontWeight: 'bold', fontSize: '1.1em' }}>Loading Campus...</p>
        <p style={{ color: '#555', fontSize: '0.9em' }}>{Math.round(progress)}% loaded</p>
      </div>
    </Html>
  );
}

function ThreeScene({
  fromPosition,
  toPosition,
  pathCoordinates,
  showBuildingMarkers, // Will still use this for selected markers
  showPathLine,
  targetPosition,
  modelPath = 'final.glb',
  // Props for showing all building markers, if you decide to implement that later
  // allBuildingCoordinates,
  // activeCampus
}) {
  console.log("(ThreeScene.jsx) Rendering for modelPath:", modelPath);

  return (
    <div className="canvas-container flex-grow h-full w-full relative">
      <Canvas shadows dpr={[1, 1.5]} frameloop="demand"> {/* frameloop="demand" is good for performance */}
        <PerspectiveCamera makeDefault position={[-70, 180, 300]} fov={50} near={1} far={5000} /> {/* Adjusted camera slightly */}
        
        {/* Simple Background Color */}
        <color attach="background" args={['#e0e7ff']} /> {/* Light lavender/blue background */}

        {/* Simplified Lighting */}
        <ambientLight intensity={1.2} /> {/* Increased ambient light for overall visibility */}
        <directionalLight
          position={[100, 150, 100]} // Standard directional light position
          intensity={1.5}          // Good intensity
          castShadow
          // Simplified shadow props - can be tuned later
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <React.Suspense fallback={<Loader />}>
          {/* Model component - key is crucial for re-mounting on modelPath change */}
          <Model modelPath={modelPath} key={modelPath} />
        </React.Suspense>

        {/* Markers for selected From and To locations */}
        {showBuildingMarkers && fromPosition && (
          <BuildingMarker position={fromPosition} isStart={true} />
        )}
        {showBuildingMarkers && toPosition && 
         (!fromPosition || (fromPosition[0] !== toPosition[0] || fromPosition[1] !== toPosition[1] || fromPosition[2] !== toPosition[2])) && ( // Ensure not same as start
          <BuildingMarker position={toPosition} isEnd={true} />
        )}

        {/* Path Line */}
        {showPathLine && pathCoordinates && pathCoordinates.length >= 2 && (
          <PathLine pathCoordinates={pathCoordinates} />
        )}

        <CameraControls targetPosition={targetPosition} pathCoordinates={pathCoordinates} />
      </Canvas>
    </div>
  );
}
export default ThreeScene;