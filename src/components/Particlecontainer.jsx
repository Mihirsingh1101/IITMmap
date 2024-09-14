import React, { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesContainer = () => {
  const ParticlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const ParticlesLoaded = useCallback(async () => {}, []);

  return (
    <Particles
      className="w-full h-full absolute translate-z-0 z-0"
      id="tsparticles"
      init={ParticlesInit}
      loaded={ParticlesLoaded}
      options={{
        fullScreen: { enable: false },
        background: {
          color: {
            value: "",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: false,
              mode: "push",
            },
            onHover: {
              enable: false,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 90,
            },
            repulse: {
              distance: 150,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#00C2FF", // Blue color for the particles
          },
          links: {
            color: "#00C2FF", // Blue color for the links
            distance: 150,
            enable: true,
            opacity: 0.5, // Link visibility
            width: 1, // Thickness of the links
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none", // Particles will move randomly
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1, // Adjust speed of movement
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 120,
          },
          opacity: {
            value: 0.5, // Base opacity for particles
            random: true,
            anim: {
              enable: true,
              speed: 0.5, // Adjust animation speed if needed
              opacity_min: 0, // Minimum opacity
              sync: true,
            },
          },
          shape: {
            type: "circle",  // Normal connected particles, not stars
            stroke: {
              width: 1,
              color: "#ffffff",
            },
          },
          size: {
            value: {
              min: 5,
              max: 10, // Adjust the size range of particles
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesContainer;
