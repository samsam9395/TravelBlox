import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const SinglePlanContainer = styled.div`
  width: 350px;
  height: 350px;
`;

const SinglePlanText = styled.div`
  font-size: 14px;
  font-weight: 600;
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
`;

//planInfo={planInfo}

function PublicPlanCard(props) {
  const navigate = useNavigate();

  // console.log(props);
  // console.log(props.planInfo.collection_id);
  // console.log(props.planInfo.plan_doc_ref);

  const redirectToStatic = () => {
    navigate('/static-plan-detail', {
      state: {
        fromPage: 'allPlans',
        collectionID: props.planInfo.collection_id,
        planDocRef: props.planInfo.plan_doc_ref,
      },
    });
  };

  return (
    <SinglePlanContainer onClick={() => redirectToStatic()}>
      <PlanMainImageContainer>
        <SinglePlanText>{props.planInfo.title}</SinglePlanText>
        <ImageContainer>
          <MainImage
            src={props.planInfo.main_image}
            alt="main image"></MainImage>
        </ImageContainer>
        <Typography variant="h5" component="div">
          Author: {props.planInfo.author}
        </Typography>
      </PlanMainImageContainer>
    </SinglePlanContainer>
  );
}

export default PublicPlanCard;
