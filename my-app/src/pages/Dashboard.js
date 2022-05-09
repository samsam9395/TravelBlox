import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { getDocs, getDoc, collection, setDoc, doc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import firebaseDB from '../utils/firebaseConfig';
import OwnPlanCard from '../components/OwnPlanCard';
import FavPlanCard from '../components/PublicPlanCard';

import {
  themeColours,
  LightOrangeBtn,
  OrangeBtn,
  PaleBtn,
} from '../styles/globalTheme';
import UserAvatar from '../components/user/Avatar';
import FavouriteFolderBar from '../favourite/FavouriteFolderBar';

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

const PlanCollectionWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: content-box;
  overflow-y: hidden;
  overflow-x: auto;
  margin-bottom: 30px;
  height: 450px;
  justify-content: center;
  display: -webkit-box;
`;

const SinglePlanContainer = styled.div`
  width: 450px;
  height: 100%;
  margin: 0 15px;
  display: flex;
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

// user={user}
function Dashboard(props) {
  const [showAddPlanPopUp, setShowAddPlanPopup] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [ownPlansIdList, setOwnPlansIdList] = useState([]);
  const [openEditPopUp, setOpenEditPopUp] = useState(false);

  const navigate = useNavigate();

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
            width: 220,
            height: 60,
            padding: 15,
            fontSize: 20,
            fontWeight: 600,
          }}
          onClick={() => {
            setShowAddPlanPopup(true);
          }}>
          ADD NEW PLAN
        </LightOrangeBtn>
      </TopSectionWrapper>

      {showAddPlanPopUp &&
        navigate('/add-new-plan', {
          // state: { favPlansIdList: favPlansIdList, user: props.user },
          state: { user: props.user },
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
        <FavouriteFolderBar currentUserId={currentUserId} />
      </SectionContainer>
    </>
  );
}

export default Dashboard;
