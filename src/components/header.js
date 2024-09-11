import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">College Map</div>
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>
      <div className="options">
        <button>Help</button>
        <button>Profile</button>
      </div>
    </header>
  );
};

export default Header;
