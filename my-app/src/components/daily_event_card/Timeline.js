import React, { useEffect, useRef } from 'react';

import styled from 'styled-components';
import { themeColours } from '../../styles/globalTheme';

const Container = styled.div`
  margin-right: 15px;
  transition: top 0.2s ease;
  font-size: 16px;
  flex: 0 0 100px;
`;
const DayBox = styled.div`
  top: 155px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 20px;
  letter-spacing: 0.4px;
  font-family: 'Oswald', sans-serif;
  position: sticky;
  height: 200px;
  width: 100px;

  @media (max-width: 768px) {
    margin-top: 30px;
    width: auto;
    top: 78px;
    flex-direction: row;
    align-items: center;
    height: 45px;
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 10px 20px 0 rgb(31 38 135 / 30%);
    backdrop-filter: blur(2.5px);
    -webkit-backdrop-filter: blur(2.5px);
    border-radius: 20px;
    padding: 0 15px;
    z-index: 1;
  }
`;

const Day = styled.div`
  font-weight: 500;
  width: 30px;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    margin-bottom: 0;
    margin-right: 10px;
    height: 30px;
  }
`;

const NumberofDay = styled.div`
  text-align: center;
  margin-bottom: 15px;
  width: 28px;
  text-align: center;
  &:hover {
    background-color: ${themeColours.light_blue} !important;
    border-radius: 50% !important;
  }
  @media (max-width: 768px) {
    margin-bottom: 0;
    width: 30px;
  }
`;

const scrollEffect = (targetRef, index) => {
  targetRef.current[index].current.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

function Timeline({ NumofDays, RefList, timelineRefArray, stopTimelineNav }) {
  const timelineRef = useRef([]);
  let doPushRef = true;

  if (stopTimelineNav === 'none') {
    doPushRef = false;
  }

  useEffect(() => {
    timelineRefArray.current.push(timelineRef);
  }, []);

  return (
    // <Container>
    <DayBox>
      <Day>Day</Day>
      {[...Array(NumofDays)].map((e, index) => (
        <NumberofDay
          style={{ pointerEvents: stopTimelineNav }}
          ref={
            doPushRef
              ? (element) => {
                  timelineRef.current[index] = element;
                }
              : undefined
          }
          key={index}
          className="hoverCursor"
          onClick={() => scrollEffect(RefList, index)}>
          {index + 1}
        </NumberofDay>
      ))}
    </DayBox>
    // </Container>
  );
}

export default Timeline;
