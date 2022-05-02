import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GetWeather } from '../../utils/api';
import './weather.scss';
import { themeColours } from '../../utils/globalTheme';

const WeatherCard = styled.div`
  width: 350px;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
`;

const SectionText = styled.div`
  color: ${themeColours.pale};
  font-weight: 600;
  letter-spacing: 2px;
  /* line-height: 2px; */
`;

const CurrentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #00bbff;
  height: 300px;
  border-radius: 15px 15px 0 0;
  margin: 0;
  padding-top: 55px;
  
  .todayDate {
      font-size: 20px;
    font-weight: 800;
    padding-top: 25px;
    letter-spacing: 4px;
    margin-bottom: 10px;
    color: ${themeColours.orange};
    text-shadow: 2px ${themeColours.light_orange};
 
  }
  .mainText {
    font-weight: 800;
    letter-spacing: 3px;
    margin-bottom: 25px;
    color: ${themeColours.dark_blue};
  }
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

function WeatherCom({ lat, lon }) {
  const [weatherData, setWeatherData] = useState(null);

  function getIcon(iconID) {
    return `http://openweathermap.org/img/wn/${iconID}@2x.png`;
  }

  function currentWeather(status) {
    switch (status) {
      case 'Clouds':
        console.log(status);
        return <div class="cloudy"></div>;
        break;
      case 'Rain':
        console.log(status);
        return <div class="rainy"></div>;
      case 'Thunderstorm':
        console.log(status);
        return <div class="stormy"></div>;
      case 'Drizzle':
        return <div class="rainy"></div>;
      case 'Clear':
        console.log(status);
        return <div class="sunny"></div>;
      case 'Snow':
        return <div class="starry"></div>;
      default:
        return <div class="rainbow"></div>;
        break;
    }
  }

  useEffect(async () => {
    const data = await GetWeather(34.685109, 135.8048019);
    // const data = await GetWeather(lat, lon);
    console.log(data.data.current);
    console.log(data.data.current.weather[0].main);
    setWeatherData(data.data);
  }, []);

  console.log(weatherData);

  return (
    weatherData && (
      <WeatherCard>
        <CurrentSection>
          {currentWeather(weatherData.current.weather[0].main)}

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
          {weatherData.daily.map((e) => {
            console.log('a', new Date(e.dt * 1000).getDay());
            console.log('b', new Date(weatherData.current.dt * 1000).getDay());
            if (
              new Date(e.dt * 1000).getDay() !=
              new Date(weatherData.current.dt * 1000).getDay()
            ) {
              return (
                <DailyContainer>
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

export default WeatherCom;

{
  /* <h1>Minimalistic Weather </h1>

<div class="container">
  <div class="sunny"></div>
  <div class="cloudy"></div>
  <div class="rainy"></div>
  <div class="rainbow"></div>
  <div class="starry"></div>
  <div class="stormy"></div>
</div> */
}
