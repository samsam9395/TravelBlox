import styled, { keyframes } from 'styled-components';

import { LightBlueBtn } from '../styles/globalTheme';
import React from 'react';
import astronaunt from '../images/404/astronaut_mono.png';
import spaceBg from '../images/404/space_bg.png';
import { useNavigate } from 'react-router-dom';

const float = keyframes`
	0% {
		transform: translatey(0px);
	}
	50% {
		transform: translatey(-40px);
	}
	100% {
		transform: translatey(0px);
	}
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AstronautImg = styled.img`
  width: 200px;
  position: absolute;
  top: 60%;
  right: 20%;

  animation: ${float} 6s ease-in-out infinite;
`;

const Title = styled.div`
  font-size: 225px;
  color: white;
  font-weight: 800;
  position: absolute;
  top: 8%;
  left: 35%;

  .subtext {
    font-size: 0.2em;
    text-shadow: 3px 5px 2px #474747;
  }
`;

const BackBtnContainer = styled.div`
  position: absolute;
  top: 65%;
  right: 43%;
`;

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <BackgroundImage src={spaceBg} />
      <AstronautImg src={astronaunt} />
      <Title>
        404
        <div className="subtext">
          Oops, <br /> looks like you are lost in space
        </div>
      </Title>
      <BackBtnContainer>
        <LightBlueBtn
          fontSize="20px"
          padding="15px 25px"
          onClick={() => navigate('/')}>
          Head back to earth
        </LightBlueBtn>
      </BackBtnContainer>
    </Wrapper>
  );
}

export default PageNotFound;
