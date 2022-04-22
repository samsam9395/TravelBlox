import './App.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import LandingPage from './pages/LandingPage';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import EditPlanDetail from './pages/EditPlanDetail';
import StaticPlanDetail from './pages/StaticPlanDetail';
// import TestMap from './components/TestMap';
import AutoCompleteInput from './components/AutoCompleteInput';
import Dashboard from './pages/Dashboard';
import AddNewPlan from './pages/AddNewPlan';
import Allplans from './pages/AllPlans';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BodyWrapper = styled.div`
  padding: 100px 30px 150px 30px;
`;

function App() {
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      // setCanRedirect(true);
      setUser({
        accessToken: localStorage.getItem('accessToken'),
        email: localStorage.getItem('userEmail'),
      });
    } else {
      console.log('User has not signed in to app yet!');
      navigate('/landing');
    }
  }, []);

  return (
    <>
      <Header />
      <BodyWrapper>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/edit-plan-detail" element={<EditPlanDetail />} />
          <Route path="/add-new-plan" element={<AddNewPlan />} />
          <Route path="/static-plan-detail" element={<StaticPlanDetail />} />
          <Route
            path="/landing"
            element={<LandingPage user={user} setUser={setUser} />}
          />
          {/* <Route path="/test-map" element={<TestMap />} /> */}
          <Route path="/autocomplete" element={<AutoCompleteInput />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/discover" element={<Allplans />} />
        </Routes>
      </BodyWrapper>
      <Footer />
    </>
  );
}

export default App;
