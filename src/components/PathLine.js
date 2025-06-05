// src/components/PathLine.js
import React, { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

function PathLine({ pathCoordinates }) {
  const points = useMemo(() => {
    if (!pathCoordinates || pathCoordinates.length < 2) {
      return [];
    }
    const validPoints = pathCoordinates.filter(p => Array.isArray(p) && p.length === 3);
    if (validPoints.length < 2) return [];
    return validPoints.map((p) => new THREE.Vector3(...p));
  }, [pathCoordinates]);

  if (points.length < 2) {
    return null;
  }

  return (
    <Line
      points={points}
      color="cyan"
      lineWidth={11}
      transparent
      opacity={0.8}
      depthTest={true}
    />
  );
}
export default PathLine;