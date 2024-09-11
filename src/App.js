import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import LocationInfo from './components/LocationInfo';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <Sidebar />
        <Map />
        <LocationInfo />
      </div>
      <Footer />
    </div>
  );
}

export default App;
