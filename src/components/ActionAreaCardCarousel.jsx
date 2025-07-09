import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Typewriter from 'react-typewriter-effect';
import ParticlesContainer from './Particlecontainer';

export default function RotatingCardCarousel() {
  const cards = [
    { image: 'p1.jpg' },
    { image: 'p2.jpg' },
    { image: 'p3.jpg' },
    { image: 'p2.jpg' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const texts = [
    "Welcome to IIT Mandi",
    "Explore our campus",
    "Discover new opportunities",
    "Join our vibrant community"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cards.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [texts.length]);

  const getCardStyle = (index) => {
    const position = (index - activeIndex + cards.length) % cards.length;

    switch (position) {
      case 0:
        return {
          transform: 'translateX(0) scale(0.8)',
          zIndex: 3,
          opacity: 1,
          transition: 'transform 1s ease, opacity 1s ease',
        };
      case 1:
        return {
          transform: 'translateX(150px) scale(0.6)',
          zIndex: 2,
          opacity: 0.7,
          transition: 'transform 1s ease, opacity 1s ease',
        };
      case cards.length - 1:
        return {
          transform: 'translateX(-150px) scale(0.6)',
          zIndex: 2,
          opacity: 0.7,
          transition: 'transform 1s ease, opacity 1s ease',
        };
      default:
        return {
          transform: 'translateX(0) scale(0)',
          zIndex: 1,
          opacity: 0,
          transition: 'transform 1s ease, opacity 1s ease',
        };
    }
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#002b36',
    position: 'relative', // Ensures absolute positioning works correctly
  };

  const carouselStyle = {
    display: 'flex',
    position: 'relative',
    width: '400px',
    height: '500px', // Increased height
    marginLeft: '1000px',
  };

  const typewriterContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '0',
    transform: 'translateY(-50%)',
    color: 'white',
    fontSize: '24px',
    padding: '20px',
    zIndex: 1,
  };

  return (
    <div style={containerStyle
      
    }  >
      
      <div style={typewriterContainerStyle}>
        <Typewriter
          key={texts[currentTextIndex]}
          textStyle={{ fontFamily: 'Roboto', fontWeight: 'bold' }}
          cursorColor="white"
          text={texts[currentTextIndex]}
          typeSpeed={50}
          eraseSpeed={50}
          eraseDelay={2000}
          typingDelay={500}
        />
      </div>
      <div style={carouselStyle}>
     
        {cards.map((card, index) => (
          <div key={index} style={{ position: 'absolute', ...getCardStyle(index) }}>
            <Card sx={{ height: '450px' }}> {/* Increased card height */}
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="350" // Adjusted media height
                  image={card.image}
                  alt={card.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
