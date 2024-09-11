import React, { useState, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/static/mapMI.glb'); // Ensure the path to the model is correct
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

// Custom CSS styles for the search bar and suggestions
const searchBarStyle = {
  width: '100%',
  padding: '12px 15px',
  fontSize: '18px', // Increased font size for better readability
  borderRadius: '25px', // More rounded corners
  border: '1px solid #ddd',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Softer shadow
  outline: 'none',
  transition: 'all 0.3s ease', // Smooth transition effect
  backgroundColor: 'linear-gradient(145deg, #f6f6f6, #ffffff)', // Subtle gradient
  color: '#333', // Darker text color for contrast
};

// Style for suggestions dropdown
const suggestionsStyle = {
  position: 'absolute',
  top: '50px', // Increased for spacing
  left: '0',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  borderRadius: '15px', // Rounded corners for suggestions box
  listStyle: 'none',
  padding: '0',
  margin: '0',
  width: '100%',
  zIndex: 10,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow for dropdown box
};

// Style for each suggestion item
const suggestionItemStyle = {
  padding: '12px', // Increased padding for better spacing
  cursor: 'pointer',
  borderBottom: '1px solid #eee',
  transition: 'background-color 0.3s ease, color 0.3s ease', // Smooth hover effect
  borderRadius: '10px', // Subtle rounding for each item
  fontSize: '16px', // Larger font for readability
  color: '#555', // Slightly darker text
};

// Adding hover effect for suggestion items
const suggestionItemHoverStyle = {
  backgroundColor: '#f0f0f0', // Lighter hover background
  color: '#333', // Darker text on hover
};

// Adding focus and hover effects to the search bar
const searchBarHoverStyle = {
  ...searchBarStyle,
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', // Increased shadow on hover/focus
  border: '1px solid #aaa', // Darker border on hover/focus
};

export default ModelView;
