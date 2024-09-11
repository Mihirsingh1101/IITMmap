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
  'TRAGOPAN_CANTEEN': [-95, 35, 193], // Ensure correct key
  'PEEPAL_MESS': [195, 35, -20], // Ensure correct key
  'CHAAT_JUNCTION_CANTEEN ': [195, 35, -20], // Ensure correct key
  'OAK_MESS': [65, 35, 40],
  'MONAL_CANTEEN': [65, 35, 40],
  'ORIGIN': [0, 20, 0],
  'SPORTS_COMPLEX': [-240, 20, 170],
  'HEALTH_CENTRE': [-275, 20, 200],
  'GUEST_HOUSE': [-255, 25, 100],
  'AUDITORIUM': [-295, 25, 150],
  'VILLAGE_SQUARE': [-275, 10, 130],
  'ALDER_MESS': [165, 30, 95],
  'KUKU_CANTEEN': [165, 30, 95],
  'DRONGO_CANTEEN': [-110, 35, 150],
  'CAFE O MOCHA': [-305, 15, 100],
  'SUPERMARKET': [-315, 10, 110],
  'ROBOTRONICS_LAB(4TH-F-A18)': [105, 40, 140],
  'MANAS_LAB(4TH-F-A18)': [105, 40, 140],
  'ACS_LAB(4TH-F-A18)': [105, 40, 140],
  'A-18-2A(3RD-F-A18)': [105, 40, 140],
  'IKSHMA_CLASSROOM(3RD-F-A18)': [105, 40, 140],
  'SCEE-INFO-LAB(3RD-F-A18)': [105, 40, 140],
  'SP_COM_LAB(2ND-F-A18)': [105, 40, 140],
  'VLSI_LAB(2ND-F-A18)': [105, 40, 140],
  'A18-A1(1ST-F-A18)': [105, 40, 140],
  'SCEE_CONF-ROOM(1ST-F-A18)': [105, 40, 140],
  'DATA_SCIENCE_LAB(1ST-F-A18)': [105, 40, 140],
  'CHEMISTRY_LAB(1ST-F-A18)': [105, 40, 140],
  'SCEE_ELECTRONIC_LAB(GROUND_F-A18)': [105, 40, 140],
  'A-17-1-A(GROUND-F-A17)': [105, 40, 110],
  'A-17-1-B(GROUND-F-A17)': [105, 40, 110],
  'A-17-1-D(GROUND-F-A17)': [105, 40, 110],
  'A-17-1-C(GROUND-F-A17)': [105, 40, 110],
  'A-17-1-E(GROUND-F-A17)': [105, 40, 110],
  'A-17-2-A(1ST-F-A17)': [105, 40, 110],
  'A-17-2-B(1ST-F-A17)': [105, 40, 110],
  'A-17-2-C(1ST-F-A17)': [105, 40, 110],
  'A-17-2-D(1ST-F-A17)': [105, 40, 110],
  'A-17-2-E(1ST-F-A17)': [105, 40, 110],
  'CSP_LAB(2ND-F-A17)': [105, 40, 110],
  'SCEE_OFFICE(2ND-F-A17)': [105, 40, 110],
  'SCEE_CHAIRPERSON_ROOM(2ND-F-A17)': [105, 40, 110],
  'MIC_LAB(3RD-F-A17)': [105, 40, 110],
  'MIC_LAB(3RD-F-A17)': [105, 40, 110],
  'PHOTONICS_LAB(3RD-F-A17)': [105, 40, 110],
  'NSS(1ST_F_A19)': [165, 30, 95],
  'YANTRIK_CLUB(1ST_F_A19)': [165, 30, 95],
  'ROBOTRONICS_CLUB(1ST_F_A19)': [165, 30, 95],
  'E-CELL(1ST_F_A19)': [165, 30, 95],
  'STAC_CLUB(1ST_F_A19)': [165, 30, 95],
  'KAMAND_PROMPT_CLUB(1ST_F_A19)': [165, 30, 95],
  'HNT_CLUB(1ST_F_A19)': [165, 30, 95],
  'NIRMAAN_CLUB(1ST_F_A19)': [165, 30, 95],
  'KAMAND_BIO_CLUB(1ST_F_A19)': [165, 30, 95],
  'TECHNICAL_OFFICE(1ST_F_A19)': [165, 30, 95],
  'DESIGNAUTS_CLUB(2ND_F_A19)': [165, 30, 95],
  'WRITING_CLUB(2ND_F_A19)': [165, 30, 95],
  'ART_GREEKS_CLUB(2ND_F_A19)': [165, 30, 95],
  'DEBATING_AND_QUIZZING_CLUB(2ND_F_A19)': [165, 30, 95],
  'GYMKHANA_MEETING_ROOM(2ND_F_A19)': [165, 30, 95],
  'PMC_CLUB(2ND_F_A19)': [165, 30, 95],
  'MUSIC_CLUB(2ND_F_A19)': [165, 30, 95],
  'SPICMACAY_CLUB(2ND_F_A19)': [165, 30, 95],
  
  

}

function CoordinateMarker({ position, color, isSelected }) {
  return (
    <mesh position={position}>
      <tetrahedronGeometry args={[isSelected ? 8 : 5, 4]} /> {/* Increase size if selected */}
      <meshBasicMaterial color={isSelected ? 'red' : color} /> {/* Highlight color if selected */}
    </mesh>
  );
}


function Model() {
  const { scene } = useGLTF('/static/mapMI.glb'); // Ensure the path to the model is correct
  return <primitive object={scene} />;
}

function CameraControls({ targetPosition }) {
  const { camera } = useThree();
  const controls = React.useRef();

  React.useEffect(() => {
    camera.position.set(200, 200, 200);  // Adjust this to zoom out further on load
    controls.current.update();
  }, [camera]);

  React.useEffect(() => {
    if (targetPosition) {
      controls.current.target.set(...targetPosition);

      const newCameraPosition = new THREE.Vector3(
        targetPosition[0] + 50,
        targetPosition[1] + 50,
        targetPosition[2] + 50
      );

      let frame = 0;
      const totalFrames = 60;

      const animateCamera = () => {
        frame++;
        const easedFrame = THREE.MathUtils.smoothstep(frame / totalFrames, 0, 1); // Smooth transition

        camera.position.lerp(newCameraPosition, easedFrame);
        camera.lookAt(...targetPosition);

        if (frame < totalFrames) {
          requestAnimationFrame(animateCamera);
        } else {
          controls.current.update();
        }
      };

      animateCamera();
    }
  }, [targetPosition, camera]);

  return <OrbitControls ref={controls} />;
}

function ModelView() {
  const [fromBuilding, setFromBuilding] = useState('');
  const [toBuilding, setToBuilding] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [fromPosition, setFromPosition] = useState(null);
  const [toPosition, setToPosition] = useState(null);
  const [targetPosition, setTargetPosition] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null); // State to track selected building

  // Debounced search handler
  const handleFromChange = useCallback((event) => {
    const value = event.target.value;
    setFromBuilding(value);

    if (value) {
      const debounceTimeout = setTimeout(() => {
        const filteredSuggestions = Object.keys(buildingCoordinates).filter((key) =>
          key.toLowerCase().includes(value.toLowerCase())
        );
        setFromSuggestions(filteredSuggestions);
      }, 300);  // 300ms debounce
      return () => clearTimeout(debounceTimeout);  // Clear the timeout if input changes again
    } else {
      setFromSuggestions([]);
    }
  }, []);

  const handleToChange = useCallback((event) => {
    const value = event.target.value;
    setToBuilding(value);

    if (value) {
      const debounceTimeout = setTimeout(() => {
        const filteredSuggestions = Object.keys(buildingCoordinates).filter((key) =>
          key.toLowerCase().includes(value.toLowerCase())
        );
        setToSuggestions(filteredSuggestions);
      }, 300);  // 300ms debounce
      return () => clearTimeout(debounceTimeout);  // Clear the timeout if input changes again
    } else {
      setToSuggestions([]);
    }
  }, []);

  const handleFromSuggestionClick = (suggestion) => {
    setFromBuilding(suggestion);
    setFromSuggestions([]);
    const position = buildingCoordinates[suggestion.toUpperCase()];
    if (position) {
      setFromPosition(position);
      setTargetPosition(position);
      setSelectedBuilding(suggestion); // Set the selected building
    }
  };

  const handleToSuggestionClick = (suggestion) => {
    setToBuilding(suggestion);
    setToSuggestions([]);
    const position = buildingCoordinates[suggestion.toUpperCase()];
    if (position) {
      setToPosition(position);
      setTargetPosition(position);
      setSelectedBuilding(suggestion); // Set the selected building
    }
  };

  return (
    <div>
      {/* Stylish Search Bar Container */}
      <div style={{ position: 'absolute', right: '0px', top: '50%', transform: 'translateY(-50%)', width: '250px' }}>
        <div style={{ marginBottom: '20px', position: 'relative' }}>
        <input
        type="text"
        value={fromBuilding}
        onChange={handleFromChange}
        placeholder="From (e.g., B8)"
        style={searchBarStyle}
        onKeyDown={(e) => {
        if (e.key === 'Enter' && fromSuggestions.length > 0) {
        handleFromSuggestionClick(fromSuggestions[0]); // Automatically select the first suggestion on Enter
        }
      }}
/>
          {fromSuggestions.length > 0 && (
            <ul style={suggestionsStyle}>
              {fromSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() => handleFromSuggestionClick(suggestion)}
                  style={suggestionItemStyle}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ marginBottom: '10px', position: 'relative' }}>
        <input
        type="text"
        value={toBuilding}
        onChange={handleToChange}
        placeholder="To (e.g., B12)"
        style={searchBarStyle}
        onKeyDown={(e) => {
        if (e.key === 'Enter' && toSuggestions.length > 0) {
        handleToSuggestionClick(toSuggestions[0]); // Automatically select the first suggestion on Enter
    }
  }}
/>
          {toSuggestions.length > 0 && (
            <ul style={suggestionsStyle}>
              {toSuggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() => handleToSuggestionClick(suggestion)}
                  style={suggestionItemStyle}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Canvas style={{ height: '70vh', width: '60vw' }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Model />
        {fromPosition && (
        <CoordinateMarker
        position={fromPosition}
        color="yellow"
        isSelected={selectedBuilding === fromBuilding} // Compare with selected building
          />
            )}
        {toPosition && (
         <CoordinateMarker
        position={toPosition}
        color="white"
        isSelected={selectedBuilding === toBuilding} // Compare with selected building
       />
        )}
        <CameraControls targetPosition={targetPosition} />
      </Canvas>
    </div>
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

export default ModelView;