// src/components/Model.js
import React from "react";
import { useGLTF } from "@react-three/drei";

function Model({ modelPath = 'final.glb' }) { // Make modelPath a prop
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
}
export default Model;