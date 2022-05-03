import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GetWeather } from '../../utils/api';
import './weather.scss';
import { themeColours } from '../../utils/globalTheme';

const WeatherCard = styled.div`
  width: 338px;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
`;

const CurrentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 187, 255, 0.8);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  height: 300px;
  border-radius: 15px 15px 0 0;
  margin: 0;
  /* padding-top: 55px; */

  .todayDate {
    font-size: 20px;
    font-weight: 800;
    padding-top: 25px;
    letter-spacing: 4px;
    margin-bottom: 10px;
    color: ${themeColours.orange};
    text-shadow: 2px 1px ${themeColours.dark_blue};
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
`;

const DailyWrapper = styled.div`
  display: flex;
  background: #bae7f7;
  padding: 10px 0;
  border-radius: 0 0 10px 10px;
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
  width: 50px;
  height: 50px;
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
    // const data = await GetWeather(34.685109, 135.8048019);

    console.log(111, lat, lng);
    const data = await GetWeather(lat, lng);
    // console.log(data.data.current);
    // console.log(data.data.current.weather[0].main);
    setWeatherData(data.data);
  }, []);

  // console.log(weatherData);

  return (
    weatherData && (
      <WeatherCard>
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
            </SubInfoTitle>
            <SubInfoContainer styled={{ gridArea: 1 / 2 / 2 / 3 }}>
              {weatherData.current.temp} {'\u2103'}
            </SubInfoContainer>
            <SubInfoTitle styled={{ gridArea: 2 / 1 / 3 / 2 }}>
              Feels like:
            </SubInfoTitle>
            <SubInfoContainer styled={{ gridArea: 2 / 2 / 3 / 3 }}>
              {weatherData.current.feels_like} {'\u2103'}
            </SubInfoContainer>
            <SubInfoTitle styled={{ gridArea: 3 / 1 / 4 / 2 }}>
              Humidity:
            </SubInfoTitle>
            <SubInfoContainer styled={{ gridArea: 3 / 2 / 4 / 3 }}>
              {weatherData.current.humidity} %
            </SubInfoContainer>
          </SubInfoWrapper>
        </CurrentSection>

        <DailyWrapper>
          {weatherData.daily.map((e, index) => {
            // console.log('a', new Date(e.dt * 1000).getDay());
            // console.log('b', new Date(weatherData.current.dt * 1000).getDay());
            if (
              new Date(e.dt * 1000).getDay() !=
              new Date(weatherData.current.dt * 1000).getDay()
            ) {
              return (
                <DailyContainer key={index}>
                  <DailyDate>
                    {new Date(e.dt * 1000).toLocaleString(undefined, {
                      day: 'numeric',
                    })}
                  </DailyDate>
                  <DailyIconContainer>
                    <DailyIcon
                      src={`${getIcon(e.weather[0].icon)}`}></DailyIcon>
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
    )
  );
}

export default Weather;
