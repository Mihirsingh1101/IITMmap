// src/components/modelView.jsx
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import Sidebar from "./Sidebar";
import ThreeScene from "./ThreeScene";
import { campusMapData } from "../data/mapData";
import {
  buildWeightedGraph,
  findNearestRoadNode,
  dijkstra,
} from "../utils/graphUtils";

const MODEL_PATHS = {
  North: '/final.glb',
  South: 'mapm.glb',
};

function ModelView({ currentCampus = 'North' }) {
  const [fromBuilding, setFromBuilding] = useState("");
  const [toBuilding, setToBuilding] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [fromPosition, setFromPosition] = useState(null);
  const [toPosition, setToPosition] = useState(null);
  const [targetPosition, setTargetPosition] = useState(null);
  const [highlightedFromIndex, setHighlightedFromIndex] = useState(-1);
  const [highlightedToIndex, setHighlightedToIndex] = useState(-1);
  const [pathRoadNodes, setPathRoadNodes] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState(null);
  const [showBuildingMarkers, setShowBuildingMarkers] = useState(true);
  const [showPathLine, setShowPathLine] = useState(false);

  const fromInputRef = useRef(null);
  const fromSuggestionsRef = useRef(null);
  const toInputRef = useRef(null);
  const toSuggestionsRef = useRef(null);

  const activeMapData = useMemo(() => {
    console.log("ModelView: Active campus data for:", currentCampus);
    return campusMapData[currentCampus] || campusMapData['North'];
  }, [currentCampus]);

  const {
    buildingCoordinates,
    roadNetworkNodes,
    roadNetworkConnections
  } = activeMapData;

  const modelPath = useMemo(() => MODEL_PATHS[currentCampus] || MODEL_PATHS['North'], [currentCampus]);

  const weightedRoadGraph = useMemo(() => {
    console.log(`ModelView: Rebuilding graph for ${currentCampus} campus.`);
    if (!roadNetworkConnections || !roadNetworkNodes || Object.keys(roadNetworkNodes).length === 0) {
        console.warn(`ModelView: Road network data missing or empty for ${currentCampus} campus.`);
        return {};
    }
    return buildWeightedGraph(roadNetworkConnections, roadNetworkNodes);
  }, [roadNetworkConnections, roadNetworkNodes, currentCampus]);

  useEffect(() => {
    console.log(`ModelView: Campus changed to ${currentCampus}. Resetting form and path state.`);
    setFromBuilding("");
    setToBuilding("");
    setFromPosition(null);
    setToPosition(null);
    setPathRoadNodes(null);
    setPathCoordinates(null);
    setShowPathLine(false);
    setTargetPosition(null);
    setFromSuggestions([]);
    setToSuggestions([]);
    setHighlightedFromIndex(-1);
    setHighlightedToIndex(-1);
    if (fromInputRef.current) fromInputRef.current.value = ""; // Clear input fields directly
    if (toInputRef.current) toInputRef.current.value = "";
  }, [currentCampus]);


  const filterBuildingSuggestions = useCallback((value) => {
    if (!value || !buildingCoordinates || Object.keys(buildingCoordinates).length === 0) return [];
    const lowerValue = value.toLowerCase();
    const suggestions = Object.keys(buildingCoordinates)
      .filter((key) => key.toLowerCase().includes(lowerValue))
      .sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        if (aLower.startsWith(lowerValue) && !bLower.startsWith(lowerValue)) return -1;
        if (!aLower.startsWith(lowerValue) && bLower.startsWith(lowerValue)) return 1;
        return aLower.localeCompare(bLower);
      });
    return suggestions.slice(0, 50);
  }, [buildingCoordinates]);

  const commonChangeHandler = (value, setter, suggestionsSetter, positionSetter, highlightSetter) => {
    setter(value);
    positionSetter(null);
    setPathRoadNodes(null);
    setPathCoordinates(null);
    setShowPathLine(false);
    highlightSetter(-1);

    if (value.length > 0) {
      const debounceTimeout = setTimeout(() => {
        suggestionsSetter(filterBuildingSuggestions(value));
      }, 200);
      return () => clearTimeout(debounceTimeout);
    } else {
      suggestionsSetter([]);
    }
  };

  const handleFromChange = useCallback((event) => {
    commonChangeHandler(event.target.value, setFromBuilding, setFromSuggestions, setFromPosition, setHighlightedFromIndex);
  }, [filterBuildingSuggestions]);

  const handleToChange = useCallback((event) => {
    commonChangeHandler(event.target.value, setToBuilding, setToSuggestions, setToPosition, setHighlightedToIndex);
  }, [filterBuildingSuggestions]);

  const commonSuggestionClickHandler = (suggestion, buildingSetter, suggestionsSetter, positionSetter, highlightSetter) => {
    buildingSetter(suggestion);
    suggestionsSetter([]);
    const position = buildingCoordinates[suggestion];
    if (position) {
      positionSetter(position);
      setTargetPosition(position);
    } else {
      positionSetter(null);
    }
    highlightSetter(-1);
  };

  const handleFromSuggestionClick = useCallback((suggestion) => {
    commonSuggestionClickHandler(suggestion, setFromBuilding, setFromSuggestions, setFromPosition, setHighlightedFromIndex);
  }, [buildingCoordinates]);

  const handleToSuggestionClick = useCallback((suggestion) => {
    commonSuggestionClickHandler(suggestion, setToBuilding, setToSuggestions, setToPosition, setHighlightedToIndex);
  }, [buildingCoordinates]);

  // MOVED handleFindPath UP
  const handleFindPath = useCallback(() => {
    console.log("ModelView: handleFindPath triggered.");
    setPathRoadNodes(null);
    setPathCoordinates(null);
    setShowPathLine(false);

    const startBuildingName = fromBuilding;
    const endBuildingName = toBuilding;

    if (!buildingCoordinates || Object.keys(buildingCoordinates).length === 0) {
      alert(`Building data not available for ${currentCampus}. Please select a campus with data.`);
      return;
    }

    const startBuildingCoords = buildingCoordinates[startBuildingName];
    const endBuildingCoords = buildingCoordinates[endBuildingName];

    if (!startBuildingCoords || !endBuildingCoords) {
      alert(`Please ensure both 'From' and 'To' locations are selected correctly from the ${currentCampus} campus list.`);
      return;
    }
    if (startBuildingName === endBuildingName) {
      setFromPosition(startBuildingCoords);
      setToPosition(null); // Clear 'to' if same
      setTargetPosition(startBuildingCoords);
      setPathCoordinates(null);
      setShowPathLine(false);
      return;
    }

    if (!roadNetworkNodes || Object.keys(roadNetworkNodes).length === 0) {
        alert(`Road network data is not available for ${currentCampus} campus. Cannot find path.`);
        return;
    }
    const startRoadNodeId = findNearestRoadNode(startBuildingCoords, roadNetworkNodes);
    const endRoadNodeId = findNearestRoadNode(endBuildingCoords, roadNetworkNodes);

    if (!startRoadNodeId || !endRoadNodeId) {
      alert(`Could not find a connection to the road network for selected buildings on ${currentCampus} campus.`);
      setFromPosition(startBuildingCoords);
      setToPosition(endBuildingCoords);
      setTargetPosition(endBuildingCoords); // Focus on destination attempt
      return;
    }

    if (startRoadNodeId === endRoadNodeId) {
      const directPath = [startBuildingCoords, endBuildingCoords];
      setPathCoordinates(directPath);
      setShowPathLine(true);
      setPathRoadNodes([startRoadNodeId]);
      setTargetPosition(null); // Path fitting will handle camera
      return;
    }

    if (!weightedRoadGraph || Object.keys(weightedRoadGraph).length === 0) {
      alert(`Error: Road network graph is not ready for ${currentCampus} campus. It might be empty or still building.`);
      return;
    }

    const foundRoadPathIds = dijkstra(weightedRoadGraph, startRoadNodeId, endRoadNodeId);

    if (foundRoadPathIds && foundRoadPathIds.length > 0) {
      setPathRoadNodes(foundRoadPathIds);
      let coords = [startBuildingCoords];
      foundRoadPathIds.forEach((nodeId) => {
        if (roadNetworkNodes[nodeId]) {
          coords.push(roadNetworkNodes[nodeId]);
        }
      });
      coords.push(endBuildingCoords);

      coords = coords.filter((point, index, arr) => {
        if (index === 0) return true;
        const prev = arr[index - 1];
        return !(point[0] === prev[0] && point[1] === prev[1] && point[2] === prev[2]);
      });

      if (coords.length >= 2) {
        setPathCoordinates(coords);
        setShowPathLine(true);
        setTargetPosition(null);
      } else {
        alert("Could not generate a valid path visualization (not enough unique points).");
        setPathCoordinates(null); setShowPathLine(false);
        setFromPosition(startBuildingCoords); setToPosition(endBuildingCoords);
        setTargetPosition(endBuildingCoords);
      }
    } else {
      alert(`Could not find a route on the road network between selected locations on ${currentCampus} campus.`);
      setPathRoadNodes(null); setPathCoordinates(null); setShowPathLine(false);
      setFromPosition(startBuildingCoords); setToPosition(endBuildingCoords);
      setTargetPosition(endBuildingCoords);
    }
  }, [fromBuilding, toBuilding, buildingCoordinates, roadNetworkNodes, weightedRoadGraph, currentCampus]);


  const commonKeyDownHandler = (e, suggestions, highlightedIndex, setHighlightedIndex, handleSuggestionClick, otherPositionSet, otherBuildingName) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        suggestions.length > 0 ? (prevIndex + 1) % suggestions.length : -1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        suggestions.length > 0 ? (prevIndex - 1 + suggestions.length) % suggestions.length : -1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      let suggestionToUse = null;
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        suggestionToUse = suggestions[highlightedIndex];
      } else if (suggestions.length > 0) {
        suggestionToUse = suggestions[0]; // Default to first if none highlighted
      }

      if (suggestionToUse) {
          handleSuggestionClick(suggestionToUse);
          // Check if the other field is set and the building name is valid for the current campus
          if (otherPositionSet && buildingCoordinates && buildingCoordinates[otherBuildingName]) {
              // Trigger find path after a short delay to allow state update from suggestion click
              setTimeout(() => handleFindPath(), 0);
          }
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (suggestions === fromSuggestions) { setFromSuggestions([]); setHighlightedFromIndex(-1); }
      else { setToSuggestions([]); setHighlightedToIndex(-1); }
    }
  };

  const handleFromKeyDown = useCallback((e) => {
    commonKeyDownHandler(e, fromSuggestions, highlightedFromIndex, setHighlightedFromIndex, handleFromSuggestionClick, !!toPosition, toBuilding);
  }, [fromSuggestions, highlightedFromIndex, handleFromSuggestionClick, toPosition, toBuilding, buildingCoordinates, handleFindPath]);

  const handleToKeyDown = useCallback((e) => {
     commonKeyDownHandler(e, toSuggestions, highlightedToIndex, setHighlightedToIndex, handleToSuggestionClick, !!fromPosition, fromBuilding);
  }, [toSuggestions, highlightedToIndex, handleToSuggestionClick, fromPosition, fromBuilding, buildingCoordinates, handleFindPath]);


  useEffect(() => {
    setShowBuildingMarkers(!!fromPosition || !!toPosition || (pathCoordinates && pathCoordinates.length >=2));
    setShowPathLine(!!pathCoordinates && pathCoordinates.length >= 2);
  }, [fromPosition, toPosition, pathCoordinates]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromSuggestionsRef.current && !fromSuggestionsRef.current.contains(event.target) &&
          fromInputRef.current && !fromInputRef.current.contains(event.target)) {
        setFromSuggestions([]); setHighlightedFromIndex(-1);
      }
      if (toSuggestionsRef.current && !toSuggestionsRef.current.contains(event.target) &&
          toInputRef.current && !toInputRef.current.contains(event.target)) {
        setToSuggestions([]); setHighlightedToIndex(-1);
      }
    };
    if (fromSuggestions.length > 0 || toSuggestions.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, [fromSuggestions.length, toSuggestions.length]);

  const findPathButtonDisabled = useMemo(() => (
    !fromBuilding || !toBuilding ||
    !buildingCoordinates || // Check if buildingCoordinates itself is available
    !buildingCoordinates[fromBuilding] ||
    !buildingCoordinates[toBuilding]
  ), [fromBuilding, toBuilding, buildingCoordinates]);

  return (
    <div className="model-view-container flex flex-col md:flex-row w-full h-full bg-gray-100">
      <Sidebar
        fromBuilding={fromBuilding}
        toBuilding={toBuilding}
        fromSuggestions={fromSuggestions}
        toSuggestions={toSuggestions}
        handleFromChange={handleFromChange}
        handleToChange={handleToChange}
        handleFromKeyDown={handleFromKeyDown}
        handleToKeyDown={handleToKeyDown}
        handleFromSuggestionClick={handleFromSuggestionClick}
        handleToSuggestionClick={handleToSuggestionClick}
        handleFindPath={handleFindPath}
        findPathButtonDisabled={findPathButtonDisabled}
        showPathLine={showPathLine}
        pathRoadNodes={pathRoadNodes}
        fromInputRef={fromInputRef}
        toInputRef={toInputRef}
        fromSuggestionsRef={fromSuggestionsRef}
        toSuggestionsRef={toSuggestionsRef}
        highlightedFromIndex={highlightedFromIndex}
        highlightedToIndex={highlightedToIndex}
      />
      <ThreeScene
        fromPosition={fromPosition}
        toPosition={toPosition}
        pathCoordinates={pathCoordinates}
        showBuildingMarkers={showBuildingMarkers}
        showPathLine={showPathLine}
        targetPosition={targetPosition}
        modelPath={modelPath}
      />
    </div>
  );
}
export default ModelView;