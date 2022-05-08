import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Avatar, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { getDocs, getDoc, collection, setDoc, doc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import firebaseDB from '../utils/firebaseConfig';
import OwnPlanCard from '../components/OwnPlanCard';
import FavPlanCard from '../components/PublicPlanCard';
import FavFolder from '../components/FavFolder';
import {
  themeColours,
  LightOrangeBtn,
  OrangeBtn,
  PaleBtn,
} from '../utils/globalTheme';
import { padding } from '@mui/system';
import UserAvatar from '../components/user/Avatar';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const db = firebaseDB();
const TopSectionWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const UserInfoWrapper = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .avatar_image {
    margin-bottom: 20px;
  }
  margin-bottom: 40px;
  div {
    text-align: center;
  }
  .user_id {
    margin-bottom: 30px;
  }

  .user_info_title {
    text-align: center;
    display: flex;
    margin-top: 20px;
    margin-bottom: 10px;
    color: ${themeColours.orange};
    font-weight: 600;
  }

  .authorId {
    color: ${themeColours.dark_blue};
    font-weight: 400;
    padding-left: 10px;
  }
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Oswald', sans-serif;

  .section_wrapper {
    display: flex;
    align-items: center;
  }

  .sub_section_wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .section_title {
    font-weight: 600;
    font-size: 36px;
    margin-right: 20px;
  }

  .dot {
    color: grey;
    font-size: 3em;
    margin-right: 15px;
  }

  .item_amount {
    color: grey;
    font-size: 1.5em;
  }

  .sub_section {
    padding: 0 5%;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
  }

  .section_sub-title {
    font-size: 30px;
    margin-right: 20px;
  }
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

const SinglePlanContainer = styled.div`
  width: 450px;
  height: 100%;
  margin: 0 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SingleFolderContainerEmpty = styled.div`
  min-width: 300px;
  height: 300px;
  margin: 0 30px;
  border: 2px solid #8ecae6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function signOutFirebase() {
  const auth = getAuth();

  signOut(auth)
    .then(() => {
      if (localStorage.getItem('accessToken')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userEmail');
        alert('You have been signed out!');
      } else {
        alert('You were not signed in!');
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function addNewFavFolder(currentUserId, newFolder) {
  console.log(newFolder);
  console.log(3334);

  try {
    setDoc(doc(db, 'userId', currentUserId, 'fav_folders', newFolder), {
      folder_name: newFolder,
    });
  } catch (error) {
    console.log(error);
  }
}

// user={user}
function Dashboard(props) {
  const [showAddPlanPopUp, setShowAddPlanPopup] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [ownPlansIdList, setOwnPlansIdList] = useState([]);
  const [favFolderNames, setFavFolderNames] = useState(null);
  const [showAddNewFolder, setShowAddNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [openEditPopUp, setOpenEditPopUp] = useState(false);
  const [hideOtherCards, setHideOtherCards] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const navigate = useNavigate();
  const inputRef = useRef();

  useEffect(async () => {
    if (!props.user) {
      alert('Please login first!');
      navigate('/');
    }
    setCurrentUserId(props.user.email);

    const ref = collection(db, 'userId', props.user.email, 'own_plans');
    const plansList = await getDocs(ref);

    if (plansList.docs.length === 0) {
      console.log('No own plans yet!');
    } else {
      const list = [];
      plansList.forEach((plan) => {
        list.push(plan.data().collection_id);
      });

      console.log(333, list);
      setOwnPlansIdList(list);
    }
  }, []);

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

  // useEffect(() => {
  //   const checkIfClickedOutside = (e) => {
  //     // If the menu is open and the clicked target is not within the menu,
  //     // then close the menu
  //     if (showAddNewFolder && ref.current && !ref.current.contains(e.target)) {
  //       setShowAddNewFolder(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', checkIfClickedOutside);

  //   return () => {
  //     // Cleanup the event listener
  //     document.removeEventListener('mousedown', checkIfClickedOutside);
  //   };
  // }, [showAddNewFolder]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    console.log(22, inputRef.current);
  }, [inputRef.current]);

  return (
    <>
      <TopSectionWrapper>
        <UserInfoWrapper>
          <UserAvatar currentUserId={currentUserId} fromLocate={'dashboard'} />
          <div className="user_info_title">Welcome!</div>
          <div className="user_id">{currentUserId}</div>
          <PaleBtn
            onClick={() => {
              signOutFirebase();
              navigate('/');
            }}>
            Logout
          </PaleBtn>
        </UserInfoWrapper>
        <LightOrangeBtn
          style={{
            width: 200,
            height: 60,
            padding: 15,
            fontSize: 20,
            fontWeight: 600,
          }}
          onClick={() => {
            setShowAddPlanPopup(true);
          }}>
          Add New Plan
        </LightOrangeBtn>
      </TopSectionWrapper>

      {showAddPlanPopUp &&
        navigate('/add-new-plan', {
          // state: { favPlansIdList: favPlansIdList, user: props.user },
          state: { user: props.user, favFolderNames: favFolderNames },
        })}

      <SectionContainer>
        <div className="section_wrapper">
          <div className="section_title">Plans</div>
          <div className="dot"> {'\u00B7'} </div>
          {ownPlansIdList && (
            <div className="item_amount">{ownPlansIdList.length}</div>
          )}
        </div>

        <PlanCollectionWrapper>
          {ownPlansIdList?.map((ownPlanId) => {
            return (
              <SinglePlanContainer key={ownPlanId}>
                <OwnPlanCard
                  userIdentity="author"
                  ownPlanId={ownPlanId}
                  key={ownPlanId}
                  setOpenEditPopUp={setOpenEditPopUp}
                  openEditPopUp={openEditPopUp}
                />
              </SinglePlanContainer>
            );
          })}
        </PlanCollectionWrapper>
      </SectionContainer>

      <SectionContainer>
        <div className="section_wrapper">
          <div className="section_title">Favourites</div>
        </div>

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
      </SectionContainer>
    </>
  );
}

export default Dashboard;
