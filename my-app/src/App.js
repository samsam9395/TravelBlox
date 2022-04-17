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
import EditPlanDetail from './pages/EditPlanDetail';
import StaticPlanDetail from './pages/StaticPlanDetail';
import TestMap from './components/TestMap';
import AutoCompleteInput from './components/AutoCompleteInput';
import Dashboard from './pages/Dashboard';
import AddNewPlan from './pages/AddNewPlan';

function App() {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/add-time-block" element={<AddTimeBlock />} />
        <Route path="/edit-plan-detail" element={<EditPlanDetail />} />
        <Route path="/add-new-plan" element={<AddNewPlan />} />
        <Route path="/static-plan-detail" element={<StaticPlanDetail />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/test-map" element={<TestMap />} />
        <Route path="/autocomplete" element={<AutoCompleteInput />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      {/* <Footer /> */}
    </>
  );
}

export default App;
