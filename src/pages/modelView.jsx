import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/static/mapMI.glb'); // Ensure the path is correct
  return <primitive object={scene} />;
}

function ModelView() {
  return (
    <Canvas style={{ height: '70vh', width: '60vw',  paddingLeft: '20px'}}>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} />
      <Model />
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
