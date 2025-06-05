// src/components/CampusToggle.jsx
import React from 'react';
import { motion } from 'framer-motion';

function CampusToggle({ currentCampus, onCampusChange }) {
  const campuses = ['North', 'South']; // Add more if needed

  return (
    <div className="flex items-center space-x-1 bg-brand-primary p-1 rounded-full shadow-sm">
      {campuses.map((campus) => (
        <button
          key={campus}
          onClick={() => onCampusChange(campus)}
          className={`relative px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-300 focus:outline-none
            ${currentCampus === campus ? 'text-brand-primary' : 'text-gray-300 hover:text-white'}
          `}
        >
          {currentCampus === campus && (
            <motion.div
              layoutId="campusToggleBubble"
              className="absolute inset-0 bg-brand-accent rounded-full z-0"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{campus}</span>
        </button>
      ))}
    </div>
  );
}

export default CampusToggle;