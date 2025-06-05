// src/components/ResponsiveAppBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CampusToggle from './CampusToggle';

const navItems = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
];

function ResponsiveAppBar({ currentCampus, onCampusChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (url) => {
    navigate(url);
    if (mobileOpen) setMobileOpen(false);
  };

  const drawerVariants = {
    hidden: { x: '-100%' },
    visible: { x: '0%', transition: { type: 'tween', duration: 0.3 } },
    exit: { x: '-100%', transition: { type: 'tween', duration: 0.3 } },
  };

  return (
    <>
      <header className="bg-brand-primary/90 backdrop-blur-sm text-white sticky top-0 z-50 shadow-md h-16"> {/* Fixed height */}
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <img src={'/IIT_logo.png'} alt="IIT Logo" className="h-8 w-auto md:h-10" />
              <span className="hidden md:block text-xl font-semibold tracking-tight">
                IIT Mandi Navigator
              </span>
            </div>

            <div className="hidden sm:flex items-center space-x-4 md:space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.url)}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/15 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              {onCampusChange && currentCampus && (
                <CampusToggle currentCampus={currentCampus} onCampusChange={onCampusChange} />
              )}
            </div>

            <div className="sm:hidden">
              <button
                onClick={handleDrawerToggle}
                className="p-2 rounded-md hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-label="Open main menu"
              >
                {mobileOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={drawerVariants}
            className="sm:hidden fixed inset-0 z-40"
            aria-modal="true"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" onClick={handleDrawerToggle}></div>
            <div className="fixed top-0 left-0 h-full w-64 bg-brand-primary shadow-xl p-4">
              <div className="flex items-center justify-between mb-6">
                <img src={'/IIT_logo.png'} alt="IIT Logo" className="h-8 w-auto" />
                <button onClick={handleDrawerToggle} className="p-1 text-gray-300 hover:text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.url)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-white/15 hover:text-white transition-colors text-left"
                  >
                    {item.label}
                  </button>
                ))}
                 {onCampusChange && currentCampus && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                     <span className="block px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Campus</span>
                    <div className="mt-2">
                      <CampusToggle currentCampus={currentCampus} onCampusChange={onCampusChange} />
                    </div>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ResponsiveAppBar;