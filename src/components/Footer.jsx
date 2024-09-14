// src/components/Footer.js

import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        <h2 style={headingStyle}>IIT Mandi</h2>
        <p style={descriptionStyle}>Empowering education and innovation in the heart of Himachal Pradesh.</p>
        <div style={linksContainerStyle}>
          <a href="mailto:contact@iitmandi.ac.in" style={linkStyle}>
            <FaEnvelope style={iconStyle} /> Contact Us
          </a>
          <a href="https://www.facebook.com/IITMandi" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            <FaFacebookF style={iconStyle} /> Facebook
          </a>
          <a href="https://twitter.com/IITMandi" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            <FaTwitter style={iconStyle} /> Twitter
          </a>
          <a href="https://www.instagram.com/iitmandi/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            <FaInstagram style={iconStyle} /> Instagram
          </a>
        </div>
        <p style={footerBottomStyle}>© 2024 IIT Mandi. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Styles
const footerStyle = {
  backgroundColor: '#002b36',
  color: '#fff',
  textAlign: 'center',
  padding: '40px 20px',
  position: 'relative',
  bottom: 0,
  width: '100%',
  fontFamily: 'Arial, sans-serif',
};

const footerContentStyle = {
  margin: '0 auto',
  maxWidth: '1200px',
};

const headingStyle = {
  margin: 0,
  fontSize: '2.5em',
  color: '#ffb86c', // A contrasting color for the heading
};

const descriptionStyle = {
  fontSize: '1.2em',
  margin: '10px 0 20px',
  color: '#ccc',
};

const linksContainerStyle = {
  marginBottom: '20px',
};

const linkStyle = {
  color: '#ffb86c', // A color that stands out
  textDecoration: 'none',
  margin: '0 15px',
  fontSize: '1.2em',
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.3s',
};

const iconStyle = {
  marginRight: '8px',
};

const footerBottomStyle = {
  margin: '20px 0 0',
  fontSize: '0.9em',
  color: '#aaa',
};

export default Footer;
