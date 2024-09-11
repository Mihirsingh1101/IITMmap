import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h3>Categories</h3>
      <ul>
        <li>Buildings</li>
        <li>Canteens</li>
        <li>Emergency Features</li>
        <li>Sports</li>
        <li>Messes</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
