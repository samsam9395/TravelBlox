import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getDocs, collection } from 'firebase/firestore';
import Login from './Login';
import firebaseDB from '../utils/firebaseConfig';
import ParallaxLanding from './ParallaxLanding';

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

const SubSectionSample = styled.div`
  position: relative;
  padding: 100px;
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
      <SubSectionSample>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut dolor
          perferendis atque quisquam ullam inventore, in a doloremque tempora,
          cumque vero sunt delectus ipsum nemo saepe animi quia tenetur optio!
          Doloremque, consectetur praesentium accusamus necessitatibus quos
          vitae unde vero totam, vel repudiandae similique hic sint provident
          expedita possimus. Dignissimos unde illum commodi cum tenetur ullam
          possimus repudiandae ipsam sit nobis. Totam eligendi deserunt
          repellendus illo tempore excepturi molestias. Harum minima qui
          repudiandae iusto, optio quasi dolorem velit doloremque sunt
          distinctio dolor praesentium officiis est. Facere ab maiores soluta
          asperiores ut.
        </p>
      </SubSectionSample>
      {/* <Login
        setHasSignedIn={setHasSignedIn}
        hasSignedIn={hasSignedIn}
        setUser={props.setUser}
      /> */}
    </Wrapper>
  );
}

export default LandingPage;
