import React, { useEffect, useState } from 'react';

import Login from './Login';
import bg from '../images/parallx_img_layers/bg_full.png';
import bird from '../images/parallx_img_layers/bird.png';
import { fonts } from '../styles/globalTheme';
import mountain from '../images/parallx_img_layers/mountain.png';
import starsbg from '../images/parallx_img_layers/stars.png';
import styled from 'styled-components';
import tree from '../images/parallx_img_layers/tree_long.png';

const SectionWrapper = styled.div`
  top: -80px;
  height: calc(100vh + 80px);
  position: relative;
  background-color: #e0b99f;
  overflow: hidden;
`;

const MainTtitle = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  font-size: 6rem;
  transform: translate(-50%, -30%);
  color: white;
  z-index: 1;
  font-weight: 600;
  text-shadow: 0 0 4px #ffffff;

  @media (max-width: 768px) {
    font-size: 3em;
    top: 35%;
  }
`;

const BgStaticImg = styled.img`
  width: 100%;
  position: absolute;
  height: 100%;
  object-fit: cover;
  top: 45px;
  position: absolute;
`;

const BgImg = styled.img.attrs(({ scrollvalue }) => ({
  style: {
    right: scrollvalue * 0.5 + 'px',
  },
}))`
  width: 100%;
  position: absolute;
  height: 100%;
  object-fit: cover;
  top: 0;
  position: absolute;
  z-index: 1;
`;

const MountainImg = styled.img.attrs(({ scrollvalue }) => ({
  style: {
    top: scrollvalue * 1.8 + 'px',
  },
}))`
  width: 100%;
  position: absolute;
  height: 100%;
  object-fit: cover;
  top: 0;
  left: 0;
  position: absolute;
  z-index: 1;
`;

const TreeImg = styled.img`
  width: 100%;
  position: absolute;
  height: 60%;
  object-fit: cover;
  position: absolute;
  bottom: -96px;
  z-index: 2;
  left: 0;
`;

const BirdImg = styled.img.attrs(({ scrollvalue }) => ({
  style: {
    left: scrollvalue * 1.8 + 20 + 'px',
  },
}))`
  width: 30px;
  position: absolute;
  height: 30px;
  object-fit: cover;
  z-index: -1;
  top: 30%;
  position: absolute;
  z-index: 1;
`;

const SubsectionContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 60vh;
  text-align: center;
  top: 1050px;
`;

const SubSection = styled.div`
  height: 100vh;
  background: rgb(24, 24, 24);
  min-height: 100vh;
  z-index: 2;
  background-color: #fff;
  top: 113%;

  ::before {
    content: '';
    position: absolute;
    bottom: 0;
    height: 100px;
    background: linear-gradient(to bottom, #161719 #e0b99f);
    z-index: 100;
  }
`;

const DescriptionTextTitle = styled.div`
  padding: 10px 20px;
  font-size: 4em;
  width: 500px;
  font-family: ${fonts.secondary_font};
  position: relative;

  @media (max-width: 768px) {
    font-size: 2em;
  }
`;

const ContentSection = styled.div`
  display: flex;
  margin-bottom: 70px;
  height: 200px;
  align-items: center;
  justify-content: center;
`;

const DescriptionTextMidTitle = styled.div`
  padding: 10px 20px;
  font-size: 4em;
  width: 500px;
  font-family: ${fonts.secondary_font};
  position: relative;
  text-align: center;
  padding: 10px 20px;

  @media (max-width: 768px) {
    font-size: 2em;
  }
`;

const DescriptionTextHighLight = styled.div`
  background-color: #e7ac818f;
  width: 50%;
  height: 22%;
  position: absolute;
  bottom: 0;
`;

const ContentContainer = styled.div`
  width: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0 15px;
  }
`;

const DescriptionText = styled.div`
  font-size: 1em;
  text-align: start;
`;
const DescriptionTextContainer = styled.div`
  width: 400px;
`;

function ParallaxLanding() {
  const [scrollYValue, setscrollYValue] = useState(0);
  let width = window.innerWidth;

  useEffect(() => {
    window.addEventListener(
      'scroll',
      () => {
        let value = window.scrollY;
        setscrollYValue(value);

        if (width < 768) {
          setscrollYValue(value + 20);
        }
      },
      []
    );
  }, []);

  useEffect(() => {
    if (width < 768) {
      setscrollYValue(20);
    }
  }, []);

  return (
    <>
      <SectionWrapper>
        <MainTtitle>TRAVELBLOX</MainTtitle>
        // <BgImg src={starsbg} scrollvalue={scrollYValue} />
        <BgStaticImg src={bg} />
        <MountainImg src={mountain} scrollvalue={scrollYValue} />
        <TreeImg src={tree} scrollvalue={scrollYValue} />
        <BirdImg src={bird} scrollvalue={scrollYValue} />
      </SectionWrapper>

      <SubSection>
        <ContentContainer>
          <ContentSection>
            <DescriptionTextTitle>
              DRAG {'\u0026'}
              <br /> DROP
              <DescriptionTextHighLight />
            </DescriptionTextTitle>
            <DescriptionTextContainer>
              <DescriptionText>
                Simply drag and drop timeblocks, and your travel schedule is
                good to go!
              </DescriptionText>
            </DescriptionTextContainer>
          </ContentSection>

          <ContentSection>
            <DescriptionTextContainer>
              <DescriptionText>
                Wanting to travel, but not sure what attractions or places to
                go? Discover travel experience and plans shared by others!
                Favourite them, and customize it into your own!
              </DescriptionText>
            </DescriptionTextContainer>

            <DescriptionTextMidTitle>
              FAVOURITE {'\u0026'}
              <br />
              IMPORT
              <DescriptionTextHighLight
                style={{ left: '25%' }}></DescriptionTextHighLight>
            </DescriptionTextMidTitle>
          </ContentSection>

          <ContentSection>
            <DescriptionTextTitle>
              PLAN {'\u0026'} <br /> EXPORT
              <DescriptionTextHighLight />
            </DescriptionTextTitle>
            <DescriptionTextContainer>
              <DescriptionText>
                Satisfied with your travel plan? Export to your google calendar,
                integrate it with your own personal timetable and ready for your
                trip!
              </DescriptionText>
            </DescriptionTextContainer>
          </ContentSection>
        </ContentContainer>
      </SubSection>
      <Login />
    </>
  );
}

export default ParallaxLanding;
