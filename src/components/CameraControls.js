// src/components/CameraControls.js
import React, { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function CameraControls({ targetPosition, pathCoordinates }) {
  const { camera, gl } = useThree();
  const controls = useRef();

  useEffect(() => {
    if (controls.current && !targetPosition && !pathCoordinates) {
      camera.position.set(0, 150, -200); // Initial default position
      controls.current.target.set(0, 0, 0);
      controls.current.update();
    }
  }, [camera, targetPosition, pathCoordinates]);

  useEffect(() => {
     if (targetPosition && !pathCoordinates && controls.current && Array.isArray(targetPosition) && targetPosition.length === 3) {
       const endTarget = new THREE.Vector3(...targetPosition);
       const offset = camera.position.clone().sub(controls.current.target).normalize().multiplyScalar(100);
       let endPosition = endTarget.clone().add(offset);
       if (endPosition.y < endTarget.y + 20) endPosition.y = endTarget.y + 20;

       controls.current.userData = {
           animating: true,
           targetPosition: endPosition,
           targetTarget: endTarget,
           startTime: Date.now()
       };
     } else if (!targetPosition && !pathCoordinates) {
       if (controls.current && controls.current.userData) {
         controls.current.userData.animating = false;
       }
     }
  }, [targetPosition, pathCoordinates, camera]); // camera added for completeness if offset logic uses it

  useEffect(() => {
    if (pathCoordinates && pathCoordinates.length >= 2 && controls.current && camera) {
      const box = new THREE.Box3();
      pathCoordinates.forEach(coord => {
        if (Array.isArray(coord) && coord.length === 3) {
          box.expandByPoint(new THREE.Vector3(...coord));
        }
      });

      if (box.isEmpty()) return;

      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      if (size.x === 0 && size.y === 0 && size.z === 0) {
        const fallbackDistance = 50;
        const newPosition = new THREE.Vector3(center.x, center.y + fallbackDistance, center.z);
         controls.current.userData = {
             animating: true,
             targetPosition: newPosition,
             targetTarget: center,
             startTime: Date.now()
         };
       return;
      }

      const maxDim = Math.max(size.x, size.y, size.z);
      const fitHeightDistance = maxDim / (2 * Math.tan((camera.fov * Math.PI / 180) / 2));
      const fitWidthDistance = fitHeightDistance / camera.aspect;
      const distance = Math.max(fitHeightDistance, fitWidthDistance);
      const padding = 1.4;
      const finalDistance = distance * padding;
      const direction = new THREE.Vector3(0, 0.3, 1).normalize();
      const newPosition = center.clone().add(direction.multiplyScalar(finalDistance));

      controls.current.userData = {
          animating: true,
          targetPosition: newPosition,
          targetTarget: center,
          startTime: Date.now()
      };
    }
  }, [pathCoordinates, camera, gl]);

  useFrame(() => {
     if (controls.current && controls.current.userData?.animating) {
        const { targetPosition, targetTarget, startTime } = controls.current.userData;
        const duration = 1.0;
        const elapsed = (Date.now() - startTime) / 1000;
        const t = Math.min(elapsed / duration, 1.0);
        const easedT = t * t * (3 - 2 * t); // Smooth step

        camera.position.lerp(targetPosition, easedT);
        controls.current.target.lerp(targetTarget, easedT);
        controls.current.update();

        if (t >= 1.0) {
           controls.current.userData.animating = false;
           camera.position.copy(targetPosition);
           controls.current.target.copy(targetTarget);
           controls.current.update();
        }
     } else if (controls.current) {
         controls.current.update();
     }
  });

  return (
    <OrbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.8}
      rotateSpeed={0.5}
      maxDistance={1000}
      screenSpacePanning={false}
      panSpeed={2.0}
    />
  );
}
export default CameraControls;