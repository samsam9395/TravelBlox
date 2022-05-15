import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
// import blueSky from '../../images/all_plan/blue_sky.jpg';
import blueSky from '../../images/all_plan/orange_sky_brushed4.png';
import { themeColours } from '../../styles/globalTheme';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import cloudBigOne from '../../images/all_plan/cloud_1@4x.png';
import cloudBigTwo from '../../images/all_plan/cloud_2@4x.png';
import cloudBigThree from '../../images/all_plan/cloud_3@4x.png';
import cloudSmallFive from '../../images/all_plan/cloud_5@4x.png';
import cloudSmallFour from '../../images/all_plan/cloud_4@4x.png';

const cloudAnimation = keyframes`
0% {
    margin-left: -600px;
}
100% {
    margin-left: 100%;
}
`;

const cloudAnimationMiddle = keyframes`
0% {
    margin-left: -500px;
}
100% {
    margin-left: 100%;
}
`;

const CloudsContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .cloud1 {
    animation: ${cloudAnimation} 155s linear infinite;
    transform: scale(0.5);
    position: absolute;
    top: -52px;
  }

  .cloud2 {
    animation: ${cloudAnimationMiddle} 195s linear infinite;
    transform: scale(0.4);
    position: absolute;
    top: -90px;
  }

  .cloud3 {
    animation: ${cloudAnimation} 85s linear infinite;
    transform: scale(0.4);
    position: absolute;
    bottom: -104px;
    opacity: 0.7;
  }

  .cloud4 {
    animation: ${cloudAnimationMiddle} 65s linear infinite;
    transform: scale(0.4);
    position: absolute;
    /* bottom: -98px; */
    top: -71px;
  }

  .cloud5 {
    animation: ${cloudAnimation} 35s linear infinite;
    transform: scale(0.5);
    position: absolute;
    top: 105px;
  }
`;

const Wrapper = styled.div`
  width: 105vw;
  left: -100px;
  height: 530px;
  /* top: -38px;
  left: -100px;
  height: 460px; */
  position: relative;
  display: flex;
  justify-content: center;
  /* background-color: black; */

  .back_img {
    top: -102px;
    position: absolute;
    width: 110%;
    /* height: 100%; */
    object-fit: cover;
    opacity: 0.95;
    object-position: bottom;
  }
`;

const SearchContainer = styled.div`
  position: absolute;
  bottom: 50px;
  padding: 20px 40px;
  width: 74%;
  margin: auto;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 25px;
  box-shadow: 0 4px 30px rgb(0 0 0 / 10%);
  backdrop-filter: blur(3px);

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    margin: none;
  }
`;

const CallToActionText = styled.div`
  font-size: 36px;
  font-weight: 600;
  min-width: 300px;
  color: white;
  text-shadow: 1px 8px 5px #aba8a8, 9px 41px 3px rgb(0 0 0 / 0%);

  .text_where {
    font-size: 48px;
  }

  .text_are_you {
    text-align: center;
    padding-left: 30px;
  }

  .text_heading_to {
    display: flex;
    align-items: center;
  }
  .text_heading {
    font-size: 40px;
    margin-right: 20px;
    font-style: italic;
    color: ${themeColours.light_orange};
    text-shadow: 3px 7px 5px #ffffff7a, 9px 41px 3px rgb(0 0 0 / 0%);
  }
  @media (max-width: 768px) {
    margin-bottom: 30px;
    width: 70%;
    line-height: 2em;

    .text_are_you {
      text-align: right;
      padding-left: 30px;
    }
  }
`;

const SearchInputMUI = styled(TextField)({
  '& .MuiInputBase-input': {
    color: '#fff', // Text color
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: '#fff8', // Semi-transparent underline
  },
  '& .MuiInput-underline:hover:after': {
    borderBottomColor: themeColours.light_blue, // Solid underline on hover
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: themeColours.light_blue, // Solid underline on focus
  },
  '.css-1a1fmpi-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before':
    {
      borderBottomColor: '#fff8',
    }, //.css-1a1fmpi-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before
});

function SkyMainImg({ inputValue, setInputValue }) {
  return (
    <Wrapper>
      <img className="back_img" src={blueSky} alt="" />
      <div className="img_container"></div>
      <CloudsContainer>
        <div className="cloud1">
          <img src={cloudBigOne} alt="" />
        </div>
        <div className="cloud2">
          <img src={cloudBigTwo} alt="" />
        </div>
        <div className="cloud3">
          <img src={cloudBigThree} alt="" />
        </div>
        <div className="cloud4">
          <img src={cloudSmallFour} alt="" />
        </div>
        <div className="cloud5">
          <img src={cloudSmallFive} alt="" />
        </div>
      </CloudsContainer>

      <SearchContainer>
        <CallToActionText>
          <div className="text_where">Where</div>
          <div className="text_are_you">are you</div>{' '}
          <div className="text_heading_to">
            {' '}
            <div className="text_heading">heading</div>?
          </div>
        </CallToActionText>
        <SearchInputMUI
          variant="standard"
          fullWidth
          id="standard-adornment-amount"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon
                position="start"
                style={{ color: themeColours.light_orange }}>
                Search
              </SearchIcon>
            ),
          }}></SearchInputMUI>
      </SearchContainer>
    </Wrapper>
  );
}

export default SkyMainImg;
