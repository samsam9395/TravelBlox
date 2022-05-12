import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TextField, Button, IconButton } from '@mui/material';
import { Delete, Close, PhotoCamera } from '@mui/icons-material';
import firebaseDB from '../utils/firebaseConfig';
import { doc, setDoc, collection, getDoc, deleteDoc } from 'firebase/firestore';
import DateTimeSelector from '../components/Input/DateTimeSelector';
import AutoCompleteInput from '../components/AutoCompleteInput';
import LocationCard from '../components/LocationCard';
import '../styles/libraryStyles.scss';
import { LightOrangeBtn, themeColours } from '../styles/globalTheme';

const BlackWrapper = styled.div`
  position: fixed;
  background: rgba(0, 0, 0, 0.64);
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 10;
`;

const PopBox = styled.div`
  position: relative;
  width: 60vw;
  height: 80%;
  margin: 0 auto;
  background-color: white;
  margin-top: calc(100vh - 85vh - 20px);
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
`;

const DeleteBtn = styled(IconButton)`
  position: relative;
  top: 0;
  width: 60px;
  margin-left: auto;
`;

const CloseBtn = styled(IconButton)`
  position: relative;
  top: 0;
  width: 60px;
  margin-left: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FormsContainer = styled.div`
  flex-direction: column;
  display: flex;
  margin: 20px 0 40px 0;
  overflow: auto;
`;

const db = firebaseDB();

// const Input = styled('input')({
//   display: 'none',
// });

// const TimeBlockImgContainer = styled.div`
//   width: 100%;
//   margin-top: 30px;
//   margin-bottom: 30px;
// `;

const TimeblockImgUploadContainer = styled.div`
  width: 100%;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;

  input {
    display: none;
  }
  .upload_image {
    margin-top: 30px;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border: none;
  }

  .uploadBtn_camera {
    margin: 10px 0;
    &:hover {
      background-color: ${themeColours.pale};
    }
  }

  .instruction_text {
    color: rgba(0, 0, 0, 0.6);
    line-height: 1.66;
    letter-spacing: 0.03333em;
    text-align: left;
    font-size: 12px;
  }
`;

function handleImageUpload(e, setTimeBlockImage) {
  // console.log(e.target.files[0]);
  const reader = new FileReader();
  if (e) {
    reader.readAsDataURL(e.target.files[0]);
  }

  reader.onload = function () {
    // console.log(reader.result); //base64encoded string
    setTimeBlockImage(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

// collectionID={collectionID}
//planDocRef={planDocRef}

// importData={importData}
// showEditPopUp={showEditPopUp}
// setShowEditPopUp={setShowEditPopUp}
// currentSelectTimeData={currentSelectTimeData}
// currentSelectTimeId={currentSelectTimeId}
// collectionID={collectionID} <<< get rid of this
// planDocRef={planDocRef}
function EditTimeBlock(props) {
  const [initBlockData, setInitBlockData] = useState({});
  const [importBlockData, setImportBlockData] = useState({});
  const [blockTitle, setBlockTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [location, setLocation] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [description, setDescription] = useState('');
  const [startTimeValue, setStartTimeValue] = useState(
    props.currentSelectTimeData.start || ''
  );
  const [endTimeValue, setEndTimeValue] = useState(
    props.currentSelectTimeData.end || ''
  );
  const [timeBlockImage, setTimeBlockImage] = useState('');
  const timeBlockRef = doc(
    db,
    'plans',
    props.planDocRef,
    'time_blocks',
    props.currentSelectTimeData.id
  );

  async function UpdateToDataBase(
    timeBlockRef,
    blockTitle,
    description,
    startTimeValue,
    endTimeValue,
    location,
    timeBlockImage
  ) {
    // const location_img = location.photos[0].getUrl();
    // console.log(location.name);
    // console.log(111, location);
    if (location.geometry) {
      try {
        await setDoc(
          timeBlockRef,
          {
            title: blockTitle,
            text: description,
            start: startTimeValue,
            end: endTimeValue,
            place_id: location.place_id || placeId,
            place_name: location.name,
            place_format_address: location.formatted_address,
            timeblock_img: timeBlockImage || '',
            place_img: location.mainImg || location.photos[0].getUrl() || '',
            place_formatted_phone_number: location.formatted_phone_number || '',
            place_international_phone_number:
              location.international_phone_number || '',
            place_url: location.url,
            rating: location.rating || '',
            place_types: location.types || '',
            place_lat: location.geometry.location.lat(),
            place_lng: location.geometry.location.lng(),
            place_types: location.types || '',
            status: 'origin',
            id: props.currentSelectTimeId,
          },
          {
            merge: true,
          }
        );
        props.setShowEditPopUp(false);
        alert('Successfully updated!');
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await setDoc(
          timeBlockRef,
          {
            title: blockTitle,
            text: description,
            start: startTimeValue,
            end: endTimeValue,
            timeblock_img: timeBlockImage || '',
            status: 'origin',
            id: props.currentSelectTimeId,
          },
          {
            merge: true,
          }
        );
        props.setShowEditPopUp(false);
        alert('Successfully updated!');
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function retreiveFromDataBase(timeBlockRef, setInitBlockData) {
    const timeBlockSnap = await getDoc(timeBlockRef);

    if (timeBlockSnap.exists()) {
      const initialData = timeBlockSnap.data();
      // console.log(initialData);

      if (setInitBlockData) {
        setInitBlockData(initialData);
      }

      return initialData;
    } else {
      console.log('No such document!');
    }
  }

  async function deleteFromDataBase(
    timeBlockRef,
    blockTitle,
    setShowEditPopUp
  ) {
    try {
      await deleteDoc(timeBlockRef);
      alert(`${blockTitle} is deleted!`);
      console.log(blockTitle, props.currentSelectTimeId, 'is deleted!');
      setShowEditPopUp(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (props.currentSelectTimeData.status === 'imported') {
      setImportBlockData(props.currentSelectTimeData);
      // console.log(111, 'imported yes');
      // setImportPlaceData(data);
    } else if (props.currentSelectTimeData.status === 'origin') {
      // console.log('origin');
      // console.log(props.currentSelectTimeData.id);

      retreiveFromDataBase(timeBlockRef, setInitBlockData);
    } else console.log('something wrong with edit-time-block');
  }, [props.currentSelectTimeData]);

  useEffect(() => {
    const data = importBlockData;
    // console.log(555, importBlockData);

    setBlockTitle(data.title);
    setLocationName(data.place_name);
    // setPlaceId(data.place_id);
    setStartTimeValue(data.start);
    setEndTimeValue(data.end);
    setLocation({
      name: data.place_name,
      formatted_address: data.place_format_address,
      formatted_phone_number: data.place_formatted_phone_number || '',
      international_phone_number: data.place_international_phone_number || '',
      url: data.place_url,
      place_types: data.types || '',
      mainImg: data.place_img || '',
      rating: data.rating || '',
      place_id: data.place_id,
      // place_lat: data.place_lat || '',
      // place_lnt: data.place_lnt || '',
    });
  }, [importBlockData]);

  useEffect(() => {
    const data = initBlockData;

    if (initBlockData) {
      // console.log(333, initBlockData);
      setBlockTitle(data.title);
      setLocationName(data.place_name);
      setPlaceId(data.place_id);
      setLocation({
        name: data.place_name,
        formatted_address: data.place_format_address,
        formatted_phone_number: data.place_formatted_phone_number || '',
        international_phone_number: data.place_international_phone_number || '',
        url: data.place_url,
        place_types: data.types || '',
        mainImg: data.place_img || '',
        rating: data.rating || '',
        place_id: data.place_id,
        // place_lat: data.place_lat || '',
        // place_lnt: data.place_lnt || '',
      });
      setDescription(data.text);
      setTimeBlockImage(data.timeblock_img);
      if (data.start) {
        setStartTimeValue(new Date(data.start.seconds * 1000));
        // console.log(data.start.seconds);
      }
      if (data.end) {
        setEndTimeValue(new Date(data.end.seconds * 1000));
      }
    }
  }, [initBlockData]);

  return (
    <>
      <BlackWrapper>
        <PopBox>
          <ButtonContainer>
            <DeleteBtn
              aria-label="delete"
              onClick={() =>
                deleteFromDataBase(
                  timeBlockRef,
                  blockTitle,
                  props.setShowEditPopUp
                )
              }>
              <Delete />
            </DeleteBtn>
            <CloseBtn
              aria-label="close"
              onClick={() => {
                props.setShowEditPopUp(false);
              }}>
              <Close />
            </CloseBtn>
          </ButtonContainer>
          <FormsContainer>
            <TextField
              required
              sx={{
                m: 1,
                minWidth: 80,
                label: { color: themeColours.light_orange },
              }}
              size="small"
              label="Title"
              variant="outlined"
              value={blockTitle}
              onChange={(e) => {
                setBlockTitle(e.target.value);
              }}
            />
            <DateTimeSelector
              setStartTimeValue={setStartTimeValue}
              startTimeValue={startTimeValue}
              setEndTimeValue={setEndTimeValue}
              endTimeValue={endTimeValue}
            />
            <AutoCompleteInput
              setLocation={setLocation}
              locationName={locationName}
              placeId={placeId}
            />
            <LocationCard location={location} />

            <TextField
              sx={{
                m: 1,
                minWidth: 8,
                label: { color: themeColours.light_orange },
              }}
              multiline
              required
              size="small"
              label="Description"
              variant="outlined"
              value={description}
              rows={5}
              helperText="Please enter description for this time block."
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />

            <TimeblockImgUploadContainer>
              {timeBlockImage && (
                <img src={timeBlockImage} alt="" className="upload_image" />
              )}
              <label htmlFor="imgupload">
                <input
                  accept="image/*"
                  type="file"
                  id="imgupload"
                  onChange={(e) => {
                    // console.log(e);
                    handleImageUpload(e, setTimeBlockImage);
                  }}
                />

                <IconButton
                  className="uploadBtn_camera"
                  color="primary"
                  aria-label="upload picture"
                  component="div">
                  <PhotoCamera style={{ color: themeColours.light_blue }} />
                </IconButton>
              </label>
              <div className="instruction_text">
                You can upload an image for this time event.
              </div>
            </TimeblockImgUploadContainer>
          </FormsContainer>
          <LightOrangeBtn
            onClick={(e) => {
              if (
                (location || placeId) &&
                blockTitle &&
                description &&
                startTimeValue &&
                endTimeValue
              ) {
                try {
                  UpdateToDataBase(
                    timeBlockRef,
                    blockTitle,
                    description,
                    startTimeValue,
                    endTimeValue,
                    location,
                    timeBlockImage
                  );
                } catch (error) {
                  alert('Something went wrong, please try again!');
                  console.log(error);
                }
              } else {
                alert('Please check your inputs!');
              }
            }}>
            Submit
          </LightOrangeBtn>
        </PopBox>
      </BlackWrapper>
    </>
  );
}

export default EditTimeBlock;
