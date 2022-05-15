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
    margin-left: -650px;
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
    animation: ${cloudAnimation} 125s linear infinite;
    transform: scale(0.5);
    position: absolute;
    top: -52px;
  }

  .cloud2 {
    animation: ${cloudAnimationMiddle} 185s linear infinite;
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
    top: 65px;
  }

  @media (max-width: 768px) {
    .cloud1 {
      transform: scale(0.4);
      top: -138px;
    }

    .cloud2 {
      transform: scale(0.3);
      top: -180px;
    }

    .cloud3 {
      transform: scale(0.3);
      bottom: -64px;
    }

    .cloud4 {
      transform: scale(0.3);
      top: -31px;
    }

    .cloud5 {
      transform: scale(0.4);
      top: 85px;
    }
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

  .back_img {
    top: -200px;
    position: absolute;
    width: 100%;
    height: 780px;
    object-fit: cover;
    /* opacity: 0.95; */
    object-position: bottom;
  }

  @media (max-width: 768px) {
    font-size: 70px;
    height: 380px;

    .back_img {
      top: -100px;
      height: 500px;
    }
  }
`;

const TitleText = styled.div`
  position: absolute;
  top: 0;
  left: 15%;
  font-size: 120px;
  font-weight: 600;
  min-width: 300px;
  color: white;
  text-shadow: 1px 8px 5px #aba8a8, 9px 41px 3px rgb(0 0 0 / 0%);
  display: flex;
  flex-direction: column;

  .sub_title {
    font-size: 30px;
    font-weight: 200;
    margin-top: -10px;
    text-align: right;
  }

  @media (max-width: 768px) {
    font-size: 70px;

    .sub_title {
      font-size: 20px;
    }
  }
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 40%;
  padding: 30px 40px;
  width: 70%;
  margin: auto;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.22);
  border-radius: 25px;
  box-shadow: 0 4px 30px rgb(0 0 0 / 10%);
  backdrop-filter: blur(3px);

  @media (max-width: 768px) {
    width: 60%;
    margin: none;
  }
`;

const SearchInputMUI = styled(TextField)({
  'padding-left': '20px',
  '& .MuiInputBase-input': {
    color: 'black', // Text color
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

      <TitleText>
        Discover.
        <div className="sub_title"> {'\u2E3A'} Your next journey</div>
      </TitleText>

      <SearchContainer>
        <SearchInputMUI
          placeholder="Search travel plans by country, title or author"
          variant="standard"
          fullWidth
          id="standard-adornment-amount"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon
                position="start"
                style={{ color: '#fb7f24', fontSize: '30px' }}>
                Search
              </SearchIcon>
            ),
          }}></SearchInputMUI>
      </SearchContainer>
    </Wrapper>
  );
}

export default SkyMainImg;
