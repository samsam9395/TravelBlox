import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import bg from '../images/parallx_img_layers/bg_full.png';
import mountain from '../images/parallx_img_layers/mountain.png';
import tree from '../images/parallx_img_layers/tree_long.png';
import bird from '../images/parallx_img_layers/bird.png';
import { getDocs, collection } from 'firebase/firestore';
import Login from './Login';
import firebaseDB from '../utils/firebaseConfig';

const db = firebaseDB();

const SectionWrapper = styled.div`
  top: -80px;
  left: -80px;
  height: 100vh;
  width: 100vw;
  /* left: -82px; */
  position: relative;
  /* background-color: #e0b99f; */
  background-color: #e0b99f;
  overflow: hidden;
`;

const DescriptionText = styled.div`
  padding: 2rem 20rem;
  font-size: 1.1rem;
`;

const MainTtitle = styled.div`
  position: absolute;
  top: 28%;
  left: 50%;
  font-size: 6rem;
  transform: translate(-50%, -30%);
  color: white;
  z-index: 1;
`;

const BgImg = styled.img`
  width: 300%;
  position: absolute;
  height: 100%;
  object-fit: cover;
  top: 0;
  position: absolute;
  right: ${(props) => `${props.scrollvalue * 0.5}px`};
`;

const MountainImg = styled.img`
  width: 100%;
  position: absolute;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  top: 0;
  position: absolute;
  top: ${(props) => `${props.scrollvalue * 1.8}px`};
  z-index: 1;
`;

const TreeImg = styled.img`
  width: 100%;
  position: absolute;
  height: 60%;
  object-fit: cover;
  z-index: -1;
  position: absolute;
  bottom: -96px;
  /* bottom: ${(props) => `${props.scrollvalue * 0.5}px`}; */
  z-index: 2;
`;

const BirdImg = styled.img`
  width: 30px;
  position: absolute;
  height: 30px;
  object-fit: cover;
  z-index: -1;
  top: 30%;
  position: absolute;
  left: ${(props) => `${props.scrollvalue * 1.8 + 20}px`};
  z-index: 1;
`;

const SubSection = styled.div`
  height: 100vh;
  width: 110vw;
  left: -82px;
  background: rgb(24, 24, 24);
  min-height: 100vh;
  z-index: 2;
  position: absolute;
  background-color: #fff;
  top: 103%;

  ::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 110vw;
    height: 100px;
    background: linear-gradient(to bottom, #161719 #e0b99f);
    z-index: 100;
  }
  /* style={{background: "linear-gradient(#e66465, #9198e5);" }} */

  .subsection_container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    min-height: 60vh;
    text-align: center;
    top: 1050px;
  }

  .text {
    padding: 2rem 2rem;
    font-size: 1.1rem;
  }

  .content-images {
    padding: 0 220px;
  }
`;

const ContentContainer = styled.div`
  height: 100px;
`;

function ParallaxLanding({ user, setUser }) {
  const [scrollYValue, setscrollYValue] = useState(0);
  // const [mainImage, setMainImage] = useState(null);
  const [hasSignedIn, setHasSignedIn] = useState(false);

  // useEffect(async () => {
  //   const querySnapshot = await getDocs(collection(db, 'main-components'));
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.data().landing_main_img);
  //     if (doc.data().landing_main_img) {
  //       setMainImage(doc.data().landing_main_img);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);
  // console.log(scrollYValue);

  useEffect(() => {
    window.addEventListener(
      'scroll',
      () => {
        let value = window.scrollY;
        setscrollYValue(value);
      },
      []
    );
  });

  return (
    <section>
      <SectionWrapper>
        <MainTtitle>TRAVELBLOX</MainTtitle>
        <BgImg src={bg} scrollvalue={scrollYValue}></BgImg>

        <MountainImg src={mountain} scrollvalue={scrollYValue}></MountainImg>
        <TreeImg src={tree} scrollvalue={scrollYValue}></TreeImg>
        <BirdImg src={bird} scrollvalue={scrollYValue}></BirdImg>
      </SectionWrapper>

      <SubSection>
        {/* <ContentContainer></ContentContainer> */}
        {/* <div className="content-images">
          <DescriptionText>FAVOURITE TRAVEL PLANS</DescriptionText>
          <DescriptionText>DRAG AND DROP YOUR EVENT</DescriptionText>
          <DescriptionText>EXPORT AS YOUR OWN CALENDAR</DescriptionText>
        </div> */}
        <Login
          setHasSignedIn={setHasSignedIn}
          hasSignedIn={hasSignedIn}
          setUser={setUser}
        />
      </SubSection>
    </section>
  );
}

export default ParallaxLanding;
