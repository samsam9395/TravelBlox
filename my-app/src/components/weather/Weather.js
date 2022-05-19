import './weather.scss';

import React, { useEffect, useState } from 'react';
import { fonts, themeColours } from '../../styles/globalTheme';

import BeatLoader from 'react-spinners/BeatLoader';
import WatercolourBluePng from '../../images/static/watercolour_blue2.png';
import { getWeather } from '../../utils/api';
import goldenSparkSimple from '../../images/static/golden_spark_simple.png';
import styled from 'styled-components';

const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  .loader {
    margin: auto;
    transform: translate(-50%, -50%);
  }
`;

const WeatherCard = styled.div`
  max-width: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  margin: 0 auto 60px auto;
  position: relative;

  .watercolour_background {
    width: 95%;
    position: absolute;
    top: 20px;
    right: 1%;
    transform: rotate(344deg);
  }

  .golden_spark_simple_left {
    height: 48px;
    position: absolute;
    top: 66px;
    left: -16px;
    padding: 5px 0;
    background-color: white;
  }
  .golden_spark_simple_right {
    height: 48px;
    position: absolute;
    bottom: 69px;
    right: -17px;
    padding: 5px 0;
    background-color: white;
  }

  .right_side_text {
    writing-mode: vertical-rl;
    font-family: ${fonts.main_font};
    font-size: 10px;
    position: absolute;
    right: -13px;
    top: 50px;
  }

  .empty_ellipse {
    height: 6%;
    width: 19%;
    border-radius: 50%;
    background-color: transparent;
    border: 1px solid #e7ac81;
    position: absolute;
    right: -24px;
    transform: rotate(345deg);
    top: -10px;
  }

  .second {
    top: 0px;
  }

  .third {
    top: 10px;
  }

  .forth {
    top: 20px;
  }

  .fifth {
    top: 30px;
  }
`;

const CurrentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background: ${themeColours.blue}; */
  /* box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); */
  height: 315px;
  /* border-radius: 15px 15px 0 0; */
  margin: 0;
  background-color: #fdfdfd;
  border: 2px solid #e7ac81;
  border-radius: 70px 0 0 0;
  border-bottom: 0;

  .todayDate {
    font-size: 20px;
    font-weight: 800;
    padding-top: 25px;
    letter-spacing: 4px;
    margin-bottom: 10px;
    color: ${themeColours.light_orange};
    text-shadow: 2px 1px ${themeColours.dark_blue};
    font-family: ${fonts.secondary_font};
    z-index: 1;
  }
  .mainText {
    font-weight: 800;
    letter-spacing: 3px;
    margin-bottom: 25px;
    color: ${themeColours.dark_blue};
  }
`;

const SubInfoWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  grid-column-gap: 20px;
  grid-row-gap: 8px;
  padding: 0 15px;
  color: ${themeColours.dark_blue};
  /* justify-items: stretch;
  align-items: stretch; */
`;

const SubInfoContainer = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: 200;
  align-items: center;
  justify-content: space-evenly;
`;

const SubInfoTitle = styled.div`
  margin-right: 10px;
  font-weight: normal;
  position: relative;

  .highlighter {
    position: absolute;
    height: 66%;
    width: 60%;
    top: 9px;
    background-color: #e7ac8152;
    left: -6px;
  }
`;

const DailyWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  /* background: ${themeColours.light_blue}; */
  padding: 10px 0;
  /* border-radius: 0 0 10px 10px; */

  border: 2px solid #e7ac81;
  border-radius: 0 0 70px 0;
  border-top: 0;
  padding-right: 30px;
`;

const DailyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DailyTempText = styled.div`
  font-size: 12px;
`;

const DailyIcon = styled.img`
  width: 100%;
  object-fit: contain;
`;

const DailyIconContainer = styled.div`
  width: 45px;
  height: 45px;
  object-fit: contain;
`;

const DailyDate = styled.div`
  font-weight: 200;
`;

const AnimationContainer = styled.div`
  width: 100%;
  height: 110px;
  /* position: absolute; */
  /* left: 50%;
  top: 50%;
  margin: -65px -360px; */
`;

// const OuterDeco = styled.div`
//   width: 257px;
//   height: 300px;
//   border-radius: 70px 0 70px 0;
// `;

function Weather({ lat, lng }) {
  const [weatherData, setWeatherData] = useState(null);

  function getIcon(iconID) {
    return `http://openweathermap.org/img/wn/${iconID}@2x.png`;
  }

  function currentWeather(status) {
    switch (status) {
      case 'Clouds':
        return <div className="cloudy"></div>;
        break;
      case 'Rain':
        return <div className="rainy"></div>;
      case 'Thunderstorm':
        return <div className="stormy"></div>;
      case 'Drizzle':
        return <div className="rainy"></div>;
      case 'Clear':
        return <div className="sunny"></div>;
      case 'Snow':
        return <div className="snowy"></div>;
      default:
        return <div className="rainbow"></div>;
        break;
    }
  }

  useEffect(async () => {
    const data = await getWeather(lat, lng);

    setWeatherData(data.data);
  }, []);

  return weatherData ? (
    <WeatherCard>
      <img
        className="watercolour_background"
        src={WatercolourBluePng}
        alt="current weather background"
      />

      <img
        className="golden_spark_simple_left"
        src={goldenSparkSimple}
        alt="golden sparkle"
      />
      <img
        className="golden_spark_simple_right"
        src={goldenSparkSimple}
        alt="golden sparkle"
      />

      <CurrentSection>
        <AnimationContainer>
          {currentWeather(weatherData.current.weather[0].main)}
        </AnimationContainer>
        <div className="todayDate">
          {new Date(weatherData.current.dt * 1000).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </div>
        <div className="mainText">
          {weatherData.current.weather[0].description}
        </div>

        <SubInfoWrapper>
          <SubInfoTitle styled={{ gridArea: 1 / 1 / 2 / 2 }}>
            Temperature:
            <div className="highlighter"></div>
          </SubInfoTitle>
          <SubInfoContainer styled={{ gridArea: 1 / 2 / 2 / 3 }}>
            {weatherData.current.temp} {'\u2103'}
          </SubInfoContainer>
          <SubInfoTitle styled={{ gridArea: 2 / 1 / 3 / 2 }}>
            Feels like:
            <div className="highlighter"></div>
          </SubInfoTitle>
          <SubInfoContainer styled={{ gridArea: 2 / 2 / 3 / 3 }}>
            {weatherData.current.feels_like} {'\u2103'}
          </SubInfoContainer>
          <SubInfoTitle styled={{ gridArea: 3 / 1 / 4 / 2 }}>
            Humidity:
            <div className="highlighter"></div>
          </SubInfoTitle>
          <SubInfoContainer styled={{ gridArea: 3 / 2 / 4 / 3 }}>
            {weatherData.current.humidity} %
          </SubInfoContainer>
        </SubInfoWrapper>
      </CurrentSection>

      <DailyWrapper>
        {weatherData.daily.map((e, index) => {
          if (
            new Date(e.dt * 1000).getDay() !=
              new Date(weatherData.current.dt * 1000).getDay() &&
            index < 6
          ) {
            return (
              <DailyContainer key={index}>
                <DailyDate>
                  {new Date(e.dt * 1000).toLocaleString(undefined, {
                    day: 'numeric',
                  })}
                </DailyDate>
                <DailyIconContainer>
                  <DailyIcon src={`${getIcon(e.weather[0].icon)}`}></DailyIcon>
                </DailyIconContainer>
                <DailyTempText>
                  {Math.trunc(e.temp.day)} {'\u2103'}
                </DailyTempText>
              </DailyContainer>
            );
          }
        })}
      </DailyWrapper>
    </WeatherCard>
  ) : (
    <LoaderContainer>
      <BeatLoader
        className="loader"
        color={themeColours.milktea}
        size={8}></BeatLoader>
    </LoaderContainer>
  );
}

export default Weather;
