import React, { useRef, useEffect } from 'react';
import { themeColours } from '../../utils/globalTheme';
import styled from 'styled-components';

const Container = styled.div`
  margin-right: 15px;
  transition: top 0.2s ease;
  font-size: 16px;
  flex: 0 0 100px;
`;
const DayBox = styled.div`
  position: sticky;
  top: 360px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 20px;
  letter-spacing: 0.4px;
  font-family: 'Oswald', sans-serif;
`;

const Day = styled.div`
  font-weight: 500;
  width: 28px;
  text-align: center;
  cursor: pointer;
  text-transform: uppercase;
  margin-bottom: 15px;
`;

const NumberofDay = styled.div`
  text-align: center;
  margin-bottom: 15px;
  background-color: transparent;
  width: 28px;
  text-align: center;

  &:hover {
    background-color: ${themeColours.lighter_blue};
    border-radius: 50%;
  }
`;

const scrollEffect = (targetRef, index) => {
  targetRef.current[index].current.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
};

function Timeline({ NumofDays, RefList, timelineRefArray }) {
  const timelineRef = useRef([]);

  useEffect(() => {
    timelineRefArray.current.push(timelineRef);
  }, []);

  return (
    <Container>
      <DayBox>
        <Day>Day</Day>
        {[...Array(NumofDays)].map((e, index) => (
          <NumberofDay
            ref={(element) => {
              timelineRef.current[index] = element;
            }}
            key={index}
            className="hoverCursor"
            onClick={() => scrollEffect(RefList, index)}>
            {index + 1}
          </NumberofDay>
        ))}
      </DayBox>
    </Container>
  );
}

export default Timeline;
