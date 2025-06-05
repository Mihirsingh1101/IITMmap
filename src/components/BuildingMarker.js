// src/components/BuildingMarker.js
import React from "react";
import * as THREE from "three";

function BuildingMarker({ position, color, isStart, isEnd }) {
  const size = isStart || isEnd ? 6 : 6;
  const markerColor = isStart ? "#FFFF00" : isEnd ? "#FF00FF" : color || '#ffae00';

  if (!position || !Array.isArray(position) || position.length !== 3) return null;

  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={markerColor} depthTest={true} />
    </mesh>
  );
}
export default BuildingMarker;