import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';  // Import THREE for vector operations
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Define GPS coordinates (latitude, longitude) for buildings
const buildingGPSCoordinates = {
  'B8': { lat: 31.781708309682333, lon: 76.99769895342719 }, // Replace with actual GPS coordinates
  'B12': { lat: 31.78133139951378, lon:  76.9982088531437 },
  'B19': { lat: 31.781258589264922,lon:  76.9972818147037  },
  'B23': { lat: 31.781149846707187, lon: 76.99637838078522 },
  'B22': { lat: 31.780707360059, lon:   76.99541149470984 },
  'B12': { lat: 31.78133139951378, lon:  76.9982088531437 },
  'B12': { lat: 31.78133139951378, lon:  76.9982088531437 },
  'B12': { lat: 31.78133139951378, lon:  76.9982088531437 },
  'B12': { lat: 31.78133139951378, lon:  76.9982088531437 },

  // Add more buildings with their GPS coordinates here...
};
// Coordinates mapping for buildings
const building3DCoordinates = {
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
  'FOUNTAIN_AREA': [-330, 15, 200],
  
}
// Bounding box for 3D coordinates (calibrate according to your model's 3D space)
const map3DBoundingBox = {
  minX: -200,
  maxX: 100,
  minZ: -100,
  maxZ: 200,
};

// Function to convert GPS coordinates to 3D coordinates
const convertGPSTo3D = (lat, lon) => {
  // Bounding box for map GPS coordinates (calibrate according to your model's scale)
  const mapBoundingBox = {
    minLat: 31.780,
    maxLat: 31.782,
    minLon: 76.995,
    maxLon: 76.999,
  };
  const { minLat, maxLat, minLon, maxLon } = mapBoundingBox;
  const { minX, maxX, minZ, maxZ } = map3DBoundingBox;

  // Normalize latitude and longitude
  const normalizedLat = (lat - minLat) / (maxLat - minLat);
  const normalizedLon = (lon - minLon) / (maxLon - minLon);

  // Map normalized GPS coordinates to the 3D space
  const x = normalizedLon * (maxX - minX) + minX;
  const z = normalizedLat * (maxZ - minZ) + minZ;

  return [x, 20, z]; // Adjust the Y-value as per map height (20 in this case)
};

// Coordinate Marker Component
function CoordinateMarker({ position, color, isSelected }) {
  return (
    <mesh position={position}>
      <tetrahedronGeometry args={[isSelected ? 8 : 5, 4]} />
      <meshBasicMaterial color={isSelected ? 'red' : color} />
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

// Main Application Component
function App() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [targetPosition, setTargetPosition] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);

  // Fetch live location using Geolocation API
  const getLiveLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const convertedPosition = convertGPSTo3D(latitude, longitude);
        setLiveLocation(convertedPosition);
        setTargetPosition(convertedPosition); // Move camera to live location
      });
    } else {
      alert('Geolocation is not supported by your browser');
    }
  }, []);

  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building);
    setTargetPosition(building3DCoordinates[building]);
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  useEffect(() => {
    getLiveLocation(); // Get live location when the app loads
  }, [getLiveLocation]);

  return (
    <div style={{ display: 'flex' }}>
      <Canvas style={{ height: '100vh', width: '70vw' }}>
        <ambientLight intensity={0.5} />
        <Model />
        <CameraControls targetPosition={targetPosition} />

        {/* Render marker for the selected building only */}
        {selectedBuilding && (
          <CoordinateMarker
            position={building3DCoordinates[selectedBuilding]}
            color="blue"
            isSelected={true}
          />
        )}

        {/* Render live location marker */}
        {liveLocation && (
          <CoordinateMarker position={liveLocation} color="green" isSelected={false} />
        )}
      </Canvas>

      <div style={{ width: '30vw', padding: '1rem' }}>
        <Slider {...sliderSettings}>
          {Object.keys(buildingGPSCoordinates).map((buildingKey) => (
            <div
              key={buildingKey}
              onClick={() => handleBuildingSelect(buildingKey)}
              style={{
                padding: '1rem',
                border: selectedBuilding === buildingKey ? '2px solid red' : '2px solid gray',
                cursor: 'pointer',
              }}
            >
              {buildingKey}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default App;