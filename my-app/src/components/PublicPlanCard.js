import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const SinglePlanContainer = styled.div`
  width: 350px;
  height: 450px;
  display: flex;
  flex-direction: column;
  margin: 20px 30px;
  justify-content: baseline;
`;

const SinglePlanText = styled.div`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
`;

const PlanInfoText = styled.div`
  font-size: 16px;
  margin: 15px 0;
`;

const PlanMainImageContainer = styled.div`
  width: 100%;
`;

const ImageContainer = styled.div`
  height: 300px;
  width: 300px;
`;

const MainImage = styled.img`
  max-height: 100%;
  max-width: 350px;
`;

//planInfo={planInfo}
// defaultImg={props.defaultImg }
function PublicPlanCard(props) {
  const navigate = useNavigate();

  // console.log(props);
  // console.log(props.planInfo.collection_id);
  // console.log(props.planInfo.plan_doc_ref);

  const redirectToStatic = () => {
    navigate('/static-plan-detail', {
      state: {
        fromPage: 'allPlans',
        // collectionID: props.planInfo.collection_id,
        planDocRef: props.planInfo.plan_doc_ref,
      },
    });
  };

  // console.log(props.planInfo);
  // if (props.planInfo.country) {
  //   console.log(props.planInfo.country['label']);
  // }

  return (
    <SinglePlanContainer onClick={() => redirectToStatic()}>
      {/* <PlanMainImageContainer> */}
      <SinglePlanText>{props.planInfo.title}</SinglePlanText>
      <ImageContainer>
        <MainImage
          src={props.planInfo.main_image || props.defaultImg}
          alt="main image"></MainImage>
      </ImageContainer>
      <Stack direction="column" spacing={2}>
        <PlanInfoText> Author: {props.planInfo.author}</PlanInfoText>

        {props.planInfo.country && (
          <PlanInfoText>
            Country: {props.planInfo.country['label']}
          </PlanInfoText>
        )}
      </Stack>
      {/* {props.planInfo.country.label && (
          <Typography variant="h5" component="div">
            Country: {props.planInfo.country.label}
          </Typography>
        )} */}
      {/* </PlanMainImageContainer> */}
    </SinglePlanContainer>
  );
}

export default PublicPlanCard;
