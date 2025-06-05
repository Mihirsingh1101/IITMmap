// src/ModelView.jsx
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import Sidebar from "../components/Sidebar";
import ThreeScene from "../components/ThreeScene";
import {
  buildingCoordinates,
  roadNetworkNodes,
  roadNetworkConnections,
} from "../data/mapData";
import {
  buildWeightedGraph,
  findNearestRoadNode,
  dijkstra,
} from "../utils/graphUtils";

function ModelView() {
  const [fromBuilding, setFromBuilding] = useState("");
  const [toBuilding, setToBuilding] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [fromPosition, setFromPosition] = useState(null);
  const [toPosition, setToPosition] = useState(null);
  const [targetPosition, setTargetPosition] = useState(null); // For camera focus
  const [highlightedFromIndex, setHighlightedFromIndex] = useState(-1);
  const [highlightedToIndex, setHighlightedToIndex] = useState(-1);
  const [pathRoadNodes, setPathRoadNodes] = useState(null); // Node IDs of the path
  const [pathCoordinates, setPathCoordinates] = useState(null); // Actual coordinates for line
  const [showBuildingMarkers, setShowBuildingMarkers] = useState(true);
  const [showPathLine, setShowPathLine] = useState(false);

  const fromInputRef = useRef(null);
  const fromSuggestionsRef = useRef(null);
  const toInputRef = useRef(null);
  const toSuggestionsRef = useRef(null);

  const weightedRoadGraph = useMemo(() => {
    return buildWeightedGraph(roadNetworkConnections, roadNetworkNodes);
  }, []); // Assuming roadNetworkNodes/Connections don't change

  const filterBuildingSuggestions = (value) => {
    if (!value) return [];
    const lowerValue = value.toLowerCase();
    const suggestions = Object.keys(buildingCoordinates)
      .filter((key) => key.toLowerCase().includes(lowerValue))
      .sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        if (aLower.startsWith(lowerValue) && !bLower.startsWith(lowerValue))
          return -1;
        if (!aLower.startsWith(lowerValue) && bLower.startsWith(lowerValue))
          return 1;
        return aLower.localeCompare(bLower);
      });
    return suggestions.slice(0, 50);
  };

  const handleFromChange = useCallback((event) => {
    const value = event.target.value;
    setFromBuilding(value);
    setFromPosition(null); // Clear position if text changes
    setPathRoadNodes(null);
    setPathCoordinates(null);
    setShowPathLine(false);
    setHighlightedFromIndex(-1);
    // setTargetPosition(null); // Camera will focus on selection or path later

    if (value.length > 0) {
      const debounceTimeout = setTimeout(() => {
        setFromSuggestions(filterBuildingSuggestions(value));
      }, 200);
      return () => clearTimeout(debounceTimeout);
    } else {
      setFromSuggestions([]);
    }
  }, []);

  const handleToChange = useCallback((event) => {
    const value = event.target.value;
    setToBuilding(value);
    setToPosition(null); // Clear position if text changes
    setPathRoadNodes(null);
    setPathCoordinates(null);
    setShowPathLine(false);
    setHighlightedToIndex(-1);
    // setTargetPosition(null);

    if (value.length > 0) {
      const debounceTimeout = setTimeout(() => {
        setToSuggestions(filterBuildingSuggestions(value));
      }, 200);
      return () => clearTimeout(debounceTimeout);
    } else {
      setToSuggestions([]);
    }
  }, []);

  const handleFromSuggestionClick = useCallback((suggestion) => {
    setFromBuilding(suggestion);
    setFromSuggestions([]);
    const position = buildingCoordinates[suggestion];
    if (position) {
      setFromPosition(position);
      setTargetPosition(position); // Focus camera
      setHighlightedFromIndex(-1);
    } else {
      setFromPosition(null);
    }
  }, []);

  const handleToSuggestionClick = useCallback((suggestion) => {
    setToBuilding(suggestion);
    setToSuggestions([]);
    const position = buildingCoordinates[suggestion];
    if (position) {
      setToPosition(position);
      setTargetPosition(position); // Focus camera
      setHighlightedToIndex(-1);
    } else {
      setToPosition(null);
    }
  }, []);

  const handleFromKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedFromIndex((prevIndex) =>
        fromSuggestions.length > 0
          ? (prevIndex + 1) % fromSuggestions.length
          : -1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedFromIndex((prevIndex) =>
        fromSuggestions.length > 0
          ? (prevIndex - 1 + fromSuggestions.length) % fromSuggestions.length
          : -1
      );
    } else if (e.key === "Enter") {
      if (highlightedFromIndex >= 0 && fromSuggestions[highlightedFromIndex]) {
        e.preventDefault();
        handleFromSuggestionClick(fromSuggestions[highlightedFromIndex]);
      } else if (fromSuggestions.length > 0) {
        e.preventDefault();
        handleFromSuggestionClick(fromSuggestions[0]);
      }
    } else if (e.key === "Escape") {
      setFromSuggestions([]);
      setHighlightedFromIndex(-1);
    }
  };

  const handleToKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedToIndex((prevIndex) =>
        toSuggestions.length > 0
          ? (prevIndex + 1) % toSuggestions.length
          : -1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedToIndex((prevIndex) =>
        toSuggestions.length > 0
          ? (prevIndex - 1 + toSuggestions.length) % toSuggestions.length
          : -1
      );
    } else if (e.key === "Enter") {
      if (highlightedToIndex >= 0 && toSuggestions[highlightedToIndex]) {
        e.preventDefault();
        handleToSuggestionClick(toSuggestions[highlightedToIndex]);
        if (fromPosition) { // If 'from' is also set, trigger find path
            const startBuildingCoords = buildingCoordinates[fromBuilding];
            if(startBuildingCoords) handleFindPath(); // Call directly
        }
      } else if (toSuggestions.length > 0) {
        e.preventDefault();
        handleToSuggestionClick(toSuggestions[0]);
        if (fromPosition) {
            const startBuildingCoords = buildingCoordinates[fromBuilding];
            if(startBuildingCoords) handleFindPath(); // Call directly
        }
      }
    } else if (e.key === "Escape") {
      setToSuggestions([]);
      setHighlightedToIndex(-1);
    }
  };

  const handleFindPath = useCallback(() => {
    setPathRoadNodes(null);
    setPathCoordinates(null);
    setShowPathLine(false);
    // setTargetPosition(null); // Path fitting will set camera

    const startBuildingName = fromBuilding;
    const endBuildingName = toBuilding;
    const startBuildingCoords = buildingCoordinates[startBuildingName];
    const endBuildingCoords = buildingCoordinates[endBuildingName];

    if (!startBuildingCoords || !endBuildingCoords) {
      alert("Please ensure both 'From' and 'To' locations are selected correctly.");
      return;
    }
    if (startBuildingName === endBuildingName) {
      setFromPosition(startBuildingCoords); // Show the single marker
      setToPosition(null); // Clear 'to' if same, to avoid duplicate marker
      setTargetPosition(startBuildingCoords); // Focus on it
      setPathCoordinates(null); // No path line
      setShowPathLine(false);
      return;
    }

    const startRoadNodeId = findNearestRoadNode(startBuildingCoords, roadNetworkNodes);
    const endRoadNodeId = findNearestRoadNode(endBuildingCoords, roadNetworkNodes);

    if (!startRoadNodeId || !endRoadNodeId) {
      alert("Could not find a connection to the road network for the selected buildings.");
      setFromPosition(startBuildingCoords);
      setToPosition(endBuildingCoords);
      setTargetPosition(endBuildingCoords); // Focus on destination attempt
      return;
    }

    if (startRoadNodeId === endRoadNodeId) {
      const directPath = [startBuildingCoords, endBuildingCoords];
      setPathCoordinates(directPath);
      setShowPathLine(true);
      // TargetPosition will be handled by pathCoordinates effect in CameraControls
      setPathRoadNodes([startRoadNodeId]);
      return;
    }

    if (!weightedRoadGraph) {
      alert("Error: Road network data is not ready.");
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
        setPathCoordinates(coords); // This will trigger camera fit in CameraControls
        setShowPathLine(true);
        setTargetPosition(null); // Let pathCoordinates handle camera
      } else {
        alert("Could not generate a valid path visualization.");
        setPathCoordinates(null);
        setShowPathLine(false);
        setFromPosition(startBuildingCoords);
        setToPosition(endBuildingCoords);
        setTargetPosition(endBuildingCoords);
      }
    } else {
      alert(`Could not find a route on the road network between the selected locations.`);
      setPathRoadNodes(null);
      setPathCoordinates(null);
      setShowPathLine(false);
      setFromPosition(startBuildingCoords);
      setToPosition(endBuildingCoords);
      setTargetPosition(endBuildingCoords);
    }
  }, [fromBuilding, toBuilding, weightedRoadGraph, fromPosition]); // fromPosition added for Enter key in 'to' field

  useEffect(() => {
    setShowBuildingMarkers(!!fromPosition || !!toPosition || (pathCoordinates && pathCoordinates.length >=2));
    setShowPathLine(!!pathCoordinates && pathCoordinates.length >= 2);
  }, [fromPosition, toPosition, pathCoordinates]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        fromSuggestionsRef.current &&
        !fromSuggestionsRef.current.contains(event.target) &&
        fromInputRef.current &&
        !fromInputRef.current.contains(event.target)
      ) {
        setFromSuggestions([]);
        setHighlightedFromIndex(-1);
      }
      if (
        toSuggestionsRef.current &&
        !toSuggestionsRef.current.contains(event.target) &&
        toInputRef.current &&
        !toInputRef.current.contains(event.target)
      ) {
        setToSuggestions([]);
        setHighlightedToIndex(-1);
      }
    };

    if (fromSuggestions.length > 0 || toSuggestions.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fromSuggestions.length, toSuggestions.length]);

  const findPathButtonDisabled =
    !fromBuilding ||
    !toBuilding ||
    !buildingCoordinates[fromBuilding] ||
    !buildingCoordinates[toBuilding];

  return (
    <div className="model-view-container">
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
        targetPosition={targetPosition} // Pass this for individual selections
        // modelPath="path/to/your/final.glb" // Optional: if not in public root
      />

      {/* Global Styles */}
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: sans-serif;
          overflow-x: hidden;
        }
        #__next {
           height: 100%;
        }
        .model-view-container {
          display: flex;
          flex-direction: row;
          width: 100%;
          min-height: 100vh;
          height: 100%;
          background-color: #eef;
        }
        .sidebar {
          width: 300px;
          padding: 20px;
          background-color: #ffffff;
          height: 100vh;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          box-sizing: border-box;
          flex-shrink: 0;
          z-index: 10;
        }
        .sidebar-title {
          color: #333;
          text-align: center;
          margin-top: 0;
          margin-bottom: 25px;
          font-size: 1.4em;
          flex-shrink: 0;
        }
        .input-container {
          margin-bottom: 15px;
          position: relative;
          flex-shrink: 0;
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
          max-height: 200px;
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
           flex-shrink: 0;
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
             flex-shrink: 0;
             overflow: hidden;
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
            max-height: 100px;
            overflow-y: auto;
        }
         .path-steps li {
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .canvas-container {
          flex-grow: 1;
          height: 100vh;
          overflow: hidden;
          position: relative;
        }
        @media (max-width: 768px) {
          .model-view-container {
            flex-direction: column;
             height: 100vh;
            min-height: 100vh;
            overflow: hidden;
          }
          .sidebar {
            width: 100%;
            height: auto;
            max-height: 50vh;
            overflow-y: auto;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            border-bottom: 1px solid #ccc;
            flex-shrink: 0;
            z-index: 11;
          }
          .canvas-container {
            width: 100%;
             min-height: 50vh; /* Adjusted */
             height: auto;
             flex-grow: 1;
          }
           .suggestions-list {
                max-height: 150px;
            }
        }
      `}</style>
    </div>
  );
}

export default ModelView;