// src/components/Model.js
import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

function Model({ modelPath = 'final.glb' }) {
  console.log("(Model.js) Component instance for path:", modelPath);

  // Clear cache when the modelPath changes
  useEffect(() => {
    console.log(`(Model.js) useEffect: Clearing cache for ${modelPath} before loading.`);
    useGLTF.clear(modelPath);
  }, [modelPath]);

  // Load the GLTF scene
  const { scene } = useGLTF(modelPath);

  // Traverse the scene and apply mesh settings
  useEffect(() => {
    if (scene) {
      console.log("(Model.js) SCENE LOADED for:", modelPath, scene);
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Don't override material — keep original
        }
      });
    } else {
      console.error("(Model.js) Scene is undefined after useGLTF for:", modelPath);
    }
  }, [scene, modelPath]);

  if (!scene) {
    console.warn(`(Model.js) Rendering null because scene for ${modelPath} is not (yet) available.`);
    return null;
  }

  return <primitive object={scene} scale={[1, 1, 1]} key={modelPath + "-primitive"} />;
}

export default Model;
