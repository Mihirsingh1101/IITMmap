import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Typewriter from 'react-typewriter-effect';
// Assuming ParticleContainer is in the same directory or imported correctly
// import ParticlesContainer from './Particlecontainer';

export default function RotatingCardCarousel() {
  const cards = [
    { image: 'p1.jpg', title: "\"Where the clouds meet curiosity — that's where we learn.\"", description: '' }, // Added placeholder text
    { image: 'p2.jpg', title: "\"Amidst the mountains, we found more than knowledge — we found ourselves.\"", description: '' },
    { image: 'p3.jpg', title:  "\"IIT Mandi isn't just a campus, it's a feeling etched in mist and memory.\"", description: '' },
    { image: 'p2.jpg', title: "\"Here, silence speaks wisdom, and every sunrise brings a new idea to life.\"", description: '' },
  ];


  const [activeIndex, setActiveIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const texts = [
    "Welcome to IIT Mandi",
    "Explore our campus",
    "Discover new opportunities",
    "Join our vibrant community",
  ];

  // Card rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 3000); // Rotate card every 3 seconds
    return () => clearInterval(interval);
  }, [cards.length]);

  // Text cycling effect
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 4000); // Change text every 4 seconds (longer than card rotation)
    return () => clearInterval(textInterval);
  }, [texts.length]);


  // Style calculation for each card based on its position relative to activeIndex
  const getCardStyle = (index) => {
    const position = (index - activeIndex + cards.length) % cards.length;
    const totalCards = cards.length;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768; // Basic check

    // Adjust translation based on screen size if needed
    const baseTranslateX = isMobile ? 100 : 150; // Smaller shift on mobile
    const baseScale = 0.8; // Scale of the main card
    const sideScale = 0.6; // Scale of the side cards

    switch (position) {
      case 0: // Active card (center)
        return {
          transform: `translateX(0) scale(${baseScale})`,
          zIndex: 3,
          opacity: 1,
          transition: 'transform 1s ease, opacity 1s ease',
        };
      case 1: // Card to the right
        return {
          transform: `translateX(${baseTranslateX}px) scale(${sideScale})`,
          zIndex: 2,
          opacity: 0.7,
          transition: 'transform 1s ease, opacity 1s ease',
        };
      case totalCards - 1: // Card to the left
        return {
          transform: `translateX(-${baseTranslateX}px) scale(${sideScale})`,
          zIndex: 2,
          opacity: 0.7,
          transition: 'transform 1s ease, opacity 1s ease',
        };
      default: // Other cards (hidden further away)
        // Determine if it's further right (pos 2, 3...) or further left (pos totalCards-2, ...)
        const direction = position < totalCards / 2 ? 1 : -1;
        return {
          // Move further away and scale down more
          transform: `translateX(${direction * baseTranslateX * 1.5}px) scale(${sideScale * 0.8})`,
          zIndex: 1,
          opacity: 0,
          transition: 'transform 1s ease, opacity 1s ease',
        };
    }
  };

  return (
    <>
      {/* Root container */}
      <div className="carousel-page-container">
         {/* Optional: Particles Background */}
         {/* <ParticlesContainer /> */}

         {/* Content Area (Text + Carousel) */}
         <div className="content-area">

             {/* Typewriter Text */}
             <div className="typewriter-container">
                 <Typewriter
                    key={texts[currentTextIndex]} // Force re-render when text changes
                    textStyle={{
                        fontFamily: "'Roboto', sans-serif",
                        fontWeight: 'bold',
                        color: 'white', // Ensure text is visible on dark background
                        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', // Responsive font size
                        textAlign: 'center', // Center text on mobile
                    }}
                    cursorColor="#64ffda" // A nice accent color
                    text={texts[currentTextIndex]}
                    typeSpeed={60}
                    eraseSpeed={40}
                    eraseDelay={2500}
                    typingDelay={500}
                 />
             </div>

             {/* Carousel Container */}
             <div className="carousel-container">
                 {/* Cards */}
                 {cards.map((card, index) => (
                    <div
                       key={index}
                       className="card-wrapper"
                       style={getCardStyle(index)} // Apply dynamic styles
                    >
                       <Card sx={{
                           height: { xs: 380, sm: 450 }, // Responsive height
                           width: '100%', // Card takes width of its wrapper
                           maxWidth: 300, // Max card width
                           borderRadius: '12px', // Softer edges
                           boxShadow: '0 10px 20px rgba(0,0,0,0.2)', // Deeper shadow
                       }}>
                           <CardActionArea sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                             <CardMedia
                               component="img"
                               sx={{
                                  height: { xs: 200, sm: 250 }, // Responsive image height
                                  objectFit: 'cover', // Ensure image covers area
                               }}
                               image={card.image}
                               alt={card.title || 'Campus image'}
                             />
                             <CardContent sx={{ flexGrow: 1 }}> {/* Allow content to fill space */}
                               <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: { xs: '1.4rem', sm: '1.25rem' } }}>
                                 {card.title}
                               </Typography>
                               <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                 {card.description}
                               </Typography>
                             </CardContent>
                           </CardActionArea>
                       </Card>
                    </div>
                 ))}
             </div> {/* End carousel-container */}
         </div> {/* End content-area */}
      </div> {/* End carousel-page-container */}


      {/* --- CSS Styles for Responsiveness --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'); // Import font

        body {
          margin: 0;
          font-family: 'Roboto', sans-serif;
        }

        .carousel-page-container {
          display: flex;
          flex-direction: column; /* Stack content by default */
          align-items: center; /* Center items horizontally */
          justify-content: center; /* Center items vertically */
          min-height: 100vh; /* Ensure takes full screen height */
          background-color: #001f29; /* Dark teal background */
          padding: 20px; /* Add some padding around */
          box-sizing: border-box;
          overflow-x: hidden; /* Prevent horizontal scroll on body */
          position: relative; /* For potential absolute elements like particles */
        }

        .content-area {
            display: flex;
            flex-direction: column; /* Mobile first: Text above Carousel */
            align-items: center;
            width: 100%;
            max-width: 1200px; /* Max width for larger screens */
            z-index: 1; /* Keep content above potential background elements */
        }


        .typewriter-container {
           width: 100%;
           max-width: 600px; /* Limit text width */
           margin-bottom: 40px; /* Space below text */
           padding: 0 10px; /* Padding for text */
           box-sizing: border-box;
        }

        .carousel-container {
          display: flex; /* Enables absolute positioning of children relative to this */
          position: relative;
          width: 100%; /* Take full width of its parent */
          max-width: 500px; /* Limit carousel width on large screens */
          height: 500px; /* Fixed height for the carousel area */
          justify-content: center; /* Center the active card */
          align-items: center;
          margin-top: 20px; /* Space above carousel on mobile */
        }

        .card-wrapper {
          position: absolute; /* Crucial for layering */
          /* Width/Height are controlled by the Card component inside */
          display: flex;
          justify-content: center;
          align-items: center;
          /* The transform style is applied dynamically */
        }


        /* --- Desktop Styles --- */
        @media (min-width: 900px) { /* Adjust breakpoint as needed */
          .content-area {
            flex-direction: row; /* Side-by-side layout */
            justify-content: space-around; /* Space between text and carousel */
            align-items: center;
          }

          .typewriter-container {
            width: 40%; /* Take ~40% of width */
            margin-bottom: 0; /* No bottom margin */
            margin-right: 5%; /* Space between text and carousel */
            text-align: left; /* Align text left on desktop */
          }
          .typewriter-container .Typewriter__wrapper { /* Target typewriter inner span */
             text-align: left !important; /* Override default center */
             justify-content: flex-start !important; /* Override default center */
          }
           .typewriter-container .Typewriter__cursor { /* Adjust cursor position maybe*/

           }


          .carousel-container {
            width: 55%; /* Take ~55% of width */
            height: 550px; /* Slightly taller on desktop */
            margin-top: 0; /* Reset mobile margin */
            /* max-width remains 500px or adjust as needed */
          }
        }
      `}</style>
    </>
  );
}