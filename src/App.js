import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import LocationInfo from './components/LocationInfo';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar/>
      <AnchorTemporaryDrawer/>
       <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={8}>
        <ModelView/>
        </Grid>
        <Grid size={4}>
        </Grid>
         
      </Grid>
    </Box>
     
    </div>
  );
}

export default App;

