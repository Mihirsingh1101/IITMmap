// src/pages/Home.jsx
import React from 'react';
import ActionAreaCardCarousel from '../components/ActionAreaCardCarousel';
import ModelView from '../components/modelView'; // Note the lowercase 'm'

function Home({ currentCampus }) {
  return (
    <>
      <section id="hero-carousel" className="w-full">
        <ActionAreaCardCarousel />
      </section>
      <section
        id="campus-navigator"
        className="w-full"
        style={{ height: 'calc(100vh - 4rem)' }} // Assumes AppBar is 4rem (64px) high
      >
        <ModelView currentCampus={currentCampus} />
      </section>
    </>
  );
}

export default Home;