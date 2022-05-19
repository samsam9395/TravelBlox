import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/alertStyles.scss';

import { Route, Routes } from 'react-router-dom';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import AddNewPlan from './pages/AddNewPlan';
import Allplans from './pages/AllPlans';
import Dashboard from './pages/Dashboard';
import EditPlanDetail from './pages/EditPlanDetail';
import GlobalStyle from './styles/globalStyles';
import ParallaxLanding from './pages/ParallaxLanding';
import StaticPlanDetail from './pages/StaticPlanDetail';
import Swal from 'sweetalert2';
import { Wrapper } from '@googlemaps/react-wrapper';
import firebaseDB from './utils/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const db = firebaseDB();

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
      Swal.fire('Please sign in first!');
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

      <Wrapper
        apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        libraries={['places']}>
        <Routes>
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
    </>
  );
}

export default App;
