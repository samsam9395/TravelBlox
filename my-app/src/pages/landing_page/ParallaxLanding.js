import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import bg from '../../images/parallx_img_layers/bg_full.png';
import mountain from '../../images/parallx_img_layers/mountain.png';
import tree from '../../images/parallx_img_layers/tree_long.png';
import orangeCar from '../../images/parallx_img_layers/orange_car.jpg';

const SectionWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  left: -82px;
  position: relative;
  /* background-color: #e0b99f; */
  background-color: #e0b99f;
`;

const DescriptionText = styled.div`
  padding: 2rem 20rem;
  font-size: 1.1rem;
`;

const MainTtitle = styled.div`
  position: absolute;
  top: 25%;
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
  top: ${(props) => `${props.scrollvalue * 1}px`};
  z-index: 1;
`;

const TreeImg = styled.img`
  width: 100%;
  position: absolute;
  height: 60%;
  object-fit: cover;
  z-index: -1;
  position: absolute;
  bottom: 0;
  /* bottom: ${(props) => `${props.scrollvalue * 0.5}px`}; */
  z-index: 2;
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
  top: 93%;

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

function ParallaxLanding() {
  const [scrollYValue, setscrollYValue] = useState(0);
  console.log(scrollYValue);

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
      </SectionWrapper>
      <SubSection>
        <ContentContainer></ContentContainer>
        {/* <div className="content-images">
          <DescriptionText>FAVOURITE TRAVEL PLANS</DescriptionText>
          <DescriptionText>DRAG AND DROP YOUR EVENT</DescriptionText>
          <DescriptionText>EXPORT AS YOUR OWN CALENDAR</DescriptionText>
        </div> */}
      </SubSection>
    </section>
  );
}

export default ParallaxLanding;
