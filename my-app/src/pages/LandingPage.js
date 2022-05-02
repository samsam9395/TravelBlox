import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  getFirestore,
  doc,
  getDocs,
  collection,
  setDoc,
} from 'firebase/firestore';
import Login from './Login';
import { Navigate } from 'react-router-dom';
import firebaseDB from '../utils/firebaseConfig';
import { GetWeather } from '../utils/api';

const db = firebaseDB();

const MainImage = styled.img`
  margin-top: 80px;
  width: 100%;
`;

function LandingPage(props) {
  const [mainImage, setMainImage] = useState(null);
  const [hasSignedIn, setHasSignedIn] = useState(false);
  // const [isNewUser, setIsNewUser] = useState(false);

  useEffect(async () => {
    const querySnapshot = await getDocs(collection(db, 'main-components'));
    querySnapshot.forEach((doc) => {
      setMainImage(doc.data().image);
    });
  }, []);

  useEffect(() => {
    if (props.user) {
      console.log(props.user);
    }
    GetWeather('47.6205063', '-122.3492774');
  }, [props.user]);

  return (
    <>
      <MainImage src={mainImage} />
      <Login
        setHasSignedIn={setHasSignedIn}
        hasSignedIn={hasSignedIn}
        // setIsNewUser={setIsNewUser}
        setUser={props.setUser}
      />
      {/* {canRedirect && <Navigate to="/discover"></Navigate>} */}
    </>
  );
}

export default LandingPage;
