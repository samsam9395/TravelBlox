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
import EditTimeBlock from './EditTimeBlock';
import {
  doc,
  getDoc,
  getDocs,
  collectionGroup,
  query,
  where,
  onSnapshot,
  collection,
  setDoc,
  writeBatch,
  updateDoc,
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

async function saveToDataBase(myEvents) {
  const batch = writeBatch(db);

  myEvents.forEach((singleEvent) => {
    const id = singleEvent.id;
    let updateRef = doc(
      db,
      'plan101',
      'zqZZcY8RO85mFVmtHbVI',
      'time_blocks_test',
      id
    );
    batch.update(updateRef, {
      end: singleEvent.end,
      start: singleEvent.start,
    });
  });

  await batch.commit();
}

function DeleteBlockInMylist(prev, id) {
  const indexOfObject = prev.findIndex((timeblock) => {
    return timeblock.id === id;
  });
  console.log(prev);
  console.log(indexOfObject);
  // let updateList = [...prev].slice(indexOfObject, 1);
  let updateList = prev.splice(indexOfObject, 1);
  console.log(prev);
  return prev;
}

function PlanDetail() {
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [currentSelectTimeData, setCurrentSelectTimeData] = useState('');
  const [currentSelectTimeId, setCurrentSelectTimeId] = useState('');

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
    const blocksListRef = collection(
      db,
      'plan101',
      'zqZZcY8RO85mFVmtHbVI',
      'time_blocks_test'
    );

    onSnapshot(blocksListRef, (doc) => {
      doc.docChanges().forEach((change) => {
        if (change.type === 'added') {
          // console.log(myEvents);
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
          const id = change.doc.data().id;
          setMyEvents((prev) => [
            ...DeleteBlockInMylist(prev, id),
            {
              start: new Date(change.doc.data().start.seconds * 1000),
              end: new Date(change.doc.data().end.seconds * 1000),
              title: change.doc.data().title,
              id: change.doc.data().id,
            },
          ]);
        }
        if (change.type === 'removed') {
          console.log('Removed time: ', change.doc.data());
          const id = change.doc.data().id;
          setMyEvents((prev) => [...DeleteBlockInMylist(prev, id)]);
        }
      });
    });
  }, []);

  // console.log(myEvents);

  return (
    <Wrapper>
      {showPopUp ? (
        <AddTimeBlock setShowPopUp={setShowPopUp} showPopUp={showPopUp} />
      ) : null}
      {showEditPopUp ? (
        <EditTimeBlock
          showEditPopUp={showEditPopUp}
          setShowEditPopUp={setShowEditPopUp}
          currentSelectTimeData={currentSelectTimeData}
          currentSelectTimeId={currentSelectTimeId}
        />
      ) : null}
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
        <PlanCalendar
          setMyEvents={setMyEvents}
          myEvents={myEvents}
          setShowEditPopUp={setShowEditPopUp}
          setCurrentSelectTimeData={setCurrentSelectTimeData}
          setCurrentSelectTimeId={setCurrentSelectTimeId}
        />
      </CalendarContainer>
      <Button
        variant="contained"
        onClick={() => {
          setShowPopUp(true);
        }}>
        Add new event
      </Button>
      <Button variant="contained" onClick={() => saveToDataBase(myEvents)}>
        Save
      </Button>
    </Wrapper>
  );
}

export default PlanDetail;
