import styled, { keyframes } from 'styled-components';

import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import blueSky from '../../images/all_plan/orange_sky_brushed4.png';
import cloudBigOne from '../../images/all_plan/cloud_1@4x.png';
import cloudBigThree from '../../images/all_plan/cloud_3@4x.png';
import cloudBigTwo from '../../images/all_plan/cloud_2@4x.png';
import cloudSmallFive from '../../images/all_plan/cloud_5@4x.png';
import cloudSmallFour from '../../images/all_plan/cloud_4@4x.png';
import { themeColours } from '../../styles/globalTheme';

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
  overflow: hidden;

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
  max-width: 100vw;
  height: 530px;

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
  top: 5%;
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
    font-size: 60px;
    top: 20%;

    .sub_title {
      font-size: 20px;
    }
  }
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 45%;
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
    padding: 20px;
    width: 80%;
    margin: none;
    top: 55%;
  }
`;

const SearchInputMUI = styled(TextField)({
  'padding-left': '20px',
  '& .MuiInput-placeholder': {
    opacity: 1,
  },
  '& .MuiInputBase-input': {
    color: 'black',
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: '#fff8',
  },
  '& .MuiInput-underline:hover:after': {
    borderBottomColor: themeColours.light_blue,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: themeColours.light_blue,
  },
  '.css-1a1fmpi-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled):before':
    {
      borderBottomColor: '#fff8',
    },
});

SkyMainImg.propTypes = {
  inputValue: PropTypes.string,
  setInputValue: PropTypes.func,
};

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
          autoComplete="off"
          sx={{
            input: {
              '&::placeholder': {
                opacity: 0.7,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <SearchIcon
                position="start"
                style={{
                  color: '#fb7f24',
                  fontSize: '30px',
                }}>
                Search
              </SearchIcon>
            ),
          }}></SearchInputMUI>
      </SearchContainer>
    </Wrapper>
  );
}

export default SkyMainImg;
