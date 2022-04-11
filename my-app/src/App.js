import './App.css';
import Header from './components/Header';
import { Routes, Route, Link } from 'react-router-dom';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <>
      <Header />
      {/* <Routes>
        <Route path="/" element={<Home />} />
      </Routes> */}
      <LandingPage />
      <Footer />
    </>
  );
}

export default App;
