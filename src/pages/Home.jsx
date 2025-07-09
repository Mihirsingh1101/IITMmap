import React from 'react';
import ActionAreaCardCarousel from '../components/ActionAreaCardCarousel';
import ModelView from '../components/modelView';
import Footer from '../components/Footer';
import ParticlesContainer from '../components/Particlecontainer'; // Correct import path if needed

function Home() {
  return (
    <div>
        
        <ActionAreaCardCarousel />
        <ModelView/>
        <Footer />
      </div>
  );
}

export default Home;
