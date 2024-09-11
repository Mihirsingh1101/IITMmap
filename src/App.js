import React from 'react';
import ResponsiveAppBar from './components/ResponsiveAppBar'
import AnchorTemporaryDrawer from './components/AnchorTemporaryDrawer';
import ModelView from './pages/modelView';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import './App.css';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header /> 
      <AnchorTemporaryDrawer/>
       <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}> // Changed from size to item xs
        <ModelView/>
        </Grid>
        <Grid item xs={4}> // Changed from size to item xs
        </Grid>
         
      </Grid>
    </Box>
     
    </div>
  );
}

export default App;

