import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getDocs, collection } from 'firebase/firestore';
import Login from './Login';
import firebaseDB from '../utils/firebaseConfig';
import ParallaxLanding from './landing_page/ParallaxLanding';

const db = firebaseDB();

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainImage = styled.img`
  margin-top: 40px;
  width: 100%;
  max-height: 60vh;
  object-fit: cover;
  border-radius: 15px;
`;

const Space = styled.div`
  /* margin-top: 200px; */
`;

function LandingPage(props) {
  const [mainImage, setMainImage] = useState(null);
  const [hasSignedIn, setHasSignedIn] = useState(false);

  useEffect(async () => {
    const querySnapshot = await getDocs(collection(db, 'main-components'));
    querySnapshot.forEach((doc) => {
      console.log(doc.data().landing_main_img);
      if (doc.data().landing_main_img) {
        setMainImage(doc.data().landing_main_img);
      }
    });
  }, []);

  useEffect(() => {
    if (props.user) {
      console.log(props.user);
    }
  }, [props.user]);

  return (
    <Wrapper>
      <ParallaxLanding />
      <Login
        setHasSignedIn={setHasSignedIn}
        hasSignedIn={hasSignedIn}
        setUser={props.setUser}
      />
    </Wrapper>
  );
}

export default LandingPage;
