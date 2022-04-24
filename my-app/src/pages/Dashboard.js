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

const db = firebaseDB();
const TopSectionWrapper = styled.div`
  display: flex;
`;

const AddPlanBtn = styled.button`
  height: 25px;
  width: 100%;
  padding: 20px;
  text-align: center;
  border: none;
  border-radius: 15px;
  background-color: aliceblue;
`;

const PlanCollectionWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  width: 100%;
  box-sizing: content-box;
  overflow: auto;
  border: 1px solid black;
  margin: 30px 0;
  height: 400px;
`;

const SinglePlanContainer = styled.div`
  width: 450px;
  height: 450px;
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

function Dashboard(props) {
  const [showAddPlanPopUp, setShowAddPlanPopup] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [ownPlansIdList, setOwnPlansIdList] = useState([]);
  const [favFolderNames, setFavFolderNames] = useState(null);
  const [showAddNewFolder, setShowAddNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [openEditPopUp, setOpenEditPopUp] = useState(false);
  const [currentPlanRef, setCurrentPlanRef] = useState([]);
  const [showFavFolderEdit, setShowFavFolderEdit] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  useEffect(async () => {
    const user = localStorage.getItem('userEmail');
    if (!user) {
      alert('Please login first!');
      navigate('/landing');
    }
    setCurrentUserId(localStorage.getItem('userEmail'));

    const ref = collection(db, 'userId', user, 'own_plans');
    const plansList = await getDocs(ref);

    if (plansList.docs.length === 0) {
      console.log('No own plans yet!');
    } else {
      const list = [];
      plansList.forEach((plan) => {
        list.push(plan.data().collection_id);
      });
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

      setFavFolderNames(list);
    }
  }, [currentUserId, favFolderNames]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (showAddNewFolder && ref.current && !ref.current.contains(e.target)) {
        setShowAddNewFolder(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showAddNewFolder]);

  return (
    <>
      <TopSectionWrapper>
        <Avatar
          onClick={() => {
            console.log('clicked');
          }}
          alt="Remy Sharp"
          src="/static/images/avatar/1.jpg"
          sx={{ width: 56, height: 56 }}
        />
        <h4>Welcom! {currentUserId}</h4>
      </TopSectionWrapper>
      <Stack direction="column" alignItems="center" spacing={2}>
        <AddPlanBtn
          onClick={() => {
            signOutFirebase();
            navigate('/landing');
          }}>
          Logout
        </AddPlanBtn>

        <AddPlanBtn
          onClick={() => {
            setShowAddPlanPopup(!showAddPlanPopUp);
          }}>
          Add New Plan
        </AddPlanBtn>

        <AddPlanBtn
          onClick={() => {
            setShowFavFolderEdit(!showFavFolderEdit);
          }}>
          Edit Favourtie Folder
        </AddPlanBtn>
      </Stack>

      {showAddPlanPopUp &&
        navigate('/add-new-plan', {
          // state: { favPlansIdList: favPlansIdList, user: props.user },
          state: { user: props.user },
        })}
      <PlanCollectionWrapper>
        {ownPlansIdList &&
          ownPlansIdList.map((ownPlanId) => (
            <SinglePlanContainer key={ownPlanId}>
              <OwnPlanCard
                userIdentity="author"
                ownPlanId={ownPlanId}
                key={ownPlanId}
                setOpenEditPopUp={setOpenEditPopUp}
                openEditPopUp={openEditPopUp}
              />
            </SinglePlanContainer>
          ))}
      </PlanCollectionWrapper>

      <PlanCollectionWrapper>
        {favFolderNames &&
          favFolderNames.map((favFolderName, index) => {
            return (
              <FavFolder
                onClick={() => console.log('cicked index of this: ', index)}
                key={index}
                favFolderName={favFolderName}
                currentUserId={currentUserId}
              />
            );
          })}

        <SingleFolderContainerEmpty>
          {!showAddNewFolder && (
            <AddIcon
              style={{ fontSize: 50 }}
              onClick={() => setShowAddNewFolder(!showAddNewFolder)}></AddIcon>
          )}

          {showAddNewFolder && (
            <div ref={ref}>
              <input
                onChange={(e) => {
                  setNewFolderName(e.target.value);
                }}></input>
              <button
                onClick={(e) => {
                  addNewFavFolder(currentUserId, newFolderName);
                  setShowAddNewFolder(false);
                }}>
                Create
              </button>
            </div>
          )}
        </SingleFolderContainerEmpty>
      </PlanCollectionWrapper>
    </>
  );
}

export default Dashboard;
