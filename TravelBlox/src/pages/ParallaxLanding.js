import React, { useContext, useEffect, useState } from 'react';

import Login from './Login';
import { UserContext } from '../App';
import bg from '../images/parallx_img_layers/bg_full.png';
import bird from '../images/parallx_img_layers/bird.png';
import { fonts } from '../styles/globalTheme';
import mountain from '../images/parallx_img_layers/mountain.png';
import styled from 'styled-components';
import tree from '../images/parallx_img_layers/tree_long.png';
import { useNavigate } from 'react-router-dom';

const SectionWrapper = styled.div`
  top: -80px;
  height: 100vh;
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
`;

const BgImg = styled.img.attrs(({ rightValue }) => ({
  style: {
    right: rightValue * 0.5 + 'px',
  },
}))`
  width: 300%;
  position: absolute;
  height: 100%;
  object-fit: cover;
  top: 0;
  position: absolute;
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
  width: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;

  .content_section {
    display: flex;
    margin-bottom: 70px;
    height: 200px;
    align-items: center;
    justify-content: center;
  }

  .description_text_title {
    padding: 10px 20px;
    font-size: 4em;
    width: 500px;
    font-family: ${fonts.secondary_font};
    position: relative;

    .highlight {
      background-color: #e7ac818f;
      width: 50%;
      height: 22%;
      position: absolute;
      bottom: 0;
    }
  }

  .mid_title {
    text-align: center;
    padding: 10px 20px;
  }

  .description_text_container {
    width: 400px;

    .description_text {
      font-size: 1em;
      text-align: start;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0 15px;
  }
`;

function ParallaxLanding() {
  const [scrollYValue, setscrollYValue] = useState(0);

  const userInfo = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener(
      'scroll',
      () => {
        let value = window.scrollY;
        setscrollYValue(value);
      },
      []
    );
  }, []);

  useEffect(() => {
    if (userInfo) {
      navigate('/discover');
    }
  }, [userInfo]);

  return (
    <>
      <SectionWrapper>
        <MainTtitle>TRAVELBLOX</MainTtitle>
        <BgImg src={bg} scrollvalue={scrollYValue}></BgImg>

        <MountainImg src={mountain} scrollvalue={scrollYValue}></MountainImg>
        <TreeImg src={tree} scrollvalue={scrollYValue}></TreeImg>
        <BirdImg src={bird} scrollvalue={scrollYValue}></BirdImg>
      </SectionWrapper>

      <SubSection>
        <ContentContainer>
          <div className="content_section">
            <div className="description_text_title">
              DRAG {'\u0026'}
              <br /> DROP
              <div className="highlight"></div>
            </div>
            <div className="description_text_container">
              <div className="description_text">
                Simply drag and drop timeblocks, and your travel schedule is
                good to go!
              </div>
            </div>
          </div>

          <div className="content_section">
            <div className="description_text_container">
              <div className="description_text">
                Wanting to travel, but not sure what attractions or places to
                go? Discover travel experience and plans shared by others!
                Favourite them, and customize it into your own!
              </div>
            </div>

            <div className="description_text_title mid_title">
              FAVOURITE {'\u0026'}
              <br />
              IMPORT
              <div className="highlight" style={{ left: '25%' }}></div>
            </div>
          </div>

          <div className="content_section">
            <div className="description_text_title">
              PLAN {'\u0026'} <br /> EXPORT
              <div className="highlight"></div>
            </div>
            <div className="description_text_container">
              <div className="description_text">
                Satisfied with your travel plan? Export to your google calendar,
                integrate it with your own personal timetable and ready for your
                trip!
              </div>
            </div>
          </div>
        </ContentContainer>
      </SubSection>
      <Login />
    </>
  );
}

export default ParallaxLanding;