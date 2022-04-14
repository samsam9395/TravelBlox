import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  InputLabel,
  TextField,
  Button,
  FormControl,
  MenuItem,
  Select,
  IconButton,
  Box,
  Card,
  CardMedia,
  CircularProgress,
} from '@mui/material';
import PlanCalendar from '.././pages/Calendar';
import { display } from '@mui/system';

const SampleDiv = styled.div`
  border: 1px solid grey;
`;

const SingleDayWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const TimeMapContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  padding-right: 15px;
  display: flex;
  flex-direction: column;
`;

const DayScheduleContainer = styled.div`
  min-height: 400px;
  border: 1px solid black;
  margin-bottom: 20px;
`;

const DayMapContainer = styled.div`
  min-height: 300px;
  border: 1px solid black;
  margin-bottom: 20px;
`;

function TimeBlockCard() {
  return (
    <>
      <SingleDayWrapper>
        <ContentContainer>
          <h2>Day 1</h2>
          <div className="content">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus
            reprehenderit dolorum aspernatur molestias nihil modi praesentium
            magni vero odio! Voluptates explicabo saepe velit nesciunt adipisci,
            natus officia facilis excepturi distinctio. Aliquam, tenetur quasi!
            Est deserunt consequuntur culpa. Officiis sed unde corrupti
            voluptates, ut incidunt, nihil maiores magnam aperiam explicabo rem
            voluptatibus praesentium accusantium quod laborum veritatis!
            Molestiae ea soluta dolore. Porro totam omnis fuga! Deserunt,
            deleniti beatae! Iste nobis ullam esse temporibus earum quasi
            asperiores, ipsa obcaecati fugit. Optio repellendus suscipit
            dignissimos incidunt sequi maxime praesentium? Rerum minus saepe
            aut.
          </div>
          <SampleDiv>
            <span>image here</span>
            <img src="" alt="" />
          </SampleDiv>
        </ContentContainer>

        <TimeMapContainer>
          <DayScheduleContainer>Calendar Here</DayScheduleContainer>
          <DayMapContainer>Map Here</DayMapContainer>
        </TimeMapContainer>
      </SingleDayWrapper>
    </>
  );
}

export default TimeBlockCard;
