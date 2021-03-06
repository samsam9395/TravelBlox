import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/alertStyles.scss';
import 'sweetalert2/src/sweetalert2.scss';

import { Route, Routes } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import AddNewPlan from './pages/AddNewPlan';
import Allplans from './pages/AllPlans';
import Dashboard from './pages/Dashboard';
import EditPlanDetail from './pages/EditPlanDetail';
import GlobalStyle from './styles/globalStyles';
import PageNotFound from './pages/PageNotFound';
import ParallaxLanding from './pages/ParallaxLanding';
import StaticPlanDetail from './pages/StaticPlanDetail';
import { Wrapper } from '@googlemaps/react-wrapper';
import firebaseService from './utils/fireabaseService';

export const UserContext = createContext();

function App() {
  const [defaultImg, setDefaultImg] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.accessToken) {
        setUserInfo({
          userToken: user.accessToken,
          userEmail: user.email,
        });

        return user;
      } else {
        setUserInfo(null);
        return false;
      }
    });
    return subscribe;
  }, []);

  useEffect(() => {
    const defaultPlanImage = firebaseService.fetchDefaultPlanImage();
    defaultPlanImage.then((image) => setDefaultImg(image));
  }, []);

  return (
    <UserContext.Provider value={userInfo}>
      <GlobalStyle />

      <Wrapper
        apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        libraries={['places']}>
        <Routes>
          <Route path="/" element={<ParallaxLanding />} />
          <Route
            path="/edit-plan-detail/:planDocRef"
            element={<EditPlanDetail />}
          />
          <Route
            path="/new-plan"
            element={<AddNewPlan defaultImg={defaultImg} />}
          />
          <Route
            path="/new-plan/:createdPlanId"
            element={<AddNewPlan defaultImg={defaultImg} />}
          />
          <Route
            path="/static-plan-detail/:planDocRef"
            element={<StaticPlanDetail />}
          />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/discover"
            element={<Allplans defaultImg={defaultImg} />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Wrapper>
    </UserContext.Provider>
  );
}

export default App;
