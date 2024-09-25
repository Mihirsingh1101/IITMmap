import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model({ onClick }) {
  const { scene } = useGLTF('/static/mapMI.glb'); // Ensure the path is correct
  const meshRef = useRef();

  const handlePointerDown = (event) => {
    const point = event.intersections[0]?.point;
    if (point && onClick) {
      onClick(point);
    }
  };

  return (
    <primitive
      ref={meshRef}
      object={scene}
      onPointerDown={handlePointerDown}
      onPointerOver={(e) => (document.body.style.cursor = 'pointer')}
      onPointerOut={(e) => (document.body.style.cursor = 'auto')}
    />
  );
}

function CameraController() {
  const { camera } = useThree();
  const handleClick = (coords) => {
    console.log('Clicked coordinates:', coords);

    // Smooth camera transition to the clicked point
    camera.position.set(coords.x + 10, coords.y + 10, coords.z + 10);
    camera.lookAt(coords.x, coords.y, coords.z);
  };

  return <Model onClick={handleClick} />;
}

function ModelView() {
  return (
    <Canvas style={{ height: '70vh', width: '60vw', paddingLeft: '20px' }}>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} />
      <CameraController />
      <OrbitControls
        enableZoom={true}
        enableRotate={true}
        enablePan={true}
        maxPolarAngle={Math.PI / 2} // Optional: Limit vertical rotation
      />
    </Canvas>
  );
}

export default ModelView;
