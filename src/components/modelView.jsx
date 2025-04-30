import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Line } from "@react-three/drei";
import * as THREE from "three";



// 'B8': [-10, 20, 45],
//   'B12': [30, 20, 100],
//   'B9': [30, 20, 40],
//   'B11': [0, 35, 80],
//   'B19': [-55, 25, 110],
//   'B16': [-100, 25, 65],
//   'B20': [-140, 25, 80],
//   'B22': [-180, 25, 110],
//   'B21': [-165, 25, 135],
//   'B23': [-110, 25, 115],
//   'B13': [-190, 25, 170],
//   'PINEMESS': [-110, 35, 150],
//   'B14': [-140, 25, 170],
//   'B15': [-60, 25, 150],
//   'B18': [-20, 25, 135],
//   'B10': [65, 25, 75],
//   'B17': [105, 25, 25],
//   'B24': [150, 25, 5],
//   'B26': [170, 30, 35],
//   'B25': [130, 30, 60],
//   'A19': [165, 30, 95],
//   'A17': [105, 40, 110],
//   'A18': [105, 50, 140],
//   'A13': [-15, 35, 166],
//   'AVL(GROUND-F_A13)': [-15, 35, 166],
//   'MNC-LAB(GROUND-F_A13)': [-15, 35, 166],
//   'A13-1A(GROUND-F_A13)': [-15, 35, 166],
//   'A13-2A(1ST-F_A13)': [-15, 35, 166],
//   'A13-2B(1ST-F_A13)': [-15, 35, 166],
//   'A13-2C(1ST-F_A13)': [-15, 35, 166],
//   'A13-2D(1ST-F_A13)': [-15, 35, 166],
//   'A13-3A(2ND-F_A13)': [-15, 35, 166],
//   'A13-L1(2ND-F_A13)': [-15, 35, 166],
//   'A13-L2(2ND-F_A13)': [-30, 35, 206],
//   'NKN_CONFERENCE_ROOM(3RD-F_A13)': [-30, 35, 206],
//   'A13-F1(3RD-F_A13)': [-30, 35, 206],
//   'A13-F2(3RD-F_A13)': [-30, 35, 206],
//   'A13-F7(3RD-F_A13)': [-30, 35, 206],
//   'A13-F4(3RD-F_A13)': [-30, 35, 206],
//   'A13-F3(3RD-F_A13)': [-30, 35, 206],
//   'A13-F5(3RD-F_A13)': [-30, 35, 206],
//   'A13-F6(3RD-F_A13)': [-30, 35, 206],
//   'A13-F9(3RD-F_A13)': [-30, 35, 206],
//   'A13-F11(3RD-F_A13)': [-30, 35, 206],
//   'A13-F12(3RD-F_A13)': [-30, 35, 206],
//   'A13-F13(3RD-F_A13)': [-30, 35, 206],
//   'A13-F14(3RD-F_A13)': [-30, 35, 206],
//   'A13-F15(3RD-F_A13)': [-30, 35, 206],
//   'SMSS_CHAIRPERSON_ROOM(3RD-F_A13)': [-30, 35, 206],
//   'SMSS__OFFICE(3RD-F_A13)': [-30, 35, 206],
//   'A14': [-15, 35, 186],
//   'BIOGEOCHEMISTRY_LAB(1ST-F_A14)': [-15, 35, 186],
//   'DP_LAB(1ST-F_A14)': [-15, 35, 186],
//   'TINKERING_LAB(1ST-F_A14)': [-15, 35, 186],
//   'INNOVATION_OFFICE(1ST-F_A14)': [-15, 35, 186],
//   'STEAM_INNORVATION_LAB(1ST-F_A14)': [-15, 35, 186],
//   'CAM_LAB(GROUND-F_A14)': [-15, 35, 186],
//   'SHSS_OFFICE(2ND-F_A14)': [-15, 35, 186],
//   'LANGUAGE_LAB(2ND-F_A14)': [-15, 35, 186],
//   'CONFERENCE_ROOM(2ND-F_A14)': [-15, 35, 186],
//   'HCI_CENTER(3RD-F_A14)': [-15, 35, 186],
//   'MATERIAL_SCIENCE_LAB(3RD-F_A14)': [-15, 35, 186],
//   'QUANTUM_TECH_CENTRE(3RD-F_A14)': [-15, 35, 186],
//   'A11': [-130, 40, 240],
//   'A10': [-150, 40, 215],
//   'A9': [-220, 40, 265],
//   'CENTRAL_LIBRARY': [30, 35, 150], // Ensure correct key
//   'TULSI_MESS': [-95, 35, 193], // Ensure correct key
//   'TRAGOPAN_CANTEEN': [-95, 35, 193], // Ensure correct key
//   'PEEPAL_MESS': [195, 35, -20], // Ensure correct key
//   'CHAAT_JUNCTION_CANTEEN ': [195, 35, -20], // Ensure correct key
//   'OAK_MESS': [65, 35, 40],
//   'MONAL_CANTEEN': [65, 35, 40],
//   'ORIGIN': [0, 20, 0],
//   'SPORTS_COMPLEX': [-240, 20, 170],
//   'HEALTH_CENTRE': [-275, 20, 200],
//   'GUEST_HOUSE': [-255, 25, 100],
//   'AUDITORIUM': [-295, 25, 150],
//   'VILLAGE_SQUARE': [-275, 10, 130],
//   'ALDER_MESS': [165, 30, 95],
//   'KUKU_CANTEEN': [165, 30, 95],
//   'DRONGO_CANTEEN': [-110, 35, 150],
//   'CAFE O MOCHA': [-305, 15, 100],
//   'SUPERMARKET': [-315, 10, 110],
//   'ROBOTRONICS_LAB(4TH-F-A18)': [105, 50, 140],
//   'MANAS_LAB(4TH-F-A18)': [105, 50, 140],
//   'ACS_LAB(4TH-F-A18)': [105, 50, 140],
//   'A-18-2A(3RD-F-A18)': [105, 50, 140],
//   'IKSHMA_CLASSROOM(3RD-F-A18)': [105, 50, 140],
//   'SCEE-INFO-LAB(3RD-F-A18)': [105, 50, 140],
//   'SP_COM_LAB(2ND-F-A18)': [105, 50, 140],
//   'VLSI_LAB(2ND-F-A18)': [105, 50, 140],
//   'A18-A1(1ST-F-A18)': [105, 50, 140],
//   'SCEE_CONF-ROOM(1ST-F-A18)': [105, 50, 140],
//   'DATA_SCIENCE_LAB(1ST-F-A18)': [105, 50, 140],
//   'CHEMISTRY_LAB(1ST-F-A18)': [105, 50, 140],
//   'SCEE_ELECTRONIC_LAB(GROUND_F-A18)': [105, 50, 140],
//   'A-17-1-A(GROUND-F-A17)': [105, 40, 110],
//   'A-17-1-B(GROUND-F-A17)': [105, 40, 110],
//   'A-17-1-D(GROUND-F-A17)': [105, 40, 110],
//   'A-17-1-C(GROUND-F-A17)': [105, 40, 110],
//   'A-17-1-E(GROUND-F-A17)': [105, 40, 110],
//   'A-17-2-A(1ST-F-A17)': [105, 40, 110],
//   'A-17-2-B(1ST-F-A17)': [105, 40, 110],
//   'A-17-2-C(1ST-F-A17)': [105, 40, 110],
//   'A-17-2-D(1ST-F-A17)': [105, 40, 110],
//   'A-17-2-E(1ST-F-A17)': [105, 40, 110],
//   'CSP_LAB(2ND-F-A17)': [105, 40, 110],
//   'SCEE_OFFICE(2ND-F-A17)': [105, 40, 110],
//   'SCEE_CHAIRPERSON_ROOM(2ND-F-A17)': [105, 40, 110],
//   'MIC_LAB(3RD-F-A17)': [105, 40, 110],
//   'MIC_LAB(3RD-F-A17)': [105, 40, 110],
//   'PHOTONICS_LAB(3RD-F-A17)': [105, 40, 110],
//   'NSS(1ST_F_A19)': [165, 30, 95],
//   'YANTRIK_CLUB(1ST_F_A19)': [165, 30, 95],
//   'ROBOTRONICS_CLUB(1ST_F_A19)': [165, 30, 95],
//   'E-CELL(1ST_F_A19)': [165, 30, 95],
//   'STAC_CLUB(1ST_F_A19)': [165, 30, 95],
//   'KAMAND_PROMPT_CLUB(1ST_F_A19)': [165, 30, 95],
//   'HNT_CLUB(1ST_F_A19)': [165, 30, 95],
//   'NIRMAAN_CLUB(1ST_F_A19)': [165, 30, 95],
//   'KAMAND_BIO_CLUB(1ST_F_A19)': [165, 30, 95],
//   'TECHNICAL_OFFICE(1ST_F_A19)': [165, 30, 95],
//   'DESIGNAUTS_CLUB(2ND_F_A19)': [165, 30, 95],
//   'WRITING_CLUB(2ND_F_A19)': [165, 30, 95],
//   'ART_GREEKS_CLUB(2ND_F_A19)': [165, 30, 95],
//   'DEBATING_AND_QUIZZING_CLUB(2ND_F_A19)': [165, 30, 95],
//   'GYMKHANA_MEETING_ROOM(2ND_F_A19)': [165, 30, 95],
//   'PMC_CLUB(2ND_F_A19)': [165, 30, 95],
//   'MUSIC_CLUB(2ND_F_A19)': [165, 30, 95],
//   'SPICMACAY_CLUB(2ND_F_A19)': [165, 30, 95],
//   'DRAMA_CLUB(3-F_PEEPAL_MESS)': [195, 35, -20],
//   'DANCE_CLUB(3-F_PEEPAL_MESS)': [195, 35, -20],
//   'CULTURAL_SOCIETY_OFFICE(3-F_PEEPAL_MESS)': [195, 35, -20],
//   'A-10_1-A(GROUND-F_A10)': [-150, 40, 215],
//   'A-10_1-B(GROUND-F_A10)': [-150, 40, 215],
//   'A-10_1-C(GROUND-F_A10)': [-150, 40, 215],
//   'A-10_1-D(GROUND-F_A10)': [-150, 40, 215],
//   'A-10_202(COMPUTER_LAB)(GROUND-F_A10)': [-150, 40, 215],
//   'COMMUNICATION-LAB(1ST-F_A10)': [-150, 40, 215],
//   'CONTROL_SYSTEM-LAB(1ST-F_A10)': [-150, 40, 215],
//   'A-10_2-A(1ST-F_A10)': [-150, 40, 215],
//   'A-10_2-B(1ST-F_A10)': [-150, 40, 215],
//   'A-10_2-C(1ST-F_A10)': [-150, 40, 215],
//   'GSC-ROOM(1ST-F_A10)': [-150, 40, 215],
//   'A-10_3-A(2ND-F_A10)': [-150, 40, 215],
//   'A-10_3-B(2ND-F_A10)': [-150, 40, 215],
//   'A-10_3-C(2ND-F_A10)': [-150, 40, 215],
//   'SOM_OFFICE(2ND-F_A10)': [-150, 40, 215],
//   'NKN_CONFERENCE_ROOM(2ND-F_A10)': [-150, 40, 215],
//   'FACULTY_OFFICE(2ND-F_A10)': [-150, 40, 215],
//   '(2ND-F_A10)': [-150, 40, 215],
//   'FACULTY_OFFICE(2ND-F_A10)': [-150, 40, 215],
//   'GEOTECHNICAL_ENG_LAB(2ND-F_A11)': [-130, 40, 240],
//   'CNC_LAB(2ND-F_A11)': [-130, 40, 240],
//   'DESIGN_LAB-1(2ND-F_A11)': [-130, 40, 240],
//   'THERMOFLUID_LAB(2ND-F_A11)': [-130, 40, 240],
//   'A-11_1-A(1ST-F_A11)': [-130, 40, 240],
//   'A-11_1-B(1ST-F_A11)': [-130, 40, 240],
//   'CAIR_LAB(1ST-F_A11)': [-130, 40, 240],
//   'DESIGN_LAB-2(3RD-F_A11)': [-130, 40, 240],
//   'WATER_RESIRE_ENG_LAB-2(3RD-F_A11)': [-130, 40, 240],
//   'EXPERIMENTAL_THERMOFLUIDS_LAB(3RD-F_A11)': [-130, 40, 240],
//   'A-11_COMPUTER_LAB(3RD-F_A11)': [-130, 40, 240],
//   'RHEOLOGY_LAB(3RD-F_A11)': [-130, 40, 240],
//   'HYDROLOGY_LAB(3RD-F_A11)': [-130, 40, 240],
//   'HYDROCLIMATOLOGY_LAB(3RD-F_A11)': [-130, 40, 240],
//   'COMPOSITE_DESIGN_LAB(4TH-F_A11)': [-130, 40, 240],
//   'COMPUTATIONAL_DESIGN_LAB(4TH-F_A11)': [-130, 40, 240],
//   'SMEE_MEETING_ROOM(4TH-F_A11)': [-130, 40, 240],
//   'SCENE_OFFICE(5TH-F_A11)': [-130, 40, 240],
//   'STUDENTS_AFFAIR(GROUND-F_A9)': [-220, 40, 265],
//   'ACADEMICS_SECTION(1ST-F_A9)': [-220, 40, 265],
//   'FACULTY_AFFAIRS(1ST-F_A9)': [-220, 40, 265],
//   'REGISTRAR_OFFICE(2ND-F_A9)': [-220, 40, 265],
//   'SATELLITE_LIBRARY(3RD-F_A9)': [-220, 40, 265],
//   'FOUNTAIN_AREA': [-330, 15, 200],
// 
// --- Data (buildingCoordinates, roadNetworkNodes, roadNetworkConnections) ---
// Keep all your data definitions exactly as they were
// ... (Your existing buildingCoordinates object)
const buildingCoordinates = {
   /* ... your existing building coordinates ... */
   B8: [-10, 20, 45],
   B12: [30, 20, 100],
   B9: [30, 20, 40],
   B11: [0, 25, 80],
   B19: [-55, 25, 110],
   B16: [-100, 25, 65],
   B20: [-140, 25, 80],
   B22: [-190, 25, 125],
   B21: [-165, 25, 135],
   B23: [-110, 25, 115],
   B13: [-190, 25, 170],
   PINEMESS: [-110, 28, 150],
   B14: [-140, 25, 170],
   B15: [-70, 25, 155],
   B18: [-20, 25, 135],
   B10: [75, 20, 80],
   B17: [105, 20, 25],
   B24: [150, 25, 5],
   B26: [170, 23, 35],
   B25: [130, 23, 60],
   A19: [165, 30, 95],
   A17: [105, 40, 110],
   A18: [105, 50, 140],
   A13: [-15, 35, 166],
   "AVL(GROUND-F_A13)": [-15, 35, 166], // Assuming these are same location as A13
   "MNC-LAB(GROUND-F_A13)": [-15, 35, 166],
   "A13-1A(GROUND-F_A13)": [-15, 35, 166],
   "A13-2A(1ST-F_A13)": [-15, 35, 166],
   "A13-2B(1ST-F_A13)": [-15, 35, 166],
   "A13-2C(1ST-F_A13)": [-15, 35, 166],
   "A13-2D(1ST-F_A13)": [-15, 35, 166],
   "A13-3A(2ND-F_A13)": [-15, 35, 166],
   "A13-L1(2ND-F_A13)": [-15, 35, 166],
   "A13-L2(2ND-F_A13)": [-30, 35, 206], // Different coordinates
   "NKN_CONFERENCE_ROOM(3RD-F_A13)": [-30, 35, 206], // Same as A13-L2
   "A13-F1(3RD-F_A13)": [-30, 35, 206],
   "A13-F2(3RD-F_A13)": [-30, 35, 206],
   "A13-F7(3RD-F_A13)": [-30, 35, 206],
   "A13-F4(3RD-F_A13)": [-30, 35, 206],
   "A13-F3(3RD-F_A13)": [-30, 35, 206],
   "A13-F5(3RD-F_A13)": [-30, 35, 206],
   "A13-F6(3RD-F_A13)": [-30, 35, 206],
   "A13-F9(3RD-F_A13)": [-30, 35, 206],
   "A13-F11(3RD-F_A13)": [-30, 35, 206],
   "A13-F12(3RD-F_A13)": [-30, 35, 206],
   "A13-F13(3RD-F_A13)": [-30, 35, 206],
   "A13-F14(3RD-F_A13)": [-30, 35, 206],
   "A13-F15(3RD-F_A13)": [-30, 35, 206],
   "SMSS_CHAIRPERSON_ROOM(3RD-F_A13)": [-30, 35, 206],
   "SMSS__OFFICE(3RD-F_A13)": [-30, 35, 206],
   A14: [-15, 35, 186],
   "BIOGEOCHEMISTRY_LAB(1ST-F_A14)": [-15, 35, 186],
   "DP_LAB(1ST-F_A14)": [-15, 35, 186],
   "TINKERING_LAB(1ST-F_A14)": [-15, 35, 186],
   "INNOVATION_OFFICE(1ST-F_A14)": [-15, 35, 186],
   "STEAM_INNORVATION_LAB(1ST-F_A14)": [-15, 35, 186],
   "CAM_LAB(GROUND-F_A14)": [-15, 35, 186],
   "SHSS_OFFICE(2ND-F_A14)": [-15, 35, 186],
   "LANGUAGE_LAB(2ND-F_A14)": [-15, 35, 186],
   "CONFERENCE_ROOM(2ND-F_A14)": [-15, 35, 186],
   "HCI_CENTER(3RD-F_A14)": [-15, 35, 186],
   "MATERIAL_SCIENCE_LAB(3RD-F_A14)": [-15, 35, 186],
   "QUANTUM_TECH_CENTRE(3RD-F_A14)": [-15, 35, 186],
   A11: [-130, 40, 240],
   A10: [-150, 40, 215],
   A9: [-220, 40, 265],
   CENTRAL_LIBRARY: [30, 35, 150],
   TULSI_MESS: [-95, 35, 193],
   TRAGOPAN_CANTEEN: [-95, 35, 193],
   PEEPAL_MESS: [195, 32, -20],
   "CHAAT_JUNCTION_CANTEEN ": [195, 32, -20],
   OAK_MESS: [70, 30, 40],
   MONAL_CANTEEN: [78,13,27],
   ORIGIN: [0, 20, 0],
   SPORTS_COMPLEX: [-240, 20, 170],
   HEALTH_CENTRE: [-275, 20, 200],
   GUEST_HOUSE: [-290, 15, 80],
   AUDITORIUM: [-295, 25, 150],
   VILLAGE_SQUARE: [-275, 10, 130],
   ALDER_MESS: [165, 30, 95],
   KUKU_CANTEEN: [165, 30, 95],
   DRONGO_CANTEEN: [-110, 35, 150],
   "CAFE O MOCHA": [-305, 15, 100],
   SUPERMARKET: [-315, 10, 110],
   "ROBOTRONICS_LAB(4TH-F-A18)": [105, 50, 140],
   "MANAS_LAB(4TH-F-A18)": [105, 50, 140],
   "ACS_LAB(4TH-F-A18)": [105, 50, 140],
   "A-18-2A(3RD-F-A18)": [105, 50, 140],
   "IKSHMA_CLASSROOM(3RD-F-A18)": [105, 50, 140],
   "SCEE-INFO-LAB(3RD-F-A18)": [105, 50, 140],
   "SP_COM_LAB(2ND-F-A18)": [105, 50, 140],
   "VLSI_LAB(2ND-F-A18)": [105, 50, 140],
   "A18-A1(1ST-F-A18)": [105, 50, 140],
   "SCEE_CONF-ROOM(1ST-F-A18)": [105, 50, 140],
   "DATA_SCIENCE_LAB(1ST-F-A18)": [105, 50, 140],
   "CHEMISTRY_LAB(1ST-F-A18)": [105, 50, 140],
   "SCEE_ELECTRONIC_LAB(GROUND_F-A18)": [105, 50, 140],
   "A-17-1-A(GROUND-F-A17)": [105, 40, 110],
   "A-17-1-B(GROUND-F-A17)": [105, 40, 110],
   "A-17-1-D(GROUND-F-A17)": [105, 40, 110],
   "A-17-1-C(GROUND-F-A17)": [105, 40, 110],
   "A-17-1-E(GROUND-F-A17)": [105, 40, 110],
   "A-17-2-A(1ST-F-A17)": [105, 40, 110],
   "A-17-2-B(1ST-F_A17)": [105, 40, 110],
   "A-17-2-C(1ST-F_A17)": [105, 40, 110],
   "A-17-2-D(1ST-F_A17)": [105, 40, 110],
   "A-17-2-E(1ST-F_A17)": [105, 40, 110],
   "CSP_LAB(2ND-F-A17)": [105, 40, 110],
   "SCEE_OFFICE(2ND-F-A17)": [105, 40, 110],
   "SCEE_CHAIRPERSON_ROOM(2ND-F-A17)": [105, 40, 110],
   "MIC_LAB(3RD-F-A17)": [105, 40, 110],
   "PHOTONICS_LAB(3RD-F-A17)": [105, 40, 110],
   "NSS(1ST_F_A19)": [165, 30, 95],
   "YANTRIK_CLUB(1ST_F_A19)": [165, 30, 95],
   "ROBOTRONICS_CLUB(1ST_F_A19)": [165, 30, 95],
   "E-CELL(1ST_F_A19)": [165, 30, 95],
   "STAC_CLUB(1ST_F_A19)": [165, 30, 95],
   "KAMAND_PROMPT_CLUB(1ST_F_A19)": [165, 30, 95],
   "HNT_CLUB(1ST_F_A19)": [165, 30, 95],
   "NIRMAAN_CLUB(1ST_F_A19)": [165, 30, 95],
   "KAMAND_BIO_CLUB(1ST_F_A19)": [165, 30, 95],
   "TECHNICAL_OFFICE(1ST_F_A19)": [165, 30, 95],
   "DESIGNAUTS_CLUB(2ND_F_A19)": [165, 30, 95],
   "WRITING_CLUB(2ND_F_A19)": [165, 30, 95],
   "ART_GREEKS_CLUB(2ND_F_A19)": [165, 30, 95],
   "DEBATING_AND_QUIZZING_CLUB(2ND_F_A19)": [165, 30, 95],
   "GYMKHANA_MEETING_ROOM(2ND_F_A19)": [165, 30, 95],
   "PMC_CLUB(2ND_F_A19)": [165, 30, 95],
   "MUSIC_CLUB(2ND_F_A19)": [165, 30, 95],
   "SPICMACAY_CLUB(2ND_F_A19)": [165, 30, 95],
   "DRAMA_CLUB(3-F_PEEPAL_MESS)": [195, 32, -20],
   "DANCE_CLUB(3-F_PEEPAL_MESS)": [195, 32, -20],
   "CULTURAL_SOCIETY_OFFICE(3-F_PEEPAL_MESS)": [195, 32, -20],
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

};
const roadNetworkNodes = {
   B19_G:[-55,12,110],
   B19_G1:[-60,12,104],
   B19_G2:[-90,12,114],
   B8_G:[-25,12,63],
   B8_G1:[-40,10,65],
   B11_G:[0,10,76],
   B23_G:[-115,10,110],
   B21_G:[-165,10,135],
   B22_G: [-190, 13, 125],
   B20_G: [-140, 15, 75],
   B16_G: [-116, 12, 65],
   B9_G: [30, 10, 40],
   B17_G: [90, 15, 24],
   B24_G:[140,10,1],
   B13_G: [-190, 10, 170],
   B14_G:[-125,10,178],
   B15_G:[-80,10,160],
   B18_G:[-20, 15, 135],
   B12_G:[40,12,94],
   B10_G: [75, 12, 85],
   B25_G: [140, 15, 60],
   VS1:[-275, 10, 175],
   VS2:[-255, 10, 160],
   VS3:[-285, 10, 100],
   Ac0:[195,15,-20],
   Ac2:[185,15,45],
   Ac1:[205,15,25],
   Ac3:[160,15,65],
   Ac4:[110,15,90],
   Ac5:[50,15,100],
   Ac6:[10,15,130],
   Ac7:[-30,15,150],
   Ac8:[-50,18,160],
   Ac9:[-90,15,170],
   Ac10:[-115,15,182],
   Ac11:[-170,15,197],
   Ac12:[-200,15,200],
   Ac13:[-230,15,205],
   Ac14:[-260,15,222],
   Ac15:[-290,9,235],
   Ac16:[-340,9,235],
   Ac17:[-350,9,170],
   Ac18:[-330,9,130],
   Ac19:[-320,9,100],
   Ac20:[-310,9,70],
   Fc0:[165,10,-33],
   Fc1:[160,10,-20],
   Fc2:[110,10,5],
   Fc3:[90,10,15],
   Fc4:[40,10,21],
   Fc5:[-60,10,40],
   Fc6:[-80,10,40],
   Fc7:[-130,10,60],
   Fc8:[-170,10,80],
   Fc9:[-200,10,95],
   Fc10:[-220,10,90],
   Fc11:[-240,10,80],
   Fc12:[-250,10,60],
   Fc13:[-290,10,54],
   Mc0:[-295, 10, 150],
   Mc1:[-275,10,130],
   Mc2:[-235,10,139],
   Mc3:[-204,10,147],
   Mc4:[-170,10,155],
   Mc5:[-140,10,145],
   Mc6:[-95,10,128],
   Mc7:[-75,10,128],
   Mc8:[-50,10,128],
   Mc9:[-30,15,120],
   Mc10:[-10,15,115],
   Mc11:[20,12,83],
   Mc12:[42,15,68],
   Mc13:[72,15,65],
   Mc14:[87,15,55],
   Mc15:[94,13,50],
   Mc16:[77,10,18],
   Bc0:[-184,10,133],
   Bc1:[-160,10,110],
   Bc2:[-150,10,110],
   Bc3:[-115,10,90],
   Bc4:[-100,10,80],
   Bc5:[-70,10,80],
   Bc6:[-55,10,70],
   Bc7:[-25,10,88],
   Bc8:[-10,10,68],
   Bc9:[10,10,61],
   Bc10:[40,15,59],
   Uc1:[137,10,30],
   Uc2:[180,10,10],
   Wc1:[-220,10,170],
};
const roadNetworkConnections = {
   B19_G:["B19_G1","B19_G2"],
   B19_G1:["B19_G","Bc5"],
   B19_G2:["B19_G","Mc6"],
   B8_G:["B8_G1"],
   B8_G1:["B8_G","Bc6"],
   B11_G:["Bc8"],
   B23_G:["Bc3"],
   B21_G:["Bc1"],
   B22_G:["Mc3","Fc10"],
   B20_G:["Fc7"],
   B16_G:["Fc7"],
   B9_G:["Fc4"],
   B17_G:["Mc16"],
   B24_G:["Fc2","Fc1"],
   B13_G:["Mc3"],
   B14_G:["Ac10"],
   B15_G:["Ac9"],
   B18_G:["Ac7"],
   B12_G:["Ac5","Mc12"],
   B10_G:["Ac4","Ac5"],
   B25_G:["Ac3"],
   VS1:["Mc1"],
   VS2:["Mc1"],
   VS3:["Mc1","Ac20"],
   Ac0:["Ac1"],
   Ac1: ["Ac2","Ac0"],
   Ac2: ["Ac1", "Ac3"],
   Ac3: ["Ac2", "Ac4","Uc1","B25_G"],
   Ac4: ["Ac5", "Ac3","Mc14","B10_G"],
   Ac5: ["Ac4", "Ac6","Mc12","B12_G","B10_G"],
   Ac6: ["Ac5", "Ac7"],
   Ac7: ["Ac6", "Ac8","B18_G"],
   Ac8: ["Ac7", "Ac9","Mc8"],
   Ac9: ["Ac8", "Ac10","Mc6","Ac9"],
   Ac10: ["Ac9", "Ac11","Mc5","B14_G"],
   Ac11: ["Ac10", "Ac12","Mc4"],
   Ac12: ["Ac11", "Ac13","Wc1"],
   Ac13: ["Ac12", "Ac14"],
   Ac14: ["Ac15", "Ac13"],
   Ac15: ["Ac16","Ac14"], // Connected to R6
   Ac16: ["Ac17","Ac15"], // Connected to R5
   Ac17: ["Ac16", "Ac18"],
   Ac18: ["Ac17", "Ac19"],
   Ac19: ["Ac18", "Ac20"],
   Ac20: ["Ac19","Fc13","VS3"],
   Fc0:["Fc1","Ac0","Uc2"],
   Fc1: ["Fc2","Fc0","B24_G"],
   Fc2: ["Fc1", "Fc3","B24_G"],
   Fc3: ["Fc2", "Fc4"],
   Fc4: ["Fc5", "Fc3","B9_G"],
   Fc5: ["Fc4", "Fc6","Bc6"],
   Fc6: ["Fc5", "Fc7","Bc5"],
   Fc7: ["Fc6", "Fc8","Bc3","B20_G","B16_G"],
   Fc8: ["Fc7", "Fc9","Bc1"],
   Fc9: ["Fc8", "Fc10"],
   Fc10: ["Fc9", "Fc11","Mc3","B22_G"],
   Fc11: ["Fc10", "Fc12"],
   Fc12: ["Fc11", "Fc13"],
   Fc13: ["Fc12","Ac20"],
   Mc0:["Mc1"],
   Mc1: ["Mc2","Mc0","VS1","VS2","VS3"],
   Mc2: ["Mc1", "Mc3"],
   Mc3: ["Mc2", "Mc4","Fc10","Bc0","Wc1","B13_G"],
   Mc4: ["Mc5", "Mc3","Ac11"],
   Mc5: ["Mc4", "Mc6","Ac10","Bc2"],
   Mc6: ["Mc5", "Mc7","Ac9","Bc4","B19_G2"],
   Mc7: ["Mc6", "Mc8"],
   Mc8: ["Mc7", "Mc9","Ac8"],
   Mc9: ["Mc8", "Mc10","Bc7"],
   Mc10: ["Mc9", "Mc11"],
   Mc11: ["Mc10", "Mc12"],
   Mc12: ["Mc11", "Mc13","Ac5","Bc10","B12_G"],
   Mc13: ["Mc12","Mc14"],
   Mc14: ["Mc15", "Mc13","Uc1","Ac4"],
   Mc15: ["Mc16","Mc14"], // Connected to R6
   Mc16: ["Mc15","Fc3","B17_G"], // Connected to R5
   Bc0:["Bc1","Mc3"],
   Bc1: ["Bc2","Bc0","Fc8","B21_G"],
   Bc2: ["Bc1", "Bc3","Mc5"],
   Bc3: ["Bc2", "Bc4","Fc7","B23_G"],
   Bc4: ["Bc5", "Bc3","Mc6"],
   Bc5: ["Bc4", "Bc6","Fc6","B19_G1"],
   Bc6: ["Bc5", "Bc7","Fc5","B8_G1"],
   Bc7: ["Bc6", "Bc8","Mc9"],
   Bc8: ["Bc7", "Bc9","B11_G"],
   Bc9: ["Bc8", "Bc10"],
   Bc10: ["Bc9","Mc12"],
   Uc1:["Uc2","Mc14","Ac3"],
   Uc2:["Uc1","Fc0"],
   Wc1:["Mc3","Ac12"],
};


// --- Helper Functions (calculateDistance, buildWeightedGraph, findNearestRoadNode) ---
// Keep these exactly as they were
// ... (Your existing helper functions)
function calculateDistance(pos1, pos2) {
  if (!pos1 || !pos2) {
    console.error("calculateDistance received invalid positions:", pos1, pos2);
    return Infinity;
  }
  const p1 = new THREE.Vector3(...pos1);
  const p2 = new THREE.Vector3(...pos2);
  return p1.distanceTo(p2);
}
function buildWeightedGraph(connections, coordinates) {
  const weightedGraph = {};
  for (const node in connections) {
    if (!weightedGraph[node]) {
      weightedGraph[node] = {};
    }
    for (const neighbor of connections[node]) {
      if (coordinates[node] && coordinates[neighbor]) {
        const distance = calculateDistance(
          coordinates[node],
          coordinates[neighbor]
        );
        weightedGraph[node][neighbor] = distance;
        if (!weightedGraph[neighbor]) {
          weightedGraph[neighbor] = {};
        }
        // Add the reverse connection if it doesn't exist and neighbor coords are valid
        if (coordinates[neighbor] && !weightedGraph[neighbor][node]) {
          weightedGraph[neighbor][node] = distance;
        }
      } else {
        console.warn(
          `Skipping connection from ${node} to ${neighbor}: Missing coordinates or invalid connection.`
        );
      }
    }
  }
  // Ensure all coordinate locations are at least nodes in the graph even if they have no connections
  for (const node in coordinates) {
    if (!weightedGraph[node]) {
      weightedGraph[node] = {};
    }
  }
  // console.log("Built Weighted Road Graph:", weightedGraph); // Less verbose logging
  return weightedGraph;
}
function findNearestRoadNode(position, roadNodes) {
  if (!position) return null;

  let nearestNode = null;
  let minDistance = Infinity;
  const positionVector = new THREE.Vector3(...position);

  for (const nodeId in roadNodes) {
    const nodePosition = roadNodes[nodeId];
    if (nodePosition) {
      const distance = positionVector.distanceTo(
        new THREE.Vector3(...nodePosition)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestNode = nodeId;
      }
    }
  }
//   console.log( // Less verbose logging
//     `Nearest road node to ${position} is ${nearestNode} (Distance: ${minDistance.toFixed(
//       2
//     )})`
//   );
  return nearestNode; // Returns the ID/name of the nearest node
}

// --- Dijkstra's Algorithm & PriorityQueue ---
// Keep these exactly as they were
// ... (Your existing dijkstra function)
function dijkstra(graph, startNode, endNode) {
  const distances = {};
  const visited = new Set();
  const predecessors = {};
  const pq = new PriorityQueue();

  for (const node in graph) {
    distances[node] = Infinity;
    predecessors[node] = null;
  }

  if (!graph[startNode]) {
    console.error(
      `Dijkstra: Start node "${startNode}" not found in the graph.`
    );
    return null;
  }
  if (!graph[endNode]) {
    console.error(`Dijkstra: End node "${endNode}" not found in the graph.`);
    return null;
  }

  distances[startNode] = 0;
  pq.enqueue(startNode, 0);

  while (!pq.isEmpty()) {
    const { element: currentNode, priority: currentDistance } = pq.dequeue();

    if (visited.has(currentNode)) {
      continue;
    }
    visited.add(currentNode);

    if (currentNode === endNode) {
      const path = [];
      let step = endNode;
      while (step) {
        path.unshift(step);
        step = predecessors[step];
      }
      return path; // Path found (sequence of node IDs)
    }

    const neighbors = graph[currentNode];
    if (neighbors) {
      for (const neighbor in neighbors) {
        const weight = neighbors[neighbor];
        const distance = currentDistance + weight;

        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          predecessors[neighbor] = currentNode;
          pq.enqueue(neighbor, distance);
        }
      }
    }
  }

  return null; // Path not found
}
// ... (Your existing PriorityQueue class)
class PriorityQueue {
  /* ... your PriorityQueue code ... */
  constructor() {
    this.elements = [];
  }
  enqueue(element, priority) {
    this.elements.push({ element, priority });
    this.bubbleUp(this.elements.length - 1);
  }
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    this.swap(0, this.elements.length - 1);
    const element = this.elements.pop();
    this.bubbleDown(0);
    return element;
  }
  isEmpty() {
    return this.elements.length === 0;
  }
  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }
  getLeftChildIndex(i) {
    return 2 * i + 1;
  }
  getRightChildIndex(i) {
    return 2 * i + 2;
  }
  swap(i1, i2) {
    [this.elements[i1], this.elements[i2]] = [
      this.elements[i2],
      this.elements[i1],
    ];
  }
  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.elements[parentIndex].priority > this.elements[index].priority) {
        this.swap(parentIndex, index);
        index = parentIndex;
      } else {
        break;
      }
    }
  }
  bubbleDown(index) {
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);
    let smallestIndex = index;
    if (
      leftChildIndex < this.elements.length &&
      this.elements[leftChildIndex].priority <
        this.elements[smallestIndex].priority
    ) {
      smallestIndex = leftChildIndex;
    }
    if (
      rightChildIndex < this.elements.length &&
      this.elements[rightChildIndex].priority <
        this.elements[smallestIndex].priority
    ) {
      smallestIndex = rightChildIndex;
    }
    if (smallestIndex !== index) {
      this.swap(index, smallestIndex);
      this.bubbleDown(smallestIndex);
    }
  }
}

// --- Three.js Components (BuildingMarker, PathNodeMarker, PathLine, Model, CameraControls) ---
// Keep these exactly as they were
// ... (Your existing BuildingMarker component)
function BuildingMarker({ position, color, isStart, isEnd }) {
  // Show slightly larger markers for start/end buildings
  const size = isStart || isEnd ? 6 : 6;
  const markerColor = isStart ? "#FFFF00" : isEnd ? "#FF00FF" : color || '#ffae00'; // Fallback color orange


  if (!position || !Array.isArray(position) || position.length !== 3) return null;


  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 16, 16]} />{" "}
      <meshBasicMaterial color={markerColor} depthTest={true} /> {/* Disable depth test to ensure visibility */}
    </mesh>
  );
}
// ... (Your existing PathNodeMarker component) - If you use it
function PathNodeMarker({ position, color = "hotpink", size = 4 }) {
  if (!position || !Array.isArray(position) || position.length !== 3) return null;
  return (
    <mesh position={position}>
      <boxGeometry args={[size, size, size]} />{" "}
      <meshBasicMaterial color={color} depthTest={false} /> {/* Disable depth test */}
    </mesh>
  );
}
// ... (Your existing PathLine component with useMemo fix)
function PathLine({ pathCoordinates }) {
  const points = useMemo(() => {
    if (!pathCoordinates || pathCoordinates.length < 2) {
      return [];
    }
    // Filter out any invalid points just in case
    const validPoints = pathCoordinates.filter(p => Array.isArray(p) && p.length === 3);
    if (validPoints.length < 2) return [];
    return validPoints.map((p) => new THREE.Vector3(...p));
  }, [pathCoordinates]);


  if (points.length < 2) {
    // console.log("PathLine: Not rendering, need at least 2 valid points.");
    return null;
  }


  // console.log("PathLine: Rendering with coordinates:", pathCoordinates);
  return (
    <Line
      points={points}
      color="cyan"
      lineWidth={11} // Thickness might need adjustment
      transparent
      opacity={0.8}
      depthTest={true} // Render path on top
    />
  );
}


function Model() {
  const { scene } = useGLTF('final.glb'); // !!! ENSURE THIS PATH IS CORRECT !!!
  return <primitive object={scene} />;
}
// ... (Your existing CameraControls component)


// --- CameraControls Component ---
function CameraControls({ targetPosition, pathCoordinates }) { // <-- ADD pathCoordinates prop
  const { camera, gl } = useThree();
  const controls = useRef();

  // --- Existing useEffect for initial position (no change) ---
  useEffect(() => {
    if (controls.current && !targetPosition && !pathCoordinates) { // Added !pathCoordinates condition
      // console.log("Setting initial camera");
      camera.position.set(0, 150, -200);
      controls.current.target.set(0, 0, 0);
      controls.current.update();
    }
    // Reset target on unmount or when targetPosition/path becomes null
    return () => {
        if (controls.current && !targetPosition && !pathCoordinates) { // Added !pathCoordinates condition
            // controls.current.target.set(0, 0, 0); // Optional: might interfere with fitting
        }
    };
  }, [camera, targetPosition, pathCoordinates]); // Added pathCoordinates dependency


  // --- Existing useEffect for animating to a single targetPosition (minor adjustment) ---
  useEffect(() => {
     // Only run this effect if we have a targetPosition BUT NO pathCoordinates
     // (The new effect below will handle fitting to the path)
     if (targetPosition && !pathCoordinates && controls.current && Array.isArray(targetPosition) && targetPosition.length === 3) {
       // ... (rest of the single-point focus animation logic remains the same) ...
       const endTarget = new THREE.Vector3(...targetPosition);
       const offset = camera.position.clone().sub(controls.current.target).normalize().multiplyScalar(100);
       let endPosition = endTarget.clone().add(offset);
       if (endPosition.y < endTarget.y + 20) endPosition.y = endTarget.y + 20;

       const positionChanged = camera.position.distanceTo(endPosition) > 1;
       const targetChanged = controls.current.target.distanceTo(endTarget) > 1;

       if (positionChanged || targetChanged) {
         controls.current.userData = {
             animating: true,
             targetPosition: endPosition,
             targetTarget: endTarget,
             startTime: Date.now()
         };
       } else {
         // Snap if close enough
         if (!camera.position.equals(endPosition)) camera.position.copy(endPosition);
         if (!controls.current.target.equals(endTarget)) controls.current.target.copy(endTarget);
         controls.current.update();
         if (controls.current.userData) controls.current.userData.animating = false;
       }

     } else if (!targetPosition && !pathCoordinates) { // If target is cleared AND no path, maybe stop animation?
       // Stop animation if target is cleared and there's no path to fit
       if (controls.current && controls.current.userData) {
         controls.current.userData.animating = false;
       }
     }
     // NOTE: Removed 'camera' from dependency array here as it causes loops if userData is set inside.
     // Relying on targetPosition and pathCoordinates to trigger updates.
  }, [targetPosition, pathCoordinates]); // DEPENDS on targetPosition AND pathCoordinates


  // --- NEW useEffect to Fit Path to View ---
  useEffect(() => {
    if (pathCoordinates && pathCoordinates.length >= 2 && controls.current && camera) {
      // console.log("Fitting path to view:", pathCoordinates);

      const box = new THREE.Box3();
      pathCoordinates.forEach(coord => {
        if (Array.isArray(coord) && coord.length === 3) {
          box.expandByPoint(new THREE.Vector3(...coord));
        }
      });

      if (box.isEmpty()) {
        console.warn("Cannot fit empty path bounds.");
        return; // Path is invalid or has no volume
      }

      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);

      // Handle cases where size is zero (e.g., path is just 2 identical points)
      if (size.x === 0 && size.y === 0 && size.z === 0) {
        // Fallback: Position directly above the single point
        const fallbackDistance = 50; // Adjust as needed
        const newPosition = new THREE.Vector3(center.x, center.y + fallbackDistance, center.z);
         controls.current.userData = {
             animating: true,
             targetPosition: newPosition,
             targetTarget: center, // Target is still the center
             startTime: Date.now()
         };
       return;
      }


      // --- Calculate distance needed to fit the box ---
      const maxDim = Math.max(size.x, size.y, size.z); // Use largest dimension as a starting point
      const fitHeightDistance = maxDim / (2 * Math.tan((camera.fov * Math.PI / 180) / 2));
      const fitWidthDistance = fitHeightDistance / camera.aspect;
      // The actual distance required depends on the larger dimension relative to FOV/aspect
      const distance = Math.max(fitHeightDistance, fitWidthDistance);

      // Add padding so it's not edge-to-edge
      const padding = 1.4; // Adjust this factor (1.2 = 20% padding, 1.5 = 50%)
      const finalDistance = distance * padding;

      // --- Determine camera position ---
      // Option 1: Use current camera direction (might be weird if looking straight down/up)
      // const direction = camera.position.clone().sub(controls.current.target).normalize();
      // Option 2: Use a fixed direction (e.g., slightly angled view) - often better
      const direction = new THREE.Vector3(0, 0.3, 1).normalize(); // Angled back and slightly up

      const newPosition = center.clone().add(direction.multiplyScalar(finalDistance));

       // Ensure camera doesn't go below a certain height relative to the center? Optional.
       if (newPosition.y < center.y + size.y * 0.1) { // e.g., min 10% of box height above center
           // newPosition.y = center.y + size.y * 0.1 + 10; // Add a small fixed value too
       }

      // --- Trigger the animation ---
      // console.log("New Cam Pos:", newPosition, "New Target:", center);
      controls.current.userData = {
          animating: true,
          targetPosition: newPosition,
          targetTarget: center,
          startTime: Date.now()
      };
    }
    // Note: 'camera' dependency might cause infinite loops if we modify camera state *inside* based on camera state.
    // Rely on pathCoordinates changing to trigger the fit.
  }, [pathCoordinates, camera, gl]); // Depend on pathCoordinates, camera, gl

  // --- useFrame for animation (no change) ---
  useFrame((state, delta) => {
     if (controls.current && controls.current.userData?.animating) {
        // ... (lerping logic remains exactly the same) ...
        const { targetPosition, targetTarget, startTime } = controls.current.userData;
        const duration = 1.0; // Animation duration
        const elapsed = (Date.now() - startTime) / 1000;
        const t = Math.min(elapsed / duration, 1.0);
        const easedT = t * t * (3 - 2 * t);

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
         controls.current.update(); // Apply damping
     }
  });

  // --- OrbitControls JSX (no change needed here from previous step) ---
  return (
    <OrbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.8} // Adjusted for smoother glide
      rotateSpeed={0.5}
      maxDistance={1000} // Keep increased zoom limit
      screenSpacePanning={false} // Keep consistent panning
      panSpeed={2.0} // Adjust if needed
    />
  );
}


// --- Main ModelView Component ---
function ModelView() {
  // Keep all state hooks exactly as they were
  const [fromBuilding, setFromBuilding] = useState("");
  const [toBuilding, setToBuilding] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [fromPosition, setFromPosition] = useState(null);
  const [toPosition, setToPosition] = useState(null);
  const [targetPosition, setTargetPosition] = useState(null); // For camera focus
  const [highlightedFromIndex, setHighlightedFromIndex] = useState(-1);
  const [highlightedToIndex, setHighlightedToIndex] = useState(-1);
  const [pathRoadNodes, setPathRoadNodes] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState(null);
  const [showBuildingMarkers, setShowBuildingMarkers] = useState(true); // Keep true to show selections
  const [showPathLine, setShowPathLine] = useState(false);
  const fromInputRef = useRef(null);
  const fromSuggestionsRef = useRef(null);
  const toInputRef = useRef(null);
  const toSuggestionsRef = useRef(null);



  // --- Graph calculation ---
  const weightedRoadGraph = useMemo(() => {
    // console.log("Building weighted road graph using useMemo...");
    return buildWeightedGraph(roadNetworkConnections, roadNetworkNodes);
  }, []); // Assuming roadNetworkNodes/Connections don't change

  // --- Handlers (filter, change, click, keydown, find path) ---
  // Keep all handler functions exactly as they were in the previous correct version
  // (No changes needed to the logic inside these handlers)
  const filterBuildingSuggestions = (value) => {
    if (!value) return [];
    const lowerValue = value.toLowerCase();
    // Prioritize exact matches or starts-with?
    const suggestions = Object.keys(buildingCoordinates)
        .filter(key => key.toLowerCase().includes(lowerValue))
        .sort((a, b) => {
            const aLower = a.toLowerCase();
            const bLower = b.toLowerCase();
            // Prioritize starting matches
            if (aLower.startsWith(lowerValue) && !bLower.startsWith(lowerValue)) return -1;
            if (!aLower.startsWith(lowerValue) && bLower.startsWith(lowerValue)) return 1;
            // Otherwise, sort alphabetically
            return aLower.localeCompare(bLower);
        });
    return suggestions.slice(0, 50); // Limit suggestions
  };
   const handleFromChange = useCallback((event) => {
    const value = event.target.value;
    setFromBuilding(value);
    setFromPosition(null);
    setPathRoadNodes(null);
    setPathCoordinates(null);
    setShowPathLine(false);
    setHighlightedFromIndex(-1);
    // Don't reset targetPosition here, let selection/path finding do it
    // setTargetPosition(null);


    if (value.length > 0) {
       const debounceTimeout = setTimeout(() => {
         setFromSuggestions(filterBuildingSuggestions(value));
       }, 200); // Faster debounce
       return () => clearTimeout(debounceTimeout);
    } else {
      setFromSuggestions([]);
      setToSuggestions([]);
    }
  }, []);
  const handleToChange = useCallback((event) => {
    const value = event.target.value;
    setToBuilding(value);
    setToPosition(null);
    setPathRoadNodes(null);
    setPathCoordinates(null);
    setShowPathLine(false);
    setHighlightedToIndex(-1);
    // Don't reset targetPosition here
    // setTargetPosition(null);


    if (value.length > 0) {
       const debounceTimeout = setTimeout(() => {
         setToSuggestions(filterBuildingSuggestions(value));
       }, 200);
      return () => clearTimeout(debounceTimeout);
    } else {
      setSuggestions([]);
    }
  }, []);
  const handleFromSuggestionClick = useCallback((suggestion) => {
    setFromBuilding(suggestion);
    setFromSuggestions([]);
    const position = buildingCoordinates[suggestion];
    if (position) {
      setFromPosition(position);
      setTargetPosition(position); // Focus camera on selected 'from' building
      setHighlightedFromIndex(-1);
    } else {
        console.warn(`Coordinates not found for suggestion: ${suggestion}`);
        setFromPosition(null);
    }
  }, []);
  const handleToSuggestionClick = useCallback((suggestion) => {
    setToBuilding(suggestion);
    setToSuggestions([]);
    const position = buildingCoordinates[suggestion];
    if (position) {
      setToPosition(position);
      setTargetPosition(position); // Focus camera on selected 'to' building
      setHighlightedToIndex(-1);
    } else {
        console.warn(`Coordinates not found for suggestion: ${suggestion}`);
        setToPosition(null);
    }
  }, []);
  const handleFromKeyDown = (e) => {
    if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedFromIndex((prevIndex) =>
            fromSuggestions.length > 0
                ? (prevIndex + 1) % fromSuggestions.length // Wrap around
                : -1
        );
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedFromIndex((prevIndex) =>
            fromSuggestions.length > 0
                ? (prevIndex - 1 + fromSuggestions.length) % fromSuggestions.length // Wrap around
                : -1
        );
    } else if (e.key === "Enter") {
        if (highlightedFromIndex >= 0 && fromSuggestions[highlightedFromIndex]) {
            e.preventDefault();
            handleFromSuggestionClick(fromSuggestions[highlightedFromIndex]);
        } else if (fromSuggestions.length > 0) {
             // Allow selecting first suggestion on Enter if none highlighted
             e.preventDefault();
             handleFromSuggestionClick(fromSuggestions[0]);
        }
        // Allow Enter to potentially trigger form submission or next field if needed
    } else if (e.key === 'Escape') {
        setFromSuggestions([]); // Hide suggestions on Escape
        setHighlightedFromIndex(-1);
    }
   };
  const handleToKeyDown = (e) => {
     if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedToIndex((prevIndex) =>
            toSuggestions.length > 0
                ? (prevIndex + 1) % toSuggestions.length // Wrap around
                : -1
        );
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedToIndex((prevIndex) =>
            toSuggestions.length > 0
                ? (prevIndex - 1 + toSuggestions.length) % toSuggestions.length // Wrap around
                : -1
        );
    } else if (e.key === "Enter") {
        if (highlightedToIndex >= 0 && toSuggestions[highlightedToIndex]) {
            e.preventDefault();
            handleToSuggestionClick(toSuggestions[highlightedToIndex]);
            // If 'from' is also set, trigger find path
             if (fromPosition) {
                 // Delay slightly to allow state update? Or rely on useCallback deps.
                 // setTimeout(() => handleFindPath(), 0); // Risky
                 // Check if fromBuilding is valid before calling
                  const startBuildingCoords = buildingCoordinates[fromBuilding];
                  if(startBuildingCoords) {
                     handleFindPath();
                  }
             }
        } else if (toSuggestions.length > 0) {
            // Allow selecting first suggestion on Enter if none highlighted
            e.preventDefault();
            handleToSuggestionClick(toSuggestions[0]);
             if (fromPosition) {
                 const startBuildingCoords = buildingCoordinates[fromBuilding];
                 if(startBuildingCoords) {
                    handleFindPath();
                 }
            }
        }
         // Allow Enter to potentially trigger form submission or next field if needed
    } else if (e.key === 'Escape') {
        setToSuggestions([]); // Hide suggestions on Escape
        setHighlightedToIndex(-1);
    }
  };
  const handleFindPath = useCallback(() => {
    setPathRoadNodes(null);
    setPathCoordinates(null);
    setShowPathLine(false);
    // setTargetPosition(null); // Don't reset target, focus on destination


    const startBuildingName = fromBuilding;
    const endBuildingName = toBuilding;
    const startBuildingCoords = buildingCoordinates[startBuildingName];
    const endBuildingCoords = buildingCoordinates[endBuildingName];


    // console.log(
    //   `Attempting to find path: From="${startBuildingName}" [${startBuildingCoords}] to "${endBuildingName}" [${endBuildingCoords}]`
    // );


    if (!startBuildingCoords || !endBuildingCoords) {
        //  console.error("Missing coordinates for start or end building.");
        //  alert("Please ensure both 'From' and 'To' locations are selected correctly.");
         return;
     }
     if (startBuildingName === endBuildingName) {
         // alert("Start and end locations are the same."); // Maybe just show the marker
         setFromPosition(startBuildingCoords);
         setToPosition(null); // Ensure only one marker if same
         setTargetPosition(startBuildingCoords);
         return;
     }


    const startRoadNodeId = findNearestRoadNode(startBuildingCoords, roadNetworkNodes);
    const endRoadNodeId = findNearestRoadNode(endBuildingCoords, roadNetworkNodes);


    if (!startRoadNodeId || !endRoadNodeId) {
      console.error("Could not find nearest road node for start or end building.");
      alert("Could not find a connection to the road network for the selected buildings.");
      setFromPosition(startBuildingCoords); // Still show selected markers
      setToPosition(endBuildingCoords);
      setTargetPosition(endBuildingCoords); // Focus on attempted destination
      return;
    }


     if (startRoadNodeId === endRoadNodeId) {
         console.warn("Start and end buildings map to the same nearest road node:", startRoadNodeId);
         // Direct path between buildings
         const directPath = [startBuildingCoords, endBuildingCoords];
         setPathCoordinates(directPath);
         setShowPathLine(true);
         setTargetPosition(endBuildingCoords);
         setPathRoadNodes([startRoadNodeId]); // Indicate the single node involved
         return;
     }


    // console.log(`Routing from "${startRoadNodeId}" to "${endRoadNodeId}"`);
    if (!weightedRoadGraph) {
        console.error("Road network graph is not built yet.");
        alert("Error: Road network data is not ready.");
        return;
    }


    const foundRoadPathIds = dijkstra(weightedRoadGraph, startRoadNodeId, endRoadNodeId);
    // console.log("Dijkstra result (Road Node IDs):", foundRoadPathIds);


    if (foundRoadPathIds && foundRoadPathIds.length > 0) {
      // console.log("Road path found:", foundRoadPathIds);
      setPathRoadNodes(foundRoadPathIds);


      let coords = [startBuildingCoords];
      foundRoadPathIds.forEach((nodeId) => {
        if (roadNetworkNodes[nodeId]) {
          coords.push(roadNetworkNodes[nodeId]);
        } else {
          console.warn(`Road node "${nodeId}" in path not found in roadNetworkNodes!`);
        }
      });
      coords.push(endBuildingCoords);


      // Remove consecutive duplicates
      coords = coords.filter((point, index, arr) => {
          if (index === 0) return true;
          const prev = arr[index - 1];
          return !(point[0] === prev[0] && point[1] === prev[1] && point[2] === prev[2]);
      });


      // console.log("Generated path coordinates for line:", coords);
      if (coords.length >= 2) {
          setPathCoordinates(coords);
          setShowPathLine(true);
          setTargetPosition(endBuildingCoords); // Focus on destination
      } else {
          console.warn("Path coordinates resulted in less than 2 points.");
           setPathCoordinates(null);
           setShowPathLine(false);
           alert("Could not generate a valid path visualization.");
           setFromPosition(startBuildingCoords); // Show markers
           setToPosition(endBuildingCoords);
           setTargetPosition(endBuildingCoords);
      }
    } else {
      console.warn(`Path not found between road nodes "${startRoadNodeId}" and "${endRoadNodeId}".`);
      setPathRoadNodes(null);
      setPathCoordinates(null);
      setShowPathLine(false);
      alert(`Could not find a route on the road network between the selected locations.`);
       setFromPosition(startBuildingCoords); // Show markers
       setToPosition(endBuildingCoords);
       setTargetPosition(endBuildingCoords); // Focus on attempted destination
    }
  }, [fromBuilding, toBuilding, weightedRoadGraph, roadNetworkNodes, buildingCoordinates, fromPosition]); // Added fromPosition dependency for Enter key submit in 'To' field


  // --- Effect for Marker/Path Visibility ---
  // Keep this useEffect exactly as it was - it handles showing/hiding based on state
   // --- Effect for Marker/Path Visibility ONLY ---
useEffect(() => {
  // Set visibility based on state
  setShowBuildingMarkers(!!fromPosition || !!toPosition || (pathCoordinates && pathCoordinates.length >= 2));
  setShowPathLine(pathCoordinates && pathCoordinates.length >= 2);

  // No cleanup needed specifically for this visibility logic
  // return () => { /* cleanup if needed */ };

}, [fromPosition, toPosition, pathCoordinates]); // Correct dependencies for visibility



// --- NEW Effect for Click Outside ---
useEffect(() => {
  // Define the handler inside the effect so it captures the correct state setters
  const handleClickOutside = (event) => {
    // Check 'From' suggestions
    if (
      fromSuggestionsRef.current &&
      !fromSuggestionsRef.current.contains(event.target) &&
      fromInputRef.current &&
      !fromInputRef.current.contains(event.target)
    ) {
      // console.log("Closing FROM suggestions via click outside"); // Keep for debugging if needed
      setFromSuggestions([]);
      setHighlightedFromIndex(-1); // Re-enable this reset
    }

    // Check 'To' suggestions
    if (
      toSuggestionsRef.current &&
      !toSuggestionsRef.current.contains(event.target) &&
      toInputRef.current &&
      !toInputRef.current.contains(event.target)
    ) {
      // console.log("Closing TO suggestions via click outside"); // Keep for debugging if needed
      setToSuggestions([]);
      setHighlightedToIndex(-1); // Re-enable this reset
    }
  };

  // Add listener only if suggestions ARE VISIBLE
  if (fromSuggestions.length > 0 || toSuggestions.length > 0) {
    // console.log("Adding mousedown listener"); // Keep for debugging if needed
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    // Optional: Explicitly remove listener if no suggestions are open
    // Though the cleanup function should handle this anyway.
    // console.log("No suggestions open, ensuring listener is removed.");
    document.removeEventListener('mousedown', handleClickOutside);
  }

  // Cleanup function: ALWAYS remove the listener when the effect re-runs or unmounts
  return () => {
    // console.log("Removing mousedown listener (cleanup)"); // Keep for debugging if needed
    document.removeEventListener('mousedown', handleClickOutside);
  };

  // DEPENDENCIES: Rerun this effect *only* when the suggestion lists change visibility
}, [fromSuggestions.length, toSuggestions.length]); // <<< CORRECT DEPENDENCIES FOR THIS LOGIC
// Note: React state setters (setFromSuggestions, etc.) are stable and don't need to be dependencies.
// Refs (.current) also don't trigger effects when they change.


  // --- CSS Styles ---
  // Use React's style objects or define CSS classes
  const findPathButtonDisabled =
      !fromBuilding ||
      !toBuilding ||
      !buildingCoordinates[fromBuilding] ||
      !buildingCoordinates[toBuilding];


  return (
    // Added CSS classes for responsive layout
    <div className="model-view-container">
      <div className="sidebar">
        <h2 className="sidebar-title">Find Your Way</h2>
        <div className="input-container">
          <input
            ref={fromInputRef}
            type="text"
            value={fromBuilding}
            onChange={handleFromChange}
            onKeyDown={handleFromKeyDown}
            placeholder="From Location"
            className="search-bar"
            autoComplete="off"
          />
          {fromSuggestions.length > 0 && (
            <ul ref={fromSuggestionsRef} className="suggestions-list">
              {fromSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  onClick={() => handleFromSuggestionClick(suggestion)}
                  className={`suggestion-item ${highlightedFromIndex === index ? 'highlighted' : ''}`}
                  title={suggestion} // Add title for long names
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="input-container">
          <input
            ref={toInputRef}
            type="text"
            value={toBuilding}
            onChange={handleToChange}
            onKeyDown={handleToKeyDown}
            placeholder="To Location"
            className="search-bar"
            autoComplete="off"
          />
          {toSuggestions.length > 0 && (
            <ul ref={toSuggestionsRef} className="suggestions-list">
              {toSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  onClick={() => handleToSuggestionClick(suggestion)}
                  className={`suggestion-item ${highlightedToIndex === index ? 'highlighted' : ''}`}
                   title={suggestion} // Add title for long names
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleFindPath}
          className="find-path-button"
          disabled={findPathButtonDisabled}
        >
          Find Path
        </button>

        {/* Path Info - Only show if a path is actually displayed */}
        {showPathLine && pathRoadNodes && pathRoadNodes.length > 0 && (
          <div className="path-info">
            <h4 className="path-info-title">
              Showing Route
            </h4>
            {/* Optional: Display nodes for debugging */}
             <ul className="path-steps">
              <li>START:Yellow Ball</li>
              {/* {pathRoadNodes.map((step, index) => (
                <li key={index}>{`${index + 1}. Node: ${step}`}</li>
              ))} */}
               <li>END:Pink Ball</li>
            </ul>
          </div>
        )}
      </div>

      <div className="canvas-container">
        <Canvas
           shadows // Enable shadows
           camera={{ position: [-50, 180, 250], fov: 50,near: 0.1,far: 5000 }} // Initial camera settings
           // Performance optimizations
           // frameloop="demand" // Only render on change - might interfere with animation? Test needed.
        >
          {/* Lighting Setup */}
          <ambientLight intensity={0.6} />
          <directionalLight
             position={[100, 150, 100]} // Angled sun light
             intensity={1.0}
             castShadow
             shadow-mapSize-width={1024}
             shadow-mapSize-height={1024}
             shadow-camera-far={500}
             shadow-camera-left={-200}
             shadow-camera-right={200}
             shadow-camera-top={200}
             shadow-camera-bottom={-200}
          />
          <pointLight position={[-100, 50, -100]} intensity={0.3} />

          {/* Environment & Fog */}
          {/* <color attach="background" args={['#ddeeff']} /> */}
          {/* <fog attach="fog" args={['#ddeeff', 200, 700]} /> */}


          {/* Suspense for Model Loading */}
          <React.Suspense fallback={
             // Simple loading indicator
             <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color="orange" wireframe={true} />
             </mesh>
          }>
             <Model />
             {/* Optional: Add a ground plane if your model doesn't have one */}
              {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                  <planeGeometry args={[1000, 1000]} />
                  <shadowMaterial opacity={0.3} />
              </mesh> */}
          </React.Suspense>

           {/* Markers */}
           {showBuildingMarkers && fromPosition && (
              <BuildingMarker position={fromPosition} isStart={true} />
            )}
            {/* Show end marker if 'to' is selected, regardless of path status, but hide if it's same as 'from'*/}
            {showBuildingMarkers && toPosition && fromPosition !== toPosition && (
              <BuildingMarker position={toPosition} isEnd={true} />
            )}


           {/* Path Line */}
           {showPathLine && ( // Use the state variable directly
             <PathLine pathCoordinates={pathCoordinates} />
           )}


          {/* Camera Controls - MUST be inside Canvas */}
          <CameraControls targetPosition={targetPosition} pathCoordinates={pathCoordinates} />

        </Canvas>
      </div>

      {/* --- CSS Styles for Responsiveness --- */}
      {/* Styles optimized for scrolling and layout */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%; /* Ensure html/body take full height */
          font-family: sans-serif;
          overflow-x: hidden; /* Prevent horizontal scroll globally */
        }

        #__next { /* If using Next.js */
           height: 100%;
        }


        .model-view-container {
          display: flex;
          /* Default direction is row for desktop */
          flex-direction: row;
          width: 100%;
          min-height: 100vh; /* Ensure container takes at least full viewport height */
          height: 100%; /* Try to take full available height */
          background-color: #eef; /* Light background */
        }

        .sidebar {
          width: 300px; /* Fixed width for desktop sidebar */
          padding: 20px;
          background-color: #ffffff;
          /* Desktop sidebar always takes full height */
          height: 100vh;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          overflow-y: auto; /* Allow sidebar content to scroll */
          box-sizing: border-box;
          flex-shrink: 0; /* Prevent sidebar from shrinking */
          z-index: 10; /* Keep sidebar above canvas */
        }

        .sidebar-title {
          color: #333;
          text-align: center;
          margin-top: 0;
          margin-bottom: 25px;
          font-size: 1.4em;
          flex-shrink: 0; /* Prevent title from shrinking */
        }

        .input-container {
          margin-bottom: 15px;
          position: relative;
          flex-shrink: 0; /* Prevent inputs from shrinking */
        }

        .search-bar {
          width: 100%;
          padding: 10px 12px;
          font-size: 1rem;
          border-radius: 4px;
          border: 1px solid #ccc;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
          outline: none;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }
        .search-bar:focus {
          border-color: #007bff;
        }

        .suggestions-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: white;
          border: 1px solid #ccc;
          border-top: none;
          border-radius: 0 0 4px 4px;
          list-style: none;
          padding: 0;
          margin: 0;
          z-index: 100;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-height: 200px; /* Limit suggestion list height */
          overflow-y: auto;
        }

        .suggestion-item {
          padding: 8px 12px;
          cursor: pointer;
          border-bottom: 1px solid #eee;
          font-size: 0.9rem;
          color: #555;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .suggestion-item:last-child {
          border-bottom: none;
        }
        .suggestion-item.highlighted,
        .suggestion-item:hover {
          background-color: #e9ecef;
        }


        .find-path-button {
          width: 100%;
          padding: 10px 15px;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 4px;
          border: none;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          transition: background-color 0.2s ease, opacity 0.2s ease;
          margin-top: 10px;
           flex-shrink: 0; /* Prevent button from shrinking */
        }
        .find-path-button:hover:not(:disabled) {
          background-color: #0056b3;
        }
        .find-path-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
          opacity: 0.7;
        }

         .path-info {
            margin-top: 20px;
            padding: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            background-color: #f9f9f9;
             flex-shrink: 0; /* Prevent info box from shrinking */
             overflow: hidden; /* Prevent text overflow issues */
        }
         .path-info-title {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 1em;
            font-weight: bold;
        }
         .path-steps {
            list-style: none;
            padding: 0;
            margin: 0;
            font-size: 0.85em;
            color: #666;
            max-height: 100px; /* Limit height */
            overflow-y: auto; /* Add scroll if many steps */
        }
         .path-steps li {
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }


        .canvas-container {
          flex-grow: 1; /* Canvas takes remaining width */
          height: 100vh; /* Canvas always tries to take full viewport height */
          overflow: hidden; /* Prevent canvas internal overflow issues */
          position: relative; /* Needed for potential overlays */
        }

        /* --- Responsive Styles for Mobile --- */
        @media (max-width: 768px) {
          .model-view-container {
            flex-direction: column; /* Stack sidebar on top of canvas */
             height: 100vh;
            /* Keep min-height as a fallback if needed, but height: 100vh is key */
            min-height: 100vh;
            /* Prevent scrolling on the main container itself */
            overflow: hidden;
          }

          .sidebar {
            width: 100%; /* Full width */
            height: auto; /* Let height be determined by content */
            max-height: 50vh; /* Limit sidebar height (adjust if needed) */
            overflow-y: auto; /* Allow sidebar content scroll */
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid #ccc;
            flex-shrink: 0; /* Prevent sidebar from shrinking vertically */
            z-index: 11; /* Ensure sidebar is definitely above canvas */
          }

          .canvas-container {
            width: 100%; /* Full width */
             /* Crucially, set a significant minimum height for the map area */
             /* Let flexbox handle the actual height */
             min-height: 60vh; /* Ensure map has decent space, adjust as needed */
             height: auto; /* Allow it to take space */
             flex-grow: 1; /* Important: Allow canvas to take remaining space */
          }

           .suggestions-list {
                max-height: 150px; /* Slightly smaller suggestion list on mobile */
            }
        }
      `}</style>
    </div>
  );
}

export default ModelView;