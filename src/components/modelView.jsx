import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';  // Import THREE for vector operations
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Origin real-world coordinates (latitude, longitude)
const originLat = 30.667165    ; // Example latitude for origin
const originLon = 76.887626; // Example longitude for origin

// Scaling factor to convert real-world distance into 3D model distance
const scalingFactor = 40000; // This factor scales the latitude/longitude to virtual coordina3es

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
  'A18': [105, 50, 140],
  'A13': [-15, 35, 166],
  'AVL(GROUND-F_A13)': [-15, 35, 166],
  'MNC-LAB(GROUND-F_A13)': [-15, 35, 166],
  'A13-1A(GROUND-F_A13)': [-15, 35, 166],
  'A13-2A(1ST-F_A13)': [-15, 35, 166],
  'A13-2B(1ST-F_A13)': [-15, 35, 166],
  'A13-2C(1ST-F_A13)': [-15, 35, 166],
  'A13-2D(1ST-F_A13)': [-15, 35, 166],
  'A13-3A(2ND-F_A13)': [-15, 35, 166],
  'A13-L1(2ND-F_A13)': [-15, 35, 166],
  'A13-L2(2ND-F_A13)': [-30, 35, 206],
  'NKN_CONFERENCE_ROOM(3RD-F_A13)': [-30, 35, 206],
  'A13-F1(3RD-F_A13)': [-30, 35, 206],
  'A13-F2(3RD-F_A13)': [-30, 35, 206],
  'A13-F7(3RD-F_A13)': [-30, 35, 206],
  'A13-F4(3RD-F_A13)': [-30, 35, 206],
  'A13-F3(3RD-F_A13)': [-30, 35, 206],
  'A13-F5(3RD-F_A13)': [-30, 35, 206],
  'A13-F6(3RD-F_A13)': [-30, 35, 206],
  'A13-F9(3RD-F_A13)': [-30, 35, 206],
  'A13-F11(3RD-F_A13)': [-30, 35, 206],
  'A13-F12(3RD-F_A13)': [-30, 35, 206],
  'A13-F13(3RD-F_A13)': [-30, 35, 206],
  'A13-F14(3RD-F_A13)': [-30, 35, 206],
  'A13-F15(3RD-F_A13)': [-30, 35, 206],
  'SMSS_CHAIRPERSON_ROOM(3RD-F_A13)': [-30, 35, 206],
  'SMSS__OFFICE(3RD-F_A13)': [-30, 35, 206],
  'A14': [-15, 35, 186],
  'BIOGEOCHEMISTRY_LAB(1ST-F_A14)': [-15, 35, 186],
  'DP_LAB(1ST-F_A14)': [-15, 35, 186],
  'TINKERING_LAB(1ST-F_A14)': [-15, 35, 186],
  'INNORVATION_OFFICE(1ST-F_A14)': [-15, 35, 186],
  'STEAM_INNORVATION_LAB(1ST-F_A14)': [-15, 35, 186],
  'CAM_LAB(GROUND-F_A14)': [-15, 35, 186],
  'SHSS_OFFICE(2ND-F_A14)': [-15, 35, 186],
  'LANGUAGE_LAB(2ND-F_A14)': [-15, 35, 186],
  'CONFERENCE_ROOM(2ND-F_A14)': [-15, 35, 186],
  'HCI_CENTER(3RD-F_A14)': [-15, 35, 186],
  'MATERIAL_SCIENCE_LAB(3RD-F_A14)': [-15, 35, 186],
  'QUANTUM_TECH_CENTRE(3RD-F_A14)': [-15, 35, 186],
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
  'ROBOTRONICS_LAB(4TH-F-A18)': [105, 50, 140],
  'MANAS_LAB(4TH-F-A18)': [105, 50, 140],
  'ACS_LAB(4TH-F-A18)': [105, 50, 140],
  'A-18-2A(3RD-F-A18)': [105, 50, 140],
  'IKSHMA_CLASSROOM(3RD-F-A18)': [105, 50, 140],
  'SCEE-INFO-LAB(3RD-F-A18)': [105, 50, 140],
  'SP_COM_LAB(2ND-F-A18)': [105, 50, 140],
  'VLSI_LAB(2ND-F-A18)': [105, 50, 140],
  'A18-A1(1ST-F-A18)': [105, 50, 140],
  'SCEE_CONF-ROOM(1ST-F-A18)': [105, 50, 140],
  'DATA_SCIENCE_LAB(1ST-F-A18)': [105, 50, 140],
  'CHEMISTRY_LAB(1ST-F-A18)': [105, 50, 140],
  'SCEE_ELECTRONIC_LAB(GROUND_F-A18)': [105, 50, 140],
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
  'DRAMA_CLUB(3-F_PEEPAL_MESS)': [195, 35, -20],
  'DANCE_CLUB(3-F_PEEPAL_MESS)': [195, 35, -20],
  'CULTURAL_SOCIETY_OFFICE(3-F_PEEPAL_MESS)': [195, 35, -20],
  'A-10_1-A(GROUND-F_A10)': [-150, 40, 215],
  'A-10_1-B(GROUND-F_A10)': [-150, 40, 215],
  'A-10_1-C(GROUND-F_A10)': [-150, 40, 215],
  'A-10_1-D(GROUND-F_A10)': [-150, 40, 215],
  'A-10_202(COMPUTER_LAB)(GROUND-F_A10)': [-150, 40, 215],
  'COMMUNICATION-LAB(1ST-F_A10)': [-150, 40, 215],
  'CONTROL_SYSTEM-LAB(1ST-F_A10)': [-150, 40, 215],
  'A-10_2-A(1ST-F_A10)': [-150, 40, 215],
  'A-10_2-B(1ST-F_A10)': [-150, 40, 215],
  'A-10_2-C(1ST-F_A10)': [-150, 40, 215],
  'GSC-ROOM(1ST-F_A10)': [-150, 40, 215],
  'A-10_3-A(2ND-F_A10)': [-150, 40, 215],
  'A-10_3-B(2ND-F_A10)': [-150, 40, 215],
  'A-10_3-C(2ND-F_A10)': [-150, 40, 215],
  'SOM_OFFICE(2ND-F_A10)': [-150, 40, 215],
  'NKN_CONFERENCE_ROOM(2ND-F_A10)': [-150, 40, 215],
  'FACULTY_OFFICE(2ND-F_A10)': [-150, 40, 215],
  '(2ND-F_A10)': [-150, 40, 215],
  'FACULTY_OFFICE(2ND-F_A10)': [-150, 40, 215],
  'GEOTECHNICAL_ENG_LAB(2ND-F_A11)': [-130, 40, 240],
  'CNC_LAB(2ND-F_A11)': [-130, 40, 240],
  'DESIGN_LAB-1(2ND-F_A11)': [-130, 40, 240],
  'THERMOFLUID_LAB(2ND-F_A11)': [-130, 40, 240],
  'A-11_1-A(1ST-F_A11)': [-130, 40, 240],
  'A-11_1-B(1ST-F_A11)': [-130, 40, 240],
  'CAIR_LAB(1ST-F_A11)': [-130, 40, 240],
  'DESIGN_LAB-2(3RD-F_A11)': [-130, 40, 240],
  'WATER_RESIRE_ENG_LAB-2(3RD-F_A11)': [-130, 40, 240],
  'EXPERIMENTAL_THERMOFLUIDS_LAB(3RD-F_A11)': [-130, 40, 240],
  'A-11_COMPUTER_LAB(3RD-F_A11)': [-130, 40, 240],
  'RHEOLOGY_LAB(3RD-F_A11)': [-130, 40, 240],
  'HYDROLOGY_LAB(3RD-F_A11)': [-130, 40, 240],
  'HYDROCLIMATOLOGY_LAB(3RD-F_A11)': [-130, 40, 240],
  'COMPOSITE_DESIGN_LAB(4TH-F_A11)': [-130, 40, 240],
  'COMPUTATIONAL_DESIGN_LAB(4TH-F_A11)': [-130, 40, 240],
  'SMEE_MEETING_ROOM(4TH-F_A11)': [-130, 40, 240],
  'SCENE_OFFICE(5TH-F_A11)': [-130, 40, 240],
  'STUDENTS_AFFAIR(GROUND-F_A9)': [-220, 40, 265],
  'ACADEMICS_SECTION(1ST-F_A9)': [-220, 40, 265],
  'FACULTY_AFFAIRS(1ST-F_A9)': [-220, 40, 265],
  'REGISTRAR_OFFICE(2ND-F_A9)': [-220, 40, 265],
  'SATELLITE_LIBRARY(3RD-F_A9)': [-220, 40, 265],
  'FOUNTAIN_AREA': [-330, 15, 200],
  
}


// Function to convert real-world coordinates (latitude, longitude) to virtual coordinates
const convertToVirtualCoordinates = (lat, lon) => {
  const deltaLat = lat - originLat; // Latitude difference
  const deltaLon = lon - originLon; // Longitude difference

// Convert to 3D space
const virtualX = deltaLon * scalingFactor; // Scale the longitude difference
const virtualZ = deltaLat * scalingFactor; // Scale the latitude difference

return [virtualX, 0, virtualZ]; // Assuming the y-axis is 0 for now (height can be added later)
};




// Coordinate Marker Component
function CoordinateMarker({ position, color, isSelected }) {
  return (
    <mesh position={position}>
      <tetrahedronGeometry args={[isSelected ? 18 : 5, 4]} />
      <meshBasicMaterial color={isSelected ? 'yellow' : color} />
    </mesh>
  );
}

// Model Component
function Model() {
  const { scene } = useGLTF('map2NOTREE.glb');
  return <primitive object={scene} />;
}

// Camera Controls Component
function CameraControls({ targetPosition }) {
  const { camera } = useThree();
  const controls = useRef();

  useEffect(() => {
    camera.position.set(0, 150, -200);
    controls.current.update();
  }, [camera]);

  useEffect(() => {
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
        const easedFrame = THREE.MathUtils.smoothstep(frame / totalFrames, 0, 1);

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

// Main Component
function ModelView() {
  const [fromBuilding, setFromBuilding] = useState('');
  const [toBuilding, setToBuilding] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [fromPosition, setFromPosition] = useState(null);
  const [toPosition, setToPosition] = useState(null);
  const [targetPosition, setTargetPosition] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [highlightedFromIndex, setHighlightedFromIndex] = useState(-1);
  const [highlightedToIndex, setHighlightedToIndex] = useState(-1);
  const sliderRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const handleFromChange = useCallback((event) => {
    const value = event.target.value;
    setFromBuilding(value);

    if (value) {
      const debounceTimeout = setTimeout(() => {
        const filteredSuggestions = Object.keys(buildingCoordinates).filter((key) =>
          key.toLowerCase().includes(value.toLowerCase())
        );
        setFromSuggestions(filteredSuggestions);
      }, 300);
      return () => clearTimeout(debounceTimeout);
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
      }, 300);
      return () => clearTimeout(debounceTimeout);
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
      setSelectedBuilding(suggestion);
    }
  };

  const handleToSuggestionClick = (suggestion) => {
    setToBuilding(suggestion);
    setToSuggestions([]);
    const position = buildingCoordinates[suggestion.toUpperCase()];
    if (position) {
      setToPosition(position);
      setTargetPosition(position);
      setSelectedBuilding(suggestion);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.slickNext();
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

// Handle current location (this would be replaced with actual GPS data in production)
const handleLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      const virtualPosition = convertToVirtualCoordinates(latitude, longitude);
      setCurrentLocation(virtualPosition); // Update the current location marker
    });
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the Earth in meters
  const toRadians = (deg) => (deg * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

let lastPosition = null;

useEffect(() => {
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      console.log(`Lat: ${latitude}, Lon: ${longitude}, Accuracy: ${accuracy} meters`);

      if (lastPosition) {
        const distance = calculateDistance(
          lastPosition.latitude,
          lastPosition.longitude,
          latitude,
          longitude
        );

        if (distance >= 1) { // Update if moved more than 1 meter
          lastPosition = { latitude, longitude };
          const virtualPosition = convertToVirtualCoordinates(latitude, longitude);
          setCurrentLocation(virtualPosition);
          console.log(`Updated position: Lat ${latitude}, Lon ${longitude}`);
        } else {
          console.log(`Movement too small: ${distance} meters`);
        }
      } else {
        lastPosition = { latitude, longitude };
      }
    },
    (error) => {
      console.error("Error fetching location:", error.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}, []);



  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f0f0', margin: '0', padding: '0' }}>
      {/* Sidebar with search bars */}
      <div style={{
        width: '340px',
        height: '100vh',
        backgroundColor: '#002b36',
        padding: '20px',
        borderRight: '2px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ marginBottom: '100px' }}>
          <input
            type="text"
            value={fromBuilding}
            onChange={handleFromChange}
            placeholder="From (e.g., B8)"
            style={searchBarStyle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && fromSuggestions.length > 0) {
                handleFromSuggestionClick(fromSuggestions[highlightedFromIndex >= 0 ? highlightedFromIndex : 0]);
              } else if (e.key === 'ArrowDown') {
                setHighlightedFromIndex((prevIndex) => Math.min(prevIndex + 1, fromSuggestions.length - 1));
              } else if (e.key === 'ArrowUp') {
                setHighlightedFromIndex((prevIndex) => Math.max(prevIndex - 1, 0));
              }
            }}
          />
          {fromSuggestions.length > 0 && (
            <ul style={suggestionsStyle}>
              {fromSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  onClick={() => handleFromSuggestionClick(suggestion)}
                  style={{
                    ...suggestionItemStyle,
                    backgroundColor: highlightedFromIndex === index ? '#ddd' : 'white',
                    color: highlightedFromIndex === index ? '#333' : '#555',
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Photo Slider */}
        <div style={{ marginBottom: '20px', height: '300px', overflow: 'hidden', position: 'center' }}>
          <Slider {...sliderSettings} ref={sliderRef}>
            <div><img src="p1.jpg" alt="Slide 1" style={{ width: '100%', height: 'auto' }} /></div>
            <div><img src="p2.jpg" alt="Slide 2" style={{ width: '100%', height: 'auto' }} /></div>
            <div><img src="p1.jpg" alt="Slide 3" style={{ width: '100%', height: 'auto' }} /></div>
          </Slider>
        </div>

        <div style={{ marginBottom: '200px', backgroundColor: '#002b36' }}>
          <input
            type="text"
            value={toBuilding}
            onChange={handleToChange}
            placeholder="To (e.g., B12)"
            style={searchBarStyle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && toSuggestions.length > 0) {
                handleToSuggestionClick(toSuggestions[highlightedToIndex >= 0 ? highlightedToIndex : 0]);
              } else if (e.key === 'ArrowDown') {
                setHighlightedToIndex((prevIndex) => Math.min(prevIndex + 1, toSuggestions.length - 1));
              } else if (e.key === 'ArrowUp') {
                setHighlightedToIndex((prevIndex) => Math.max(prevIndex - 1, 0));
              }
            }}
          />
          {toSuggestions.length > 0 && (
            <ul style={suggestionsStyle}>
              {toSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  onClick={() => handleToSuggestionClick(suggestion)}
                  style={{
                    ...suggestionItemStyle,
                    backgroundColor: highlightedToIndex === index ? '#ddd' : 'white',
                    color: highlightedToIndex === index ? '#333' : '#555',
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Canvas Container */}
      <div style={{ flexGrow: 1, height: '100vh', backgroundColor: '#002b36', padding: '0', margin: '0' }}>
        <Canvas style={{ height: '100%' }}>
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} />
          <Model />
          {fromPosition && (
            <CoordinateMarker
              position={fromPosition}
              color="blue"
              isSelected={selectedBuilding === fromBuilding}
            />
          )}
          {toPosition && (
            <CoordinateMarker
              position={toPosition}
              color="green"
              isSelected={selectedBuilding === toBuilding}
            />
          )}
          {currentLocation && (
            <CoordinateMarker
            position={currentLocation}
            color="red"
            isSelected={false}
            size={3}
            />
          )}
          <CameraControls targetPosition={targetPosition} />
        </Canvas>
      </div>
    </div>
  );
}

// Styles
const searchBarStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  marginBottom: '5px'
};

const suggestionsStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
  border: '1px solid #ddd',
  borderRadius: '4px',
  maxHeight: '150px',      
  overflowY: 'auto',        
  backgroundColor: 'white'  
};

const suggestionItemStyle = {
  padding: '10px',
  cursor: 'pointer'
};

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  vertical: true, // Change slider to vertical
  verticalSwiping: true // Enable vertical swiping
};

export default ModelView;