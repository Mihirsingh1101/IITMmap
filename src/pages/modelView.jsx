import React, { useState, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';  // Import THREE for vector operations

// Coordinates mapping for buildings
const buildingCoordinates = {
  'B8': [-10, 20, 45],
  'B12': [30, 20, 100],
  'B9': [30, 20, 40],
  'B11': [0, 35, 80],
  'B19': [-55, 25, 110],
  'B16': [-100, 25, 65],
  'B20': [-140, 25, 80],
  'B22': [-180, 25, 110],
  'B21': [-165, 25, 135],
  'B23': [-110, 25, 115],
  'B13': [-190, 25, 170],
  'PINEMESS': [-110, 35, 150],
  'B14': [-140, 25, 170],
  'B15': [-60, 25, 150],
  'B18': [-20, 25, 135],
  'B10': [65, 25, 75],
  'B17': [105, 25, 25],
  'B24': [150, 25, 5],
  'B26': [170, 30, 35],
  'B25': [130, 30, 60],
  'A19': [165, 30, 95],
  'A17': [105, 40, 110],
  'A18': [105, 40, 140],
  'A13': [-15, 35, 166],
  'A14': [-30, 35, 206],
  'A11': [-130, 40, 240],
  'A10': [-150, 40, 215],
  'A9': [-220, 40, 265],
  'CENTRAL_LIBRARY': [30, 35, 150], // Ensure correct key
  'TULSI_MESS': [-95, 35, 193], // Ensure correct key
    'PEEPAL_MESS': [195, 35, -20], // Ensure correct key
  'OAK_MESS': [65, 35, 40],
  'ORIGIN': [0, 20, 0],
  'SPORTS_COMPLEX': [-240, 20, 170],
  'HEALTH_CENTRE': [-275, 20, 200],
  'GUEST_HOUSE': [-255, 25, 100],
  'AUDITORIUM': [-295, 25, 150],
  'ALDER_MESS': [165, 30, 95],

   // Ensure correct key
};

function CoordinateMarker({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[5, 32, 32]} /> {/* Sphere size is 5 */}
      <meshBasicMaterial color="white" /> {/* White marker */}
    </mesh>
  );
}

function Model() {
  const { scene } = useGLTF('/static/mapMI.glb'); // Ensure the path to the model is correct
  return <primitive object={scene} />;
}

function CameraControls({ targetPosition }) {
  const { camera, gl } = useThree();
  const controls = React.useRef();

  // Set initial camera position to a zoomed-out view on first load
  React.useEffect(() => {
    camera.position.set(200, 200, 200);  // Adjust this to zoom out further on load
    controls.current.update();
  }, [camera]);

  React.useEffect(() => {
    if (targetPosition) {
      controls.current.target.set(...targetPosition);  // Set OrbitControls target to the selected building

      // Lerp the camera position towards the target to zoom in
      const newCameraPosition = new THREE.Vector3(
        targetPosition[0] + 50,  // Offset the camera a bit for better viewing angle
        targetPosition[1] + 50,
        targetPosition[2] + 50
      );

      let frame = 0;
      const totalFrames = 60;
      const animateCamera = () => {
        frame++;
        camera.position.lerp(newCameraPosition, frame / totalFrames);  // Smooth transition
        camera.lookAt(...targetPosition);  // Ensure the camera looks at the building

        if (frame < totalFrames) {
          requestAnimationFrame(animateCamera);
        } else {
          controls.current.update();  // Ensure controls update after animation
        }
      };

      animateCamera();
    }
  }, [targetPosition, camera]);

  return <OrbitControls ref={controls} />;
}

function ModelView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [targetPosition, setTargetPosition] = useState(null);
  const [suggestions, setSuggestions] = useState([]);  // State for storing suggestions

  // Handle search input change
  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      const filteredSuggestions = Object.keys(buildingCoordinates).filter((key) =>
        key.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);  // Update suggestions based on input
    } else {
      setSuggestions([]);  // Clear suggestions when search term is empty
    }
  }, []);

  // Handle selection from suggestions and automatically trigger search
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);  // Set the selected suggestion as the search term
    setSuggestions([]);  // Clear the suggestions after selection

    // Automatically trigger search logic
    const position = buildingCoordinates[suggestion.toUpperCase()];  // Get the position
    if (position) {
      setTargetPosition(position);  // Set the target position based on the selected suggestion
    }
  };

  // Handle search form submission (optional, can be removed if auto search is enough)
  const handleSearch = useCallback((event) => {
    event.preventDefault();
    const searchKey = searchTerm.toUpperCase();  // Convert search term to uppercase
    const position = buildingCoordinates[searchKey];  // Match against the uppercase building keys
    if (position) {
      setTargetPosition(position);
    } else {
      alert('Building not found');
    }
  }, [searchTerm]);

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: '10px', position: 'relative' }}>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={handleSearchChange} 
          placeholder="Search for a building (e.g., B8 or B9)" 
        />
        {/* Dropdown for showing suggestions */}
        {suggestions.length > 0 && (
          <ul style={{ 
            position: 'absolute', 
            top: '35px', 
            left: '0', 
            backgroundColor: 'white', 
            border: '1px solid #ccc', 
            listStyle: 'none', 
            padding: '0',
            margin: '0',
            width: '200px',
            zIndex: 10
          }}>
            {suggestions.map((suggestion) => (
              <li 
                key={suggestion} 
                onClick={() => handleSuggestionClick(suggestion)}  // Trigger search on click
                style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </form>
      
      <Canvas style={{ height: '70vh', width: '60vw', paddingLeft: '320px',paddingRight: '120px' }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Model />
        {targetPosition && <CoordinateMarker position={targetPosition} />}
        <CameraControls targetPosition={targetPosition} /> {/* Pass targetPosition to controls */}
      </Canvas>
    </div>
  );
}

export default ModelView;
