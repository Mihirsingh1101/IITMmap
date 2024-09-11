import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import img from './IIT_logo.png';

function Header() {
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <img src={img} alt="IIT Mandi Logo" className='logo' />
          </IconButton>
          <div className="header center-title">
            <Typography variant="h4" component="h1">
              IIT Mandi Maps
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    );
}

export default Header;