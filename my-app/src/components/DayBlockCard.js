import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PlanCalendar from '../pages/Calendar';
import { display } from '@mui/system';
import MapCard from './MapCard';
import * as ReactDom from 'react-dom';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import GoogleAPI from '../utils/GoogleAPI';

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

const render = function (status) {
  return <h1>{status}</h1>;
};

const googleAPIKey = GoogleAPI();

// const render = (status) => {
//   switch (status) {
//     case Status.LOADING:
//       console.log(loading);
//     // return <Spinner />;
//     case Status.FAILURE:
//       console.log(failed);

//     // return <ErrorComponent />;
//     case Status.SUCCESS:
//       return <MapCard />;
//   }
// };

function DayBlockCard() {
  const [center, setCenter] = useState({
    lat: 0,
    lng: 0,
  });
  const zoom = 4;

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
          {/* <Wrapper apiKey={googleAPIKey} render={render}> */}
          <MapCard />
          {/* </Wrapper> */}
        </TimeMapContainer>
      </SingleDayWrapper>
    </>
  );
}

export default DayBlockCard;
