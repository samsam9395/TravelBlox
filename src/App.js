import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/alertStyles.scss';
import 'sweetalert2/src/sweetalert2.scss';

import { Route, Routes } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
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
import firebaseDB from './utils/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const db = firebaseDB();

export const UserContext = createContext();

function App() {
  const [defaultImg, setDefaultImg] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [hasSignedIn, setHasSignedIn] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.accessToken) {
        console.log(user, user.accessToken);
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

  // useEffect(() => {
  //   hasSignedIn ? navigate('/discover') : navigate('/');
  // }, []);

  useEffect(async () => {
    const docSnap = await getDoc(
      doc(db, 'main-components', 'default_plan_img')
    );

    setDefaultImg(docSnap.data().default_plan_img);
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
