import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import FavFolder from './FavFolder';
import { themeColours } from '../utils/globalTheme';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import { getDocs, getDoc, collection, setDoc, doc } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';

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

  .folder_section {
    display: flex;
    justify-content: space-between;
  }

  .folder_name {
    font-size: 25px;
    font-weight: 600;
    margin: 15px 0;
    text-align: center;
  }

  .new_folder_name_container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .new_folder_name_input {
    width: 60%;
    font-size: 22px;
    font-family: 'Oswald', sans-serif;
    text-align: center;
    border: 0;
    border-bottom: 1px solid grey;
  }

  .new_folder_name_confirmBtn {
    margin-top: 10px;
    width: 40%;
    padding: 5px;
    border-radius: 15px;
    border: 2px solid ${themeColours.pale};
    background-color: white;
    &:hover {
      background-color: ${themeColours.pale};
    }
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
  font-family: 'Oswald', sans-serif;
  font-size: 20px;
  color: white;
  &:hover {
    background-color: ${themeColours.blue};
  }
`;

function addNewFavFolder(currentUserId, newFolder) {
  console.log(newFolder);
  try {
    setDoc(doc(db, 'userId', currentUserId, 'fav_folders', newFolder), {
      folder_name: newFolder,
    });
    alert('Folder added!');
  } catch (error) {
    console.log(error);
  }
}

function FavouriteFolderBar({ currentUserId }) {
  const [showAddNewFolder, setShowAddNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [favFolderNames, setFavFolderNames] = useState(null);

  const inputRef = useRef();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    console.log(22, inputRef.current);
  }, [inputRef.current]);

  useEffect(async () => {
    if (currentUserId) {
      const favFolderRef = collection(
        db,
        'userId',
        currentUserId,
        'fav_folders'
      );
      const doc = await getDocs(favFolderRef);
      const list = doc.docs.map((e) => e.data().folder_name);
      console.log(list);
      setFavFolderNames(list);
    }
  }, [currentUserId]);

  return (
    <div className="sub_section">
      <div className="sub_section_wrapper">
        <div className="section_wrapper">
          <div className="section_sub-title">Folders</div>
          <div className="dot"> {'\u00B7'} </div>
          {favFolderNames && (
            <div className="item_amount">{favFolderNames.length}</div>
          )}
        </div>
        <AddNewPlanButton
          onClick={() => {
            setShowAddNewFolder(!showAddNewFolder);
          }}>
          <AddIcon style={{ fontSize: 16, marginRight: 5 }}></AddIcon>
          Add Folder
        </AddNewPlanButton>
      </div>

      <FolderWrapper>
        {favFolderNames?.map((favFolderName, index) => {
          return (
            <FolderContainer
              className="hoverCursor"
              key={index}
              favFolderName={favFolderName}
              onClick={() => setSelectedFolder(favFolderName)}>
              <div className="folder_section">
                <FolderOpenIcon style={{ color: 'grey' }}></FolderOpenIcon>

                <MoreHorizIcon
                  className="hoverCursor"
                  style={{ color: 'grey' }}></MoreHorizIcon>
              </div>
              <div className="folder_name">{favFolderName}</div>
            </FolderContainer>
          );
        })}
        {showAddNewFolder && (
          <FolderContainer>
            <FolderOpenIcon style={{ color: 'grey' }}></FolderOpenIcon>
            <div className="new_folder_name_container">
              <input
                ref={inputRef}
                className="new_folder_name_input"
                onChange={(e) => {
                  setNewFolderName(e.target.value);
                }}></input>
              <button
                className="new_folder_name_confirmBtn"
                onClick={(e) => {
                  addNewFavFolder(currentUserId, newFolderName);
                  setShowAddNewFolder(false);
                }}>
                Create
              </button>
            </div>
          </FolderContainer>
        )}
      </FolderWrapper>

      <PlanCollectionWrapper>
        <FavFolder
          selectedFolder={selectedFolder}
          currentUserId={currentUserId}
          // setHideOtherCards={setHideOtherCards}
        />
      </PlanCollectionWrapper>
    </div>
  );
}

export default FavouriteFolderBar;
