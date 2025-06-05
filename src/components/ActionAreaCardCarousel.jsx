// src/components/ActionAreaCardCarousel.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Typewriter from 'react-typewriter-effect';

const cardsData = [
  { image: '/p1.jpg', title: "\"Where the clouds meet curiosity — that's where we learn.\"", description: 'Experience innovative learning.' },
  { image: '/p2.jpg', title: "\"Amidst the mountains, we found more than knowledge — we found ourselves.\"", description: 'Discover your potential.' },
  { image: '/p3.jpg', title: "\"IIT Mandi isn't just a campus, it's a feeling etched in mist and memory.\"", description: 'A unique campus life.' },
  { image: '/p2.jpg', title: "\"Here, silence speaks wisdom, and every sunrise brings a new idea to life.\"", description: 'Inspiring breakthroughs daily.' },
];

const texts = [
  "Welcome to IIT Mandi",
  "Explore our beautiful campus",
  "Discover new opportunities",
  "Join our vibrant community",
];

export default function ActionAreaCardCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % cardsData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 5000);
    return () => clearInterval(textInterval);
  }, []);

  const getCardStyle = (index) => {
    const position = (index - activeIndex + cardsData.length) % (cardsData.length);
    const totalCards = cardsData.length;

    const baseTranslateX = isMobile ? 70 : 100;
    const baseScale = isMobile ? 0.85 : 0.9;
    const sideScale = isMobile ? 0.7 : 0.75;
    const perspective = isMobile ? '400px' : '600px';
    const rotateYAmount = isMobile ? 30 : 35;

    switch (position) {
      case 0:
        return {
          transform: `perspective(${perspective}) translateX(0px) scale(${baseScale}) rotateY(0deg)`,
          zIndex: 3,
          opacity: 1,
        };
      case 1:
        return {
          transform: `perspective(${perspective}) translateX(${baseTranslateX}px) scale(${sideScale}) rotateY(-${rotateYAmount}deg)`,
          zIndex: 2,
          opacity: 0.7,
        };
      case totalCards - 1:
        return {
          transform: `perspective(${perspective}) translateX(-${baseTranslateX}px) scale(${sideScale}) rotateY(${rotateYAmount}deg)`,
          zIndex: 2,
          opacity: 0.7,
        };
      default:
        const directionMultiplier = position < totalCards / 2 ? 1 : -1;
        if (totalCards > 3 && (position === 2 || position === totalCards - 2)) {
          return {
            transform: `perspective(${perspective}) translateX(${directionMultiplier * baseTranslateX * 1.8}px) scale(${sideScale * 0.8}) rotateY(${directionMultiplier * -(rotateYAmount + 10)}deg)`,
            zIndex: 1,
            opacity: 0,
          };
        }
        return {
          transform: `perspective(${perspective}) translateX(${directionMultiplier * baseTranslateX * 2.5}px) scale(0.5) rotateY(0deg)`,
          zIndex: 0,
          opacity: 0,
        };
    }
  };

  return (
    <div className="carousel-page-container bg-brand-primary text-white min-h-screen flex flex-col items-center justify-start p-4 md:p-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-slate-800 to-brand-primary opacity-80 z-0"></div>

      <div className="content-area w-full max-w-6xl flex flex-col lg:flex-row items-center justify-around gap-8 lg:gap-12 relative z-10">
        <div className="typewriter-container w-full lg:w-2/5 text-center lg:text-left mb-8 lg:mb-0 animate-fadeIn">
          <Typewriter
            key={texts[currentTextIndex]}
            textStyle={{
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 'bold',
              color: 'white',
              fontSize: 'clamp(1.8rem, 5vw, 3rem)',
              textAlign: 'inherit',
              lineHeight: '1.3',
            }}
            cursorColor="#64ffda"
            text={texts[currentTextIndex]}
            typeSpeed={70}
            eraseSpeed={50}
            eraseDelay={3500}
            typingDelay={500}
          />
          <p className="mt-6 text-gray-200 text-md md:text-lg leading-relaxed">
            Discover the spirit of innovation and natural beauty at IIT Mandi.
          </p>
        </div>

        <div className="carousel-outer-container w-full lg:w-3/5 h-[400px] md:h-[450px] flex items-center justify-center -mt-12 lg:-mt-16 relative">

          <div className="carousel-inner-container relative w-full h-full" style={{ perspective: isMobile ? '500px' : '800px' }}>
            {cardsData.map((card, index) => (
              <motion.div
                key={index}
                className="card-wrapper absolute w-[240px] h-[360px] sm:w-[260px] sm:h-[380px] md:w-[280px] md:h-[410px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ transformStyle: 'preserve-3d' }}
                animate={getCardStyle(index)}
                transition={{ type: 'spring', stiffness: 120, damping: 25, duration: 0.7 }}
              >
                <div className="bg-white rounded-xl shadow-xl overflow-hidden h-full w-full flex flex-col cursor-pointer hover:shadow-2xl transition-shadow">
                  <img src={card.image} alt={card.title} className="w-full h-3/5 object-cover" />
                  <div className="p-3 md:p-4 flex flex-col justify-between flex-grow">
                    <h3 className="text-sm md:text-base font-semibold text-text-main mb-1 leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      {card.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
