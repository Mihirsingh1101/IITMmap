// src/components/Sidebar.jsx
import React from "react";

function Sidebar({
  fromBuilding,
  toBuilding,
  fromSuggestions,
  toSuggestions,
  handleFromChange,
  handleToChange,
  handleFromKeyDown,
  handleToKeyDown,
  handleFromSuggestionClick,
  handleToSuggestionClick,
  handleFindPath,
  findPathButtonDisabled,
  showPathLine,
  pathRoadNodes,
  fromInputRef,
  toInputRef,
  fromSuggestionsRef,
  toSuggestionsRef,
  highlightedFromIndex,
  highlightedToIndex,
}) {
  return (
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
                className={`suggestion-item ${
                  highlightedFromIndex === index ? "highlighted" : ""
                }`}
                title={suggestion}
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
                className={`suggestion-item ${
                  highlightedToIndex === index ? "highlighted" : ""
                }`}
                title={suggestion}
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

      {showPathLine && pathRoadNodes && pathRoadNodes.length > 0 && (
        <div className="path-info">
          <h4 className="path-info-title">Showing Route</h4>
          <ul className="path-steps">
            <li>START: Yellow Ball</li>
            {/* Optional: Display nodes for debugging */}
            {/* {pathRoadNodes.map((step, index) => (
              <li key={index}>{`${index + 1}. Node: ${step}`}</li>
            ))} */}
            <li>END: Pink Ball</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;