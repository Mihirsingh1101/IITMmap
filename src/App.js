import './App.css';
import ModelView from './pages/modelView';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ResponsiveAppBar from './components/ResponsiveAppBar';
 

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar/>
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

