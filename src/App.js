import './App.css';
import Home from './pages/Home';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import Aboutpage from './pages/Aboutpage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';    
import { element } from 'three/webgpu';

function App() {
  return (
    <div className="App  ">
      {/* Content layers on top */}
      <div className="content-container">
        <Router>
        <ResponsiveAppBar/>
            <Routes>
            <Route path='/' element={ <Home/> } ></Route>
            <Route path='/about' element={<Aboutpage/>} ></Route>
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
