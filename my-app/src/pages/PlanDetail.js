import React, { useState, useEffect, useMemo } from 'react';
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
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import './planDetail.scss';
import PlanCalendar from './Calendar';
import AddTimeBlock from './AddTimeBlock';
import {
  doc,
  getDoc,
  getDocs,
  collectionGroup,
  query,
  where,
  onSnapshot,
  collection,
} from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';

const db = firebaseDB();

const Wrapper = styled.div`
  padding: 50px;
  margin: auto;
`;

const TopContainer = styled.div`
  display: flex;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const CalendarContainer = styled.div`
  width: 100%;
  height: 60vh;
  border: 1px solid black;
  margin-top: 40px;
`;

const Input = styled('input')({
  display: 'none',
});

function PlanDetail() {
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [myEvents, setMyEvents] = useState([]);

  useEffect(async () => {
    const list = await (
      await fetch('https://restcountries.com/v3.1/all')
    ).json();
    setCountryList(list.sort());
  }, []);

  useEffect(async () => {
    const planRef = doc(db, 'plan101', 'zqZZcY8RO85mFVmtHbVI');
    const docSnap = await getDoc(planRef);
    setPlanTitle(docSnap.data().title);
    // setCountry(docSnap.data().country);
  }, []);

  useEffect(async () => {
    const blocksRef = collection(
      db,
      'plan101',
      'zqZZcY8RO85mFVmtHbVI',
      'time_blocks_test'
    );

    onSnapshot(blocksRef, (doc) => {
      doc.docChanges().forEach((change) => {
        if (change.type === 'added') {
          // console.log(change.doc.data());
          setMyEvents((prev) => [
            ...prev,
            {
              start: new Date(change.doc.data().start.seconds * 1000),
              end: new Date(change.doc.data().end.seconds * 1000),
              title: change.doc.data().title,
              id: change.doc.data().id,
            },
          ]);
        }
        if (change.type === 'modified') {
          console.log('Modified time: ', change.doc.data());
        }
        if (change.type === 'removed') {
          console.log('Removed time: ', change.doc.data());
        }
      });
    });

    //   const timeSnaphotArray = doc.docs.map((d) => d.data());
    //   timeSnaphotArray.forEach((timeBlock) => {
    //     setMyEvents((prev) => [
    //       ...prev,
    //       {
    //         start: new Date(timeBlock.start.seconds * 1000),
    //         end: new Date(timeBlock.end.seconds * 1000),
    //         title: timeBlock.title,
    //       },
    //     ]);
    //   });
    // });

    // onSnapshot(blocksRef, (doc) => {
    //   const timeSnaphotArray = doc.docs.map((d) => d.data());
    //   timeSnaphotArray.forEach((timeBlock) => {
    //     setMyEvents((prev) => [
    //       ...prev,
    //       {
    //         start: new Date(timeBlock.start.seconds * 1000),
    //         end: new Date(timeBlock.end.seconds * 1000),
    //         title: timeBlock.title,
    //       },
    //     ]);
    //   });
    // });
  }, []);

  return (
    <Wrapper>
      {showPopUp ? <AddTimeBlock setShowPopUp={setShowPopUp} /> : null}
      <TopContainer>
        <TitleSection>
          <TextField
            sx={{ m: 1, minWidth: 80 }}
            label="Title"
            variant="outlined"
            value={planTitle}
            onChange={(e) => {
              setPlanTitle(e.target.value);
            }}
          />
          <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
            <InputLabel id="select-country">County</InputLabel>
            <Select
              labelId="select-country"
              value={country}
              label="County"
              onChange={(e) => {
                setCountry(e.target.value);
              }}>
              {countryList.map((country, index) => {
                return (
                  <MenuItem value={country.name.common} key={index}>
                    {country.flag} {country.name.common}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </TitleSection>
        <Box
          sx={{
            p: 2,
            border: '1px dashed grey',
            width: 400,
            height: 200,
            // backgroundColor: 'primary.dark',
            // '&:hover': {
            //   backgroundColor: 'primary.main',
            //   opacity: [0.9, 0.8, 0.7],
            // },
          }}>
          <label htmlFor="icon-button-file">
            <Input accept="image/*" id="icon-button-file" type="file" />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>
      </TopContainer>
      <CalendarContainer>
        <PlanCalendar setMyEvents={setMyEvents} myEvents={myEvents} />
      </CalendarContainer>
      <Button
        variant="contained"
        onClick={() => {
          setShowPopUp(true);
        }}>
        Add new event
      </Button>
      <Button variant="contained">Save</Button>
    </Wrapper>
  );
}

export default PlanDetail;
