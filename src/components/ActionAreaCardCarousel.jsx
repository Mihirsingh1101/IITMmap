import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Typewriter from "react-typewriter-effect";

export default function RotatingCardCarousel() {
  const cards = [
    { image: "p1.jpg", title: "Welcome", description: "Explore IIT Mandi" },
    { image: "p2.jpg", title: "Campus Life", description: "Experience vibrant student life" },
    { image: "p3.jpg", title: "Innovation", description: "Discover research and technology" },
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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        return { transform: "translateX(0) scale(0.9)", zIndex: 3, opacity: 1 };
      case 1:
        return { transform: "translateX(100px) scale(0.7)", zIndex: 2, opacity: 0.7 };
      case cards.length - 1:
        return { transform: "translateX(-100px) scale(0.7)", zIndex: 2, opacity: 0.7 };
      default:
        return { transform: "translateX(0) scale(0)", zIndex: 1, opacity: 0 };
    }
  };

  return (
    <div style={isMobile ? styles.mobileContainer : styles.container}>
      {/* Typewriter Effect */}
      <div style={isMobile ? styles.mobileTypewriterContainer : styles.typewriterContainer}>
        <Typewriter
          key={texts[currentTextIndex]}
          textStyle={{ fontFamily: "Roboto", fontWeight: "bold" }}
          cursorColor="white"
          text={texts[currentTextIndex]}
          typeSpeed={50}
          eraseSpeed={50}
          eraseDelay={2000}
          typingDelay={500}
        />
      </div>

      {/* Cards Carousel */}
      <div style={isMobile ? styles.mobileCarouselContainer : styles.carouselContainer}>
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              ...getCardStyle(index),
              transition: "transform 1s ease, opacity 1s ease",
            }}
          >
            <Card sx={isMobile ? styles.mobileCard : styles.card}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height={isMobile ? "200" : "300"} // Decreased height on mobile
                  image={card.image}
                  alt={card.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6">{card.title}</Typography>
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

// Styles with Responsive Design
const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#002b36",
    padding: "20px",
  },
  mobileContainer: {
    display: "flex",
    flexDirection: "column", // Stack elements on mobile
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#002b36",
    padding: "20px",
  },
  typewriterContainer: {
    color: "white",
    fontSize: "24px",
    padding: "20px",
    textAlign: "center",
    maxWidth: "300px",
    marginRight: "300px",
  },
  mobileTypewriterContainer: {
    color: "white",
    fontSize: "20px",
    padding: "20px",
    textAlign: "center",
    maxWidth: "90%",
    margin: "0 auto",
  },
  carouselContainer: {
    display: "flex",
    position: "relative",
    width: "400px",
    height: "350px",
    marginLeft: "250px",
  },
  mobileCarouselContainer: {
    display: "flex",
    position: "relative",
    width: "250px",
    height: "300px",
    marginTop: "20px", // Add spacing between typewriter and carousel on mobile
  },
  card: {
    width: "300px",
  },
  mobileCard: {
    width: "250px", // Smaller card on mobile
  },
};
