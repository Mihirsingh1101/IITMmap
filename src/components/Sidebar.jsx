// src/components/Sidebar.jsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  const suggestionVariants = {
    hidden: { opacity: 0, y: -10, transition: { duration: 0.15 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, staggerChildren: 0.03 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="sidebar w-full md:w-80 lg:w-96 bg-slate-100 p-5 shadow-lg flex flex-col h-full overflow-y-auto custom-scrollbar border-r border-slate-200">
      <h2 className="text-2xl font-semibold text-brand-primary mb-6 text-center">
        Find Your Way
      </h2>

      <div className="input-section bg-white p-4 rounded-lg shadow mb-5">
        <label htmlFor="fromLocation" className="block text-sm font-medium text-text-secondary mb-1.5">From</label>
        <div className="relative">
          <input
            id="fromLocation"
            ref={fromInputRef}
            type="text"
            value={fromBuilding}
            onChange={handleFromChange}
            onKeyDown={handleFromKeyDown}
            placeholder="Starting point..."
            className="search-bar w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
            autoComplete="off"
          />
        </div>
        <AnimatePresence>
          {fromSuggestions.length > 0 && (
            <motion.ul
              ref={fromSuggestionsRef}
              variants={suggestionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="suggestions-list mt-1.5 bg-white border border-gray-200 rounded-md shadow-md z-20 max-h-48 overflow-y-auto custom-scrollbar"
            >
              {fromSuggestions.map((suggestion, index) => (
                <motion.li
                  key={suggestion}
                  variants={itemVariants}
                  onClick={() => handleFromSuggestionClick(suggestion)}
                  className={`suggestion-item px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 truncate
                    ${highlightedFromIndex === index ? "bg-indigo-100 text-brand-blue font-medium" : "text-text-secondary"}
                  `}
                  title={suggestion}
                >
                  {suggestion}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="input-section bg-white p-4 rounded-lg shadow mb-6">
        <label htmlFor="toLocation" className="block text-sm font-medium text-text-secondary mb-1.5">To</label>
        <div className="relative">
          <input
            id="toLocation"
            ref={toInputRef}
            type="text"
            value={toBuilding}
            onChange={handleToChange}
            onKeyDown={handleToKeyDown}
            placeholder="Destination..."
            className="search-bar w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-all"
            autoComplete="off"
          />
        </div>
        <AnimatePresence>
          {toSuggestions.length > 0 && (
            <motion.ul
              ref={toSuggestionsRef}
              variants={suggestionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="suggestions-list mt-1.5 bg-white border border-gray-200 rounded-md shadow-md z-10 max-h-48 overflow-y-auto custom-scrollbar"
            >
              {toSuggestions.map((suggestion, index) => (
                <motion.li
                  key={suggestion}
                  variants={itemVariants}
                  onClick={() => handleToSuggestionClick(suggestion)}
                  className={`suggestion-item px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 truncate
                    ${highlightedToIndex === index ? "bg-indigo-100 text-brand-blue font-medium" : "text-text-secondary"}
                  `}
                  title={suggestion}
                >
                  {suggestion}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={handleFindPath}
        className="find-path-button w-full px-4 py-3 text-sm font-semibold text-white bg-brand-blue rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-50 transition-all duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
        disabled={findPathButtonDisabled}
        whileHover={{ scale: findPathButtonDisabled ? 1 : 1.03 }}
        whileTap={{ scale: findPathButtonDisabled ? 1 : 0.98 }}
      >
        Find Path
      </motion.button>

      <AnimatePresence>
        {showPathLine && pathRoadNodes && pathRoadNodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem', transition: { delay: 0.2 } }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="path-info p-4 border border-green-300 bg-green-50 rounded-lg shadow-sm overflow-hidden"
          >
            <h4 className="path-info-title text-md font-semibold text-green-700 mb-2">
              Route Active
            </h4>
            <ul className="path-steps list-disc list-inside space-y-1 text-xs text-green-600">
              <li>START: <span className="font-medium text-yellow-600">Yellow Marker</span></li>
              <li>END: <span className="font-medium text-pink-600">Pink Marker</span></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-auto pt-6 text-center text-xs text-gray-400">
        IIT Mandi Campus Navigator
      </div>
    </div>
  );
}

export default Sidebar;