// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/Aboutpage'; // Create a simple About component if you don't have one
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Footer from './components/Footer';

function App() {
  const [currentCampus, setCurrentCampus] = useState('North');

  const handleCampusChange = (campus) => {
    console.log("App: Campus changing to", campus);
    setCurrentCampus(campus);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <ResponsiveAppBar
          currentCampus={currentCampus}
          onCampusChange={handleCampusChange}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home currentCampus={currentCampus} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;