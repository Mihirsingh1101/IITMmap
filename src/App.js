import './App.css';
import ModelView from './pages/modelView';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import AnchorTemporaryDrawer from './components/AnchorTemporaryDrawer';
 

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
