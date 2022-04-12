import './App.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route, Link } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AddTimeBlock from './pages/AddTimeBlock';
import PlanDetail from './pages/PlanDetail';

function App() {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/add-time-block" element={<AddTimeBlock />} />
        <Route path="/plan-detail" element={<PlanDetail />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
      {/* <Footer /> */}
    </>
  );
}

export default App;
