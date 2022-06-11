import '../../styles/libraryStyles.scss';

import { Close, Delete, PhotoCamera } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { LightOrangeBtn, themeColours } from '../../styles/globalTheme';
import {
  checkGoogleImgExpirationDate,
  createLocationKeyPairs,
  uploadImagePromise,
} from '../../utils/functionList';
import { useEffect, useState } from 'react';

import AutoCompleteInput from '../timeblock/AutoCompleteInput';
import DateTimeSelector from '../input/DateTimeSelector';
import LocationCard from '../timeblock/LocationCard';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { doc } from 'firebase/firestore';
import firebaseDB from '../../utils/firebaseConfig';
import firebaseService from '../../utils/fireabaseService';
import styled from 'styled-components';

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

  @media (max-width: 768px) {
    width: 80vw;
  }
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
`;

const UploadBtnCamera = styled(IconButton)`
  margin: 10px 0;
  &:hover {
    background-color: ${themeColours.pale};
  }
`;
const InstructionText = styled.div`
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.66;
  letter-spacing: 0.03333em;
  text-align: left;
  font-size: 12px;
`;

const UploadImage = styled.img`
  margin-top: 30px;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border: none;
`;

EditTimeBlock.propTypes = {
  planDocRef: PropTypes.string,
  closePopUp: PropTypes.func,
  currentSelectTimeData: PropTypes.object,
};

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

  async function setTimeBlockData(currentSelectTimeData) {
    if (currentSelectTimeData.status === 'imported') {
      setImportBlockData(currentSelectTimeData);
    } else if (currentSelectTimeData.status === 'origin') {
      const originTimeBlockData = await firebaseService.retreiveFromDataBase(
        timeBlockRef
      );
      setInitBlockData(originTimeBlockData);
    } else console.log('something wrong with edit-time-block');
  }

  async function setImportTimeBlockData() {
    const data = importBlockData;

    if (data) {
      setBlockTitle(data.title);
      setLocationName(data.place_name);
      setStartTimeValue(data.start);
      setEndTimeValue(data.end);
    }

    if (data.timeEdited) {
      const imgExpiration = await checkGoogleImgExpirationDate(
        data,
        timeBlockRef
      );

      setLocation(imgExpiration);
    } else {
      setLocation({
        ...createLocationKeyPairs(data),
      });
    }
  }

  async function setInitialTimeblockData(initBlockData) {
    const data = initBlockData;

    if (initBlockData) {
      setBlockTitle(data.title);
      setLocationName(data.place_name);
      setPlaceId(data.place_id);
      setDescription(data.text);
      setTimeBlockImage(data.timeblock_img);
      if (data.start) {
        setStartTimeValue(new Date(data.start.seconds * 1000));
      }
      if (data.end) {
        setEndTimeValue(new Date(data.end.seconds * 1000));
      }

      if (data.timeEdited) {
        const imgExpiration = await checkGoogleImgExpirationDate(
          data,
          timeBlockRef
        );
        setLocation(imgExpiration);
      } else {
        setLocation({
          ...createLocationKeyPairs(data),
        });
      }
    }
  }

  useEffect(() => {
    setTimeBlockData(props.currentSelectTimeData);
  }, [props.currentSelectTimeData]);

  useEffect(() => {
    if (importBlockData) {
      setImportTimeBlockData();
    }
  }, [importBlockData]);

  useEffect(() => {
    setInitialTimeblockData(initBlockData);
  }, [initBlockData]);

  return (
    <>
      <BlackWrapper>
        <PopBox>
          <ButtonContainer>
            <DeleteBtn
              aria-label="delete"
              onClick={() => {
                Swal.fire({
                  title: 'Are you sure?',
                  text: "You won't be able to revert this!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete it!',
                  backdrop: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    if (
                      firebaseService.deleteTimeBlockFromDataBase(
                        timeBlockRef,
                        blockTitle
                      )
                    ) {
                      props.closePopUp();
                      Swal.fire(`${blockTitle} is deleted!`);
                    }
                  }
                });
              }}>
              <Delete />
            </DeleteBtn>
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
                <UploadImage src={timeBlockImage} alt="upload image" />
              )}
              <label htmlFor="imgupload">
                <input
                  accept="image/*"
                  type="file"
                  id="imgupload"
                  onChange={async (e) => {
                    const imageFile = await uploadImagePromise(
                      e.target.files[0]
                    );
                    setTimeBlockImage(imageFile);
                  }}
                />

                <UploadBtnCamera
                  color="primary"
                  aria-label="upload picture"
                  component="div">
                  <PhotoCamera style={{ color: themeColours.light_blue }} />
                </UploadBtnCamera>
              </label>
              <InstructionText>
                You can upload an image for this time event.
              </InstructionText>
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
                if (
                  firebaseService.updateToDataBase(
                    timeBlockRef,
                    blockTitle,
                    description,
                    startTimeValue,
                    endTimeValue,
                    location,
                    timeBlockImage,
                    placeId
                  )
                ) {
                  props.closePopUp();
                  Swal.fire('Successfully updated!');
                } else {
                  Swal.fire('Something went wrong, please try again!');
                }
              } else {
                Swal.fire('Please check your inputs!');
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
