import React from 'react';
import Slider from 'react-slick';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinkedInIcon from '@mui/icons-material/LinkedIn'; // Import LinkedIn Icon
import Avatar from '@mui/material/Avatar'; // For profile images
import { keyframes } from '@emotion/react'; // To define keyframes for animation

// Array of team members' data
const teamMembers = [
  {
    name: 'Mihir Singh',
    role: 'Team Lead',
    image: 'mihir.jpg',
    description: 'Learning React,threejs, frontend and UI/UX design.',
    linkedIn: 'https://www.linkedin.com/in/mihir-singh-63a83431a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },
  {
    name: 'Ekansh Shingal',
    role: 'learning Backend ',
    image: 'ekansh1.jpg',
    description: 'Contribute in adding navigaiton',
    linkedIn: 'https://www.linkedin.com/in/ekansh-singal-61a0a0317?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },
  {
    name: 'Aditya Mittal',
    role: 'learning Backend',
    image: 'adityam.jpg',
    description: 'Contribute in adding navigaiton',
    linkedIn: 'https://www.linkedin.com/in/aditya-mittal-979494265?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },
  {
    name: 'Aditya Singh',
    role: 'learning UI/UX Designing',
    image: '/static/images/team/bob.jpg',
    description: '',
    linkedIn: 'https://www.linkedin.com/in/aditya-singh-324654328?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_appn',
  },
  {
    name: 'Pranjal Prakhar',
    role: 'learning UI/UX Designing',
    image: 'pranjal.jpg',
    description: '',
    linkedIn: 'https://www.linkedin.com/in/pranjal-prakhar-747366323?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },
  {
    name: 'Arham jain',
    role: '',
    image: '/static/images/team/chris.jpg',
    description: 'Focused on creating user-friendly designs.',
    linkedIn: 'https://www.linkedin.com/in/arham-jain-69b645312?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },
  {
    name: 'Chetan Anand',
    role: '3d Desgining ',
    image: '/static/images/team/jane.jpg',
    description: 'Desgine our 3D map',
    linkedIn: 'https://linkedin.com/in/janesmith',
  },
];

// Define keyframes for the animation
const slideAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

export default function Aboutpage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 cards at once
    slidesToScroll: 1,
    autoplay: true, // Enable auto play
    autoplaySpeed: 2000, // Adjust the autoplay speed
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div style={{ 
      padding: '40px', 
      background: 'linear-gradient(to right, #0061ff, #60efff)', // Bluish gradient background
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Typography variant="h4" align="center" gutterBottom style={{ color: '#fff' }}>
        Meet Our Team
      </Typography>
      <div style={{ width: '80%', margin: '0 auto' }}>
        <Slider {...settings}>
          {teamMembers.map((member, index) => (
            <Card 
              key={index} 
              sx={{ 
                maxWidth: 345, 
                margin: '0 auto', 
                borderRadius: '15px', 
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                transition: 'transform 0.5s', // Smooth hover effect
                '&:hover': {
                  transform: 'scale(1.05)', // Slightly enlarge the card on hover
                }
              }}
            >
              <CardMedia>
                <Avatar
                  alt={member.name}
                  src={member.image}
                  sx={{ width: 140, height: 140, margin: '20px auto' }} // Circular avatar
                />
              </CardMedia>
              <CardContent>
                <Typography variant="h5" component="div" align="center">
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {member.role}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: '10px', textAlign: 'center' }}>
                  {member.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button
                  size="small"
                  href={member.linkedIn}
                  target="_blank"
                  variant="outlined"
                  startIcon={<LinkedInIcon />}
                >
                  LinkedIn
                </Button>
              </CardActions>
            </Card>
          ))}
        </Slider>
      </div>
    </div>
  );
}
