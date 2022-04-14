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
} from '@mui/material';
import TimeBlockCard from '../components/TimeBlockCard';

const UpperContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 30px;
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
      </UpperContainer>
      <TimeBlockCard />
    </>
  );
}

export default StaticPlanDetail;
