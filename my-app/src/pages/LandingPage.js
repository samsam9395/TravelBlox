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

const db = firebaseDB();

const MainImage = styled.img`
  margin-top: 80px;
  width: 100%;
`;

function LandingPage(props) {
  const [mainImage, setMainImage] = useState(null);
  const [hasSignedIn, setHasSignedIn] = useState(false);
  // const [isNewUser, setIsNewUser] = useState(false);
  const [canRedirect, setCanRedirect] = useState(false);

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
    // if (localStorage.getItem('accessToken')) {
    //   setCanRedirect(true);
    //   console.log('accessToken is  ', localStorage.getItem('accessToken'));
    // }
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
