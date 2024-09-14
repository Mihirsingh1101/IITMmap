import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import ActionAreaCardCarousel from './components/ActionAreaCardCarousel';
import ModelView from './pages/modelView';
import Footer from './components/Footer';
import ParticlesContainer from './components/Particlecontainer';

function App() {
  return (
    <div className="App  ">
      {/* <ParticlesContainer /> */}
      
      {/* Content layers on top */}
      <div className="content-container">
        <ResponsiveAppBar />
        <ActionAreaCardCarousel />
        <ModelView />
        <Footer />
      </div>
    </div>
  );
}

export default App;
