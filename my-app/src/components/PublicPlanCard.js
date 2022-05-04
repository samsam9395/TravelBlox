import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const SinglePlanContainer = styled.div`
  width: 450px;
  height: 450px;
  object-fit: contain;
  display: flex;
  align-items: center;
  margin: 10px;
`;

const PlanTextContainer = styled.div`
  position: absolute;
  text-align: center;
  padding-left: 1em;
  padding-right: 1em;
  width: 100%;
  top: 50%;
  left: 50%;
  opacity: 0;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-transition: all 0.3s ease-in-out 0s;
  -moz-transition: all 0.3s ease-in-out 0s;
  transition: all 0.3s ease-in-out 0s;

  /* .SinglePlanSubInfo {
    -webkit-transform: translate(-80%, -80%);
    -moz-transform: translate(-80%, -80%);
    transform: translate(-80%, -80%);
    top: 80%;
    left: 50%;
  } */
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SinglePlanText = styled.div`
  color: #fff;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.15em;
  font-size: 2em;
  text-transform: uppercase;
  position: relative;
  top: 45%;
`;

const SinglePlanSubInfo = styled.div`
  color: #fff;
  font-size: 0.8em;
  position: relative;
  top: 80%;
`;

const PlanMainImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  margin: auto;
  overflow: hidden;
  .content-overlay {
    background: rgba(0, 0, 0, 0.7);
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    -webkit-transition: all 0.4s ease-in-out 0s;
    -moz-transition: all 0.4s ease-in-out 0s;
    transition: all 0.4s ease-in-out 0s;
  }

  &:hover {
    cursor: pointer;
    .content-overlay {
      opacity: 1;
    }
    .content-details {
      top: 50%;
      left: 50%;
      opacity: 1;
      height: 100%;
    }
  }
  .fadeIn-bottom {
    top: 100%;
  }
`;

//planInfo={planInfo}
// defaultImg={props.defaultImg }
function PublicPlanCard(props) {
  const navigate = useNavigate();

  const redirectToStatic = () => {
    navigate('/static-plan-detail', {
      state: {
        fromPage: 'allPlans',
        planDocRef: props.planInfo.plan_doc_ref,
      },
    });
  };

  return (
    <SinglePlanContainer onClick={() => redirectToStatic()}>
      <PlanMainImageContainer>
        <div className="content-overlay"></div>
        <MainImage
          src={props.planInfo.main_image || props.defaultImg}
          alt="main image"></MainImage>

        <PlanTextContainer className="content-details fadeIn-bottom">
          <SinglePlanText>{props.planInfo.title}</SinglePlanText>
          <SinglePlanSubInfo>Author: {props.planInfo.author}</SinglePlanSubInfo>
          {props.planInfo.country && (
            <SinglePlanSubInfo>
              Country: {props.planInfo.country['label']}
            </SinglePlanSubInfo>
          )}
        </PlanTextContainer>
      </PlanMainImageContainer>
    </SinglePlanContainer>
  );
}

export default PublicPlanCard;
