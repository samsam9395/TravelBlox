import {
  Dot,
  SectionItemAmount,
  SectionSubTitle,
  SectionWrapper,
  SubSection,
  SubSectionWrapper,
} from '../../pages/Dashboard';
import { collection, onSnapshot } from 'firebase/firestore';
import { fonts, themeColours } from '../../styles/globalTheme';
import { useEffect, useRef, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import EditFavouriteFolderSelector from './EditFavouriteFolderSelector';
import FavouriteFolder from './FavouriteFolder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import firebaseDB from '../../utils/firebaseConfig';
import firebaseService from '../../utils/fireabaseService';
import styled from 'styled-components';

const db = firebaseDB();

const PlanCollectionWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: content-box;
  overflow: auto;
  margin-bottom: 30px;
  height: 450px;
  justify-content: center;
`;

const FolderWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const FolderContainer = styled.div`
  width: 300px;
  height: 130px;
  border-radius: 15px;
  box-shadow: 9px 11px 23px -4px rgba(0, 0, 0, 0.56);
  -webkit-box-shadow: 9px 11px 23px -4px rgba(0, 0, 0, 0.56);
  -moz-box-shadow: 9px 11px 23px -4px rgba(0, 0, 0, 0.56);
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
  margin-right: 20px;
  margin-bottom: 50px;
  border: 1px solid ${themeColours.pale};
  position: relative;
`;

const FolderSection = styled.div`
  display: flex;
  justify-content: space-between;
`;
const FolderName = styled.div`
  font-size: 25px;
  font-weight: 600;
  margin: 15px 0;
  text-align: center;
`;

const NewFolderNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NewFolderNameInput = styled.input`
  width: 60%;
  font-size: 22px;
  font-family: ${fonts.secondary_font}, sans-serif;
  text-align: center;
  border: 0;
  border-bottom: 1px solid grey;
`;

const NewFolderNameConfirmBtn = styled.button`
  margin-top: 10px;
  width: 40%;
  padding: 5px;
  border-radius: 15px;
  border: 2px solid ${themeColours.pale};
  background-color: white;
  &:hover {
    background-color: ${themeColours.pale};
  }
`;

const AddNewPlanButton = styled.button`
  display: flex;
  align-items: center;
  height: 100%;
  width: 130px;
  padding: 10px 15px;
  border: none;
  background-color: ${themeColours.light_blue};
  border-radius: 15px;
  font-family: ${fonts.secondary_font}, sans-serif;
  font-size: 20px;
  color: white;
  &:hover {
    background-color: ${themeColours.blue};
  }
`;

FavouriteFolderBar.propTypes = {
  currentUserId: PropTypes.string,
};

function FavouriteFolderBar({ currentUserId }) {
  const [showAddNewFolder, setShowAddNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [favFolderNames, setFavFolderNames] = useState(null);
  const [showFavFolderEdit, setShowFavFolderEdit] = useState(false);
  const [favFolderEditIndex, setFavFolderEditIndex] = useState(null);

  const inputRef = useRef();
  const editPopRef = useRef();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);

  useEffect(async () => {
    if (currentUserId) {
      const favFolderRef = collection(
        db,
        'userId',
        currentUserId,
        'fav_folders'
      );
      onSnapshot(favFolderRef, (doc) => {
        setFavFolderNames(doc.docs.map((e) => e.data().folder_name));
      });
    }
  }, [currentUserId]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        showFavFolderEdit &&
        editPopRef.current &&
        !editPopRef.current.contains(e.target)
      ) {
        setShowFavFolderEdit(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showFavFolderEdit]);

  return (
    <SubSection>
      <SubSectionWrapper>
        <SectionWrapper>
          <SectionSubTitle>Folders</SectionSubTitle>
          <Dot> {'\u00B7'} </Dot>
          {favFolderNames && (
            <SectionItemAmount>{favFolderNames.length}</SectionItemAmount>
          )}
        </SectionWrapper>
        <AddNewPlanButton
          onClick={() => {
            setShowAddNewFolder(!showAddNewFolder);
          }}>
          <AddIcon style={{ fontSize: 16, marginRight: 5 }}></AddIcon>
          Add Folder
        </AddNewPlanButton>
      </SubSectionWrapper>

      <FolderWrapper ref={editPopRef}>
        {favFolderNames?.map((favFolderName, index) => {
          return (
            <FolderContainer
              key={index}
              favFolderName={favFolderName}
              onClick={(e) => {
                setFavFolderEditIndex(index);
              }}>
              <FolderSection>
                <FolderOpenIcon style={{ color: 'grey' }}></FolderOpenIcon>

                <MoreHorizIcon
                  className="hoverCursor"
                  style={{ color: 'grey' }}
                  onClick={() =>
                    setShowFavFolderEdit(!showFavFolderEdit)
                  }></MoreHorizIcon>

                {showFavFolderEdit && (
                  <EditFavouriteFolderSelector
                    index={index}
                    favFolderEditIndex={favFolderEditIndex}
                    favFolderName={favFolderName}
                    setShowFavFolderEdit={setShowFavFolderEdit}
                    currentUserId={currentUserId}
                  />
                )}
              </FolderSection>
              <FolderName
                className="hoverCursor"
                onClick={() => setSelectedFolder(favFolderName)}>
                {favFolderName}
              </FolderName>
            </FolderContainer>
          );
        })}
        {showAddNewFolder && (
          <FolderContainer>
            <FolderOpenIcon style={{ color: 'grey' }}></FolderOpenIcon>
            <NewFolderNameContainer>
              <NewFolderNameInput
                ref={inputRef}
                onChange={(e) => {
                  setNewFolderName(e.target.value);
                }}
              />
              <NewFolderNameConfirmBtn
                onClick={async (e) => {
                  const addnewFolder =
                    await firebaseService.addNewFavouriteFolder(
                      currentUserId,
                      newFolderName
                    );
                  if (addnewFolder) {
                    Swal.fire('Folder added!');
                    setShowAddNewFolder(false);
                  } else {
                    Swal.fire('Oops, something went wrong, please try again!');
                  }
                }}>
                Create
              </NewFolderNameConfirmBtn>
            </NewFolderNameContainer>
          </FolderContainer>
        )}
      </FolderWrapper>

      <PlanCollectionWrapper>
        <FavouriteFolder
          selectedFolder={selectedFolder}
          currentUserId={currentUserId}
        />
      </PlanCollectionWrapper>
    </SubSection>
  );
}

export default FavouriteFolderBar;
