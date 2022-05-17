// import './App.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalStyle from './styles/globalStyles';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import LandingPage from './pages/LandingPage';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import EditPlanDetail from './pages/EditPlanDetail';
import StaticPlanDetail from './pages/StaticPlanDetail';
import Dashboard from './pages/Dashboard';
import AddNewPlan from './pages/AddNewPlan';
import Allplans from './pages/AllPlans';

import firebaseDB from './utils/firebaseConfig';
import { getDocs, getDoc, collection, doc } from 'firebase/firestore';
import { Wrapper } from '@googlemaps/react-wrapper';
import { googleAPI } from './utils/credent';
import ParallaxLanding from './pages/ParallaxLanding';
const ApiKey = googleAPI();

const db = firebaseDB();

const ContentWrapper = styled.div`
  padding: 70px 80px 100px 80px;
  min-height: 300px;
  /* overflow: hidden; */
  overflow-x: hidden;
  /* overflow-y: scroll;  */
`;

function App() {
  const [user, setUser] = useState('');
  const [favFolderNames, setFavFolderNames] = useState(null);
  const [defaultImg, setDefaultImg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      setUser({
        accessToken: localStorage.getItem('accessToken'),
        email: localStorage.getItem('userEmail'),
      });
    } else {
      console.log('User has not signed in to app yet!');
      navigate('/');
    }
  }, [localStorage.getItem('accessToken')]);

  useEffect(async () => {
    if (user) {
      const favFolderRef = collection(db, 'userId', user.email, 'fav_folders');
      const doc = await getDocs(favFolderRef);
      const list = doc.docs.map((e) => e.data().folder_name);

      setFavFolderNames(list);
    }
  }, [user]);

  useEffect(async () => {
    const docSnap = await getDoc(
      doc(db, 'main-components', 'default_plan_img')
    );

    setDefaultImg(docSnap.data().default_plan_img);
  }, []);

  return (
    <>
      <GlobalStyle />

      <ContentWrapper>
        <Wrapper apiKey={ApiKey} libraries={['places']}>
          <Routes>
            {/* <Route
              path="/"
              element={<LandingPage user={user} setUser={setUser} />}
            /> */}
            <Route
              path="/"
              element={<ParallaxLanding user={user} setUser={setUser} />}
            />
            <Route
              path="/edit-plan-detail/:planDocRef"
              element={
                <EditPlanDetail
                  userId={user.email}
                  favFolderNames={favFolderNames}
                />
              }
            />
            <Route
              path="/new-plan/:currentUserId"
              element={<AddNewPlan user={user} defaultImg={defaultImg} />}
            />
            <Route
              path="/static-plan-detail/:planDocRef"
              element={
                <StaticPlanDetail favFolderNames={favFolderNames} user={user} />
              }
            />

            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route
              path="/discover"
              element={<Allplans defaultImg={defaultImg} user={user} />}
            />
          </Routes>
        </Wrapper>
      </ContentWrapper>
    </>
  );
}

export default App;
