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
  Stack,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import './planDetail.scss';
import PlanCalendar from './Calendar';
import AddNewTimeBlock from './AddNewTimeBlock';
import EditTimeBlock from './EditTimeBlock';
import OnlyDatePicker from '../components/onlyDatePicker';
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
import { useNavigate, useLocation } from 'react-router-dom';

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
async function saveToDataBase(
  planCollectionRef,
  collectionID,
  planDocRef,
  myEvents,
  planTitle,
  country,
  mainImage,
  startDateValue,
  endDateValue
) {
  const batch = writeBatch(db);

  myEvents.forEach((singleEvent) => {
    const id = singleEvent.id;
    let updateRef = doc(db, collectionID, planDocRef, 'time_blocks', id);
    batch.update(updateRef, {
      end: singleEvent.end,
      start: singleEvent.start,
    });
  });

  batch.update(planCollectionRef, {
    title: planTitle,
    country: country,
    main_image: mainImage,
    start_date: startDateValue,
    end_date: endDateValue,
  });

  await batch.commit();
}

function DeleteBlockInMylist(prev, id) {
  const indexOfObject = prev.findIndex((timeblock) => {
    return timeblock.id === id;
  });

  // let updateList = [...prev].slice(indexOfObject, 1);
  let updateList = prev.splice(indexOfObject, 1);

  return prev;
}

function handleImageUpload(e, setMainImage) {
  console.log(e.target.files[0]);
  const reader = new FileReader();
  if (e) {
    reader.readAsDataURL(e.target.files[0]);
  }

  reader.onload = function () {
    // console.log(reader.result); //base64encoded string
    setMainImage(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

//currentPlanRef

function EditPlanDetail(props) {
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [myEvents, setMyEvents] = useState([]);
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [currentSelectTimeData, setCurrentSelectTimeData] = useState('');
  const [currentSelectTimeId, setCurrentSelectTimeId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [startDateValue, setStartDateValue] = useState(0);
  const [endDateValue, setEndDateValue] = useState(0);
  //React Route
  const location = useLocation();
  const collectionID = location.state.collectionID;
  const planDocRef = location.state.planDocId;

  const planCollectionRef = doc(db, collectionID, planDocRef);
  const blocksListRef = collection(db, collectionID, planDocRef, 'time_blocks');

  const navigate = useNavigate();
  const redirectToStatic = () => {
    navigate('/static-plan-detail', {
      state: {
        collectionID: collectionID,
        planDocRef: planDocRef,
      },
    });
  };

  useEffect(() => {
    console.log(console.log('location state is', location.state));
  }, []);

  useEffect(async () => {
    const list = await (
      await fetch('https://restcountries.com/v3.1/all')
    ).json();
    setCountryList(list.sort());
    setIsLoading(false);
  }, []);

  useEffect(async () => {
    const docSnap = await getDoc(planCollectionRef);
    console.log(docSnap.data().country);
    setPlanTitle(docSnap.data().title);
    // if (docSnap.data().country) {
    //   setCountry(docSnap.data().country);
    // }
    // console.log(docSnap.data().start_date);
    setMainImage(docSnap.data().main_image);
    setStartDateValue(new Date(docSnap.data().start_date.seconds * 1000));
    setEndDateValue(new Date(docSnap.data().end_date.seconds * 1000));
  }, []);

  useEffect(async () => {
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

  console.log(myEvents);

  return (
    <Wrapper>
      {showPopUp && (
        <AddNewTimeBlock
          setShowPopUp={setShowPopUp}
          showPopUp={showPopUp}
          collectionID={collectionID}
          planDocRef={planDocRef}
          //  setAddedTimeBlock={setAddedTimeBlock}
          startDateValue={startDateValue}
          endDateValue={endDateValue}
        />
      )}
      {showEditPopUp ? (
        <EditTimeBlock
          showEditPopUp={showEditPopUp}
          setShowEditPopUp={setShowEditPopUp}
          currentSelectTimeData={currentSelectTimeData}
          currentSelectTimeId={currentSelectTimeId}
          collectionID={collectionID}
          planDocRef={planDocRef}
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
            {isLoading ? (
              <Box sx={{ display: 'flex' }} align="center" justify="center">
                <CircularProgress size={14} sx={{ py: 2 }} />
              </Box>
            ) : (
              <Select
                labelId="select-country"
                value={country}
                label="Country"
                onChange={(e) => {
                  setCountry(e.target.value);
                }}>
                {countryList.map((countryData, index) => {
                  return (
                    <MenuItem value={countryData.name.common} key={index}>
                      {countryData.flag} {countryData.name.common}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
          </FormControl>
          <OnlyDatePicker
            setStartDateValue={setStartDateValue}
            startDateValue={startDateValue}
            setEndDateValue={setEndDateValue}
            endDateValue={endDateValue}
          />
        </TitleSection>
        <Card sx={{ width: 400 }}>
          <CardMedia component="img" image={mainImage} height="200" />
          <label htmlFor="icon-button-file">
            <Input
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={(e) => {
                handleImageUpload(e, setMainImage);
              }}
            />
            <Box textAlign="center">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="div">
                <PhotoCamera />
              </IconButton>
            </Box>
          </label>
        </Card>
      </TopContainer>
      <CalendarContainer>
        <PlanCalendar
          setMyEvents={setMyEvents}
          myEvents={myEvents}
          setShowEditPopUp={setShowEditPopUp}
          setCurrentSelectTimeData={setCurrentSelectTimeData}
          setCurrentSelectTimeId={setCurrentSelectTimeId}
          startDateValue={startDateValue}
        />
      </CalendarContainer>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button
          variant="contained"
          onClick={() => {
            setShowPopUp(true);
          }}>
          Add new event
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            try {
              saveToDataBase(
                planCollectionRef,
                collectionID,
                planDocRef,
                myEvents,
                planTitle,
                country,
                mainImage,
                startDateValue,
                endDateValue
              );
              alert('Saved!');
            } catch (error) {
              console.log(error);
              alert('Oops!Something went wrong, please try again!');
            }
          }}>
          Save
        </Button>
        <Button variant="contained" onClick={() => redirectToStatic()}>
          Publish
        </Button>
      </Stack>
    </Wrapper>
  );
}

export default EditPlanDetail;
