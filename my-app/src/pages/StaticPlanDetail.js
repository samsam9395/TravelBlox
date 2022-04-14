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
  Typography,
  Avatar,
} from '@mui/material';
import TimeBlockCard from '../components/TimeBlockCard';

const UpperContainer = styled.div`
  display: flex;
  padding: 0 30px;
`;
const PlanCardsWrapper = styled.div`
  margin-top: 50px;
  padding: 0 30px;
`;

const UserRightSideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 30px;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

function StaticPlanDetail() {
  const [mainImage, setMainImage] = useState(null);
  const [planTitle, setPlanTitle] = useState('' || 'not yet');

  return (
    <>
      <UpperContainer>
        <Card sx={{ width: 400 }}>
          <CardMedia component="img" image={mainImage} height="200" />
          <Typography gutterBottom variant="h5" component="div">
            {planTitle}
          </Typography>
        </Card>

        <UserRightSideWrapper>
          <UserInfoWrapper>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 56, height: 56 }}
            />
            <span>Name</span>
          </UserInfoWrapper>
        </UserRightSideWrapper>
      </UpperContainer>
      <PlanCardsWrapper>
        <TimeBlockCard />
      </PlanCardsWrapper>
    </>
  );
}

export default StaticPlanDetail;
