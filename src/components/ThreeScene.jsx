// src/components/ThreeScene.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import BuildingMarker from "./BuildingMarker";
import PathLine from "./PathLine";
import CameraControls from "./CameraControls";
// import PathNodeMarker from './PathNodeMarker'; // If you decide to use it

function ThreeScene({
  fromPosition,
  toPosition,
  pathCoordinates,
  showBuildingMarkers,
  showPathLine,
  targetPosition, // For camera focus on selection before path
  modelPath = 'final.glb' // Default model path
}) {
  return (
    <div className="canvas-container">
      <Canvas
        shadows
        camera={{ position: [-50, 180, 250], fov: 50, near: 0.1, far: 5000 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[100, 150, 100]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={500}
          shadow-camera-left={-200}
          shadow-camera-right={200}
          shadow-camera-top={200}
          shadow-camera-bottom={-200}
        />
        <pointLight position={[-100, 50, -100]} intensity={0.3} />

        {/* <color attach="background" args={['#ddeeff']} /> */}
        {/* <fog attach="fog" args={['#ddeeff', 200, 700]} /> */}

        <React.Suspense
          fallback={
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="orange" wireframe={true} />
            </mesh>
          }
        >
          <Model modelPath={modelPath} />
        </React.Suspense>

        {showBuildingMarkers && fromPosition && (
          <BuildingMarker position={fromPosition} isStart={true} />
        )}
        {showBuildingMarkers &&
          toPosition &&
          fromPosition !== toPosition && ( // Ensure not same as start
            <BuildingMarker position={toPosition} isEnd={true} />
          )}

        {showPathLine && pathCoordinates && pathCoordinates.length >= 2 && (
          <PathLine pathCoordinates={pathCoordinates} />
        )}
        
        <CameraControls targetPosition={targetPosition} pathCoordinates={pathCoordinates} />
      </Canvas>
    </div>
  );
}

export default ThreeScene;