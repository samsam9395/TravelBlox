import { IconButton, TextField } from '@mui/material';
import { LightOrangeBtn, themeColours } from '../../styles/globalTheme';
import React, { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';

import AutoCompleteInput from '../AutoCompleteInput';
import Close from '@mui/icons-material/Close';
import DateTimeSelector from '../input/DateTimeSelector';
import LocationCard from '../LocationCard';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import firebaseDB from '../../utils/firebaseConfig';
import { renameGoogleMaDataIntoFirebase } from '../../utils/functionList';
import styled from 'styled-components';

const db = firebaseDB();

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
  width: 55vw;
  height: 75%;
  margin: 0 auto;
  background-color: white;
  margin-top: calc(100vh - 85vh - 20px);
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
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
  const reader = new FileReader();
  if (e) {
    reader.readAsDataURL(e.target.files[0]);
  }

  reader.onload = function () {
    setTimeBlockImage(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

AddNewTimeBlock.propTypes = {
  planDocRef: PropTypes.string,
  closePopUp: PropTypes.func,
  startDateValue: PropTypes.instanceOf(Date),
};

function AddNewTimeBlock(props) {
  const [blockTitle, setBlockTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTimeValue, setStartTimeValue] = useState(props.startDateValue);
  const [endTimeValue, setEndTimeValue] = useState(props.startDateValue);
  const [location, setLocation] = useState('');
  const [timeBlockImage, setTimeBlockImage] = useState('');

  async function addToDataBase(
    planDocRef,
    blockTitle,
    description,
    startTimeValue,
    endTimeValue,
    location,
    timeBlockImage
  ) {
    const timeBlockRef = doc(
      collection(db, 'plans', planDocRef, 'time_blocks')
    );

    const googleLocationData = renameGoogleMaDataIntoFirebase(location);
    try {
      await setDoc(timeBlockRef, {
        title: blockTitle,
        text: description,
        start: startTimeValue,
        end: endTimeValue,
        id: timeBlockRef.id,
        timeblock_img: timeBlockImage || '',

        ...googleLocationData,
        status: 'origin',
      });

      props.closePopUp();
      Swal.fire('Successfully added!');
    } catch (error) {
      if (
        error.message ==
        'The value of property "timeblock_img" is longer than 1048487 bytes.'
      ) {
        Swal.fire('Your image is too large, Please change another image.');
      }
    }

    {
      props.setAddedTimeBlock && props.setAddedTimeBlock(true);
    }
  }

  return (
    <>
      <BlackWrapper>
        <PopBox>
          <ButtonContainer>
            <CloseBtn
              aria-label="close"
              onClick={() => {
                props.closePopUp();
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
            <AutoCompleteInput setLocation={setLocation} />
            <LocationCard location={location} />
            <TextField
              required
              sx={{
                m: 1,
                minWidth: 8,
                minHeight: 120,
                label: { color: themeColours.light_orange },
              }}
              multiline
              size="small"
              label="Description"
              variant="outlined"
              value={description}
              rows={4}
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
                blockTitle &&
                description &&
                location &&
                startTimeValue &&
                endTimeValue
              ) {
                addToDataBase(
                  props.planDocRef,
                  blockTitle,
                  description,
                  startTimeValue,
                  endTimeValue,
                  location,
                  timeBlockImage
                );
              } else {
                Swal.fire('Please fill in all the requirements!');
              }
            }}>
            Submit
          </LightOrangeBtn>
        </PopBox>
      </BlackWrapper>
    </>
  );
}

export default AddNewTimeBlock;
