import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getDocs, getDoc, collection, setDoc, doc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import firebaseDB from '../utils/firebaseConfig';
import OwnPlanCard from '../components/OwnPlanCard';
import LogoutIcon from '@mui/icons-material/Logout';
import { handleMainImageUpload } from '../utils/functionList';
import UploadIcon from '@mui/icons-material/Upload';
import { IconButton } from '@mui/material';

import { themeColours, fonts, LightOrangeBtn } from '../styles/globalTheme';
import FavouriteFolderBar from '../favourite/FavouriteFolderBar';
import { ReactComponent as YourSvg } from '../images/right_milktea_curve_line.svg';
import sparkle from '../images/dashboard/spark.png';
import Swal from 'sweetalert2';
import '../styles/alertStyles.scss';

const db = firebaseDB();

const Wrapper = styled.div`
  position: relative;

  .milktea_svg_long {
    position: absolute;
    right: -144px;
    top: -45px;
  }
`;

const Sparkles = styled.div`
  position: relative;
  top: 50%;
  right: 0;

  .sparkle_left {
    position: absolute;
    width: 29px;
    left: -414px;
  }

  .sparkle_left_small {
    position: absolute;
    width: 13px;
    left: -391px;
    bottom: -48px;
  }

  .sparkle_right {
    position: absolute;
    width: 24px;
    right: 200px;
    top: -85px;
  }
`;

const UpperPartBackground = styled.div`
  background-color: ${themeColours.milktea};
  border: none;
  width: 400px;
  height: 400px;
  position: absolute;
  z-index: -100;
  border-radius: 50%;
  right: -333px;
  top: -209px;
`;

const TopSectionWrapper = styled.div`
  background: rgba(76, 74, 74, 0.05);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;

  border: none;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
  margin-bottom: 100px;

  .sparkle_left {
    position: absolute;
    width: 29px;
    /* left: -414px; */
    top: 58%;
    left: 10%;
  }

  .sparkle_left_small {
    position: absolute;
    width: 13px;
    /* left: -391px;
    bottom: -48px; */
    bottom: 21%;
    left: 15%;
  }

  .sparkle_right {
    position: absolute;
    width: 24px;
    top: 24%;
    left: 25%;
  }
`;

const UserInfoWrapper = styled.div`
  padding-top: 20px;
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  height: 300px;

  .user_info_container {
    display: flex;
    /* align-items: center; */
    flex-direction: column;
    margin-left: 30px;
  }

  .greeting {
    text-align: center;
    display: flex;
    /* margin-top: 20px; */
    margin-bottom: 20px;
    font-size: 30px;
    color: ${themeColours.light_orange};
    font-weight: 600;
  }

  .user_id {
    color: ${themeColours.dark_blue};
  }
`;

const UserAvatarUpload = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: grey;
  position: relative;

  img {
    display: none;
  }

  img[src] {
    display: block;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    border: none;
    object-fit: cover;
  }

  .avatar_line {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    position: absolute;
    left: -29px;
    top: -23px;
    /* left: 14%;
    top: 25%; */
    border: 1px solid ${themeColours.orange_grey};
    z-index: -10;
  }

  .upload_avatar_icon {
    position: absolute;
    bottom: 0;
    right: -10px;
    border-radius: 50%;

    &:hover {
      background-color: rgb(0 0 0 / 12%);
    }
  }
`;

const LogoutContainer = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  color: ${themeColours.light_grey};
  font-size: 14px;
  &:hover {
    cursor: pointer;
  }

  .icon {
    margin-right: 5px;
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
    height: 100%;
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

const NoPlansText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: ${fonts.main_font}, sans-serif;

  .title {
    font-size: 30px;
    font-weight: 600;
  }

  .instruction {
    font-size: 18px;
    font-weight: 200;
    display: flex;

    .btn_cta {
      margin: 0 5px;
      padding: 0 3px;
      background-color: ${themeColours.light_orange};
      color: white;
    }
  }
`;

const DisplaySwitch = styled.div`
  display: flex;
  width: 500px;
  border-radius: 25px;
  height: 60px;
  background-color: white;
  align-items: center;
  font-family: ${fonts.main_font};
  letter-spacing: 2px;
  position: absolute;
  bottom: -24px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);

  .plan_tab {
    text-align: center;
    flex-grow: 1;
    padding: 14px 24px;
    height: 100%;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: #dfd8d887;
      cursor: pointer;
    }
  }
`;

function signOutFirebase() {
  const auth = getAuth();

  signOut(auth)
    .then(() => {
      if (localStorage.getItem('accessToken')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userEmail');
        Swal.fire('You have been signed out!');
      } else {
        Swal.fire('You were not signed in!');
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
  const [userName, setUserName] = useState('');
  const [ownPlansIdList, setOwnPlansIdList] = useState([]);
  const [openEditPopUp, setOpenEditPopUp] = useState(false);
  const [showNoPlansText, setShowNoPlansText] = useState(false);
  const [displaySection, setDisplaySection] = useState('My Plans');
  const [userImage, setUserImage] = useState(null);
  const [showUserUploadIcon, setShowUserUploadIcon] = useState('hidden');
  const [uploadUserImg, setUploadUserImg] = useState(false);

  const navigate = useNavigate();
  const uploadIconRef = useRef(null);

  useEffect(async () => {
    if (!props.user) {
      Swal.fire('Please login first!');
      navigate('/');
    } else {
      setCurrentUserId(props.user.email);

      const ref = collection(db, 'userId', props.user.email, 'own_plans');
      const plansList = await getDocs(ref);

      if (plansList.docs.length === 0) {
        console.log('No own plans yet!');
        setShowNoPlansText(true);
      } else {
        setShowNoPlansText(false);
        const list = [];
        plansList.forEach((plan) => {
          list.push(plan.data().collection_id);
        });

        console.log(333, list);
        setOwnPlansIdList(list);
      }

      try {
        const userDoc = await getDoc(doc(db, 'userId', props.user.email));
        setUserImage(userDoc.data().userImage);
        setUserName(userDoc.data().username);
      } catch (error) {
        console.log(error);
      }
    }
  }, [props.user]);

  // useEffect(async () => {
  //   if (props.user.email) {
  //   }
  // }, [props.user.email]);

  useEffect(() => {
    if (uploadUserImg) {
      console.log('inside', userImage);
      saveImgToDataBase(userImage);
    }
  }, [uploadUserImg]);

  function saveImgToDataBase(userImage) {
    try {
      setDoc(
        doc(db, 'userId', currentUserId),
        {
          userImage: userImage,
        },
        { merge: true }
      );

      Swal.fire('Saved your image!');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Wrapper>
      <UpperPartBackground></UpperPartBackground>
      <YourSvg className="milktea_svg_long"></YourSvg>

      <TopSectionWrapper>
        <img className="sparkle_left" src={sparkle} alt="" />
        <img className="sparkle_left_small" src={sparkle} alt="" />
        <img className="sparkle_right" src={sparkle} alt="" />

        <UserInfoWrapper>
          <UserAvatarUpload
            onMouseEnter={() => setShowUserUploadIcon('visible')}
            onMouseLeave={() => setShowUserUploadIcon('hidden')}>
            <img className="user_img" src={userImage} alt="" />

            <label htmlFor="user_avatar_file" className="upload_avatar_icon">
              <input
                style={{ display: 'none' }}
                accept="image/*"
                id="user_avatar_file"
                type="file"
                onChange={(e) => {
                  handleMainImageUpload(e, setUserImage, setUploadUserImg);
                }}></input>
              <IconButton
                style={{
                  visibility: showUserUploadIcon,
                  // transition: 'opacity 5s',
                }}
                ref={uploadIconRef}
                aria-label="upload picture"
                component="div">
                <UploadIcon style={{ color: themeColours.dark_blue }} />
              </IconButton>
            </label>

            <div className="avatar_line"></div>
          </UserAvatarUpload>

          {/* <UserAvatar currentUserId={currentUserId} fromLocate={'dashboard'} /> */}
          <div className="user_info_container">
            <div className="greeting">Hello!</div>
            <div className="user_id">{userName}</div>
            <div className="user_id">{currentUserId}</div>
            <LogoutContainer
              onClick={() => {
                signOutFirebase();
                navigate('/');
              }}>
              <LogoutIcon className="icon"></LogoutIcon> Logout
            </LogoutContainer>
          </div>
        </UserInfoWrapper>
        <LightOrangeBtn
          style={{
            width: 190,
            height: 40,
            fontSize: 18,
            fontWeight: 600,
          }}
          onClick={() => {
            setShowAddPlanPopup(true);
          }}>
          ADD NEW PLAN
        </LightOrangeBtn>
        <DisplaySwitch>
          <div
            className="plan_tab"
            value="own_plan"
            onClick={(e) => setDisplaySection(e.target.textContent)}>
            My Plans
          </div>
          <div
            className="plan_tab"
            value="fav_plan"
            onClick={(e) => setDisplaySection(e.target.textContent)}>
            Favourite Plans
          </div>
        </DisplaySwitch>
      </TopSectionWrapper>

      {
        showAddPlanPopUp && navigate(`/new-plan/${props.user.email}`)
        //     , {
        //     state: { favPlansIdList: favPlansIdList, user: props.user },
        //     state: { user: props.user },
        // })
      }

      {displaySection === 'My Plans' && (
        <SectionContainer>
          <div className="section_wrapper">
            <div className="section_title">Plans</div>
          </div>
          <div className="sub_section">
            <div className="sub_section_wrapper">
              <div className="section_wrapper">
                <div className="section_sub-title">My Plans</div>
                <div className="dot"> {'\u00B7'} </div>
                {ownPlansIdList && (
                  <div className="item_amount">{ownPlansIdList.length}</div>
                )}
              </div>
            </div>

            <PlanCollectionWrapper>
              {showNoPlansText && (
                <NoPlansText>
                  <div className="title">
                    You haven't created any travel plans yet.
                  </div>
                  <div className="instruction">
                    Click on
                    <div className="btn_cta">ADD NEW PLAN</div>
                    to start one!
                  </div>
                </NoPlansText>
              )}
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
          </div>
        </SectionContainer>
      )}

      {displaySection === 'Favourite Plans' && (
        <SectionContainer>
          <div className="section_wrapper">
            <div className="section_title">Favourites</div>
          </div>
          <FavouriteFolderBar currentUserId={currentUserId} />
        </SectionContainer>
      )}
    </Wrapper>
  );
}

export default Dashboard;
