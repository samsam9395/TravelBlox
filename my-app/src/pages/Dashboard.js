import {
  ContentWrapper,
  LightOrangeBtn,
  fonts,
  themeColours,
} from '../styles/globalTheme';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

import FavouriteFolderBar from '../components/favourite/FavouriteFolderBar';
import FullLoading from '../components/general/FullLoading';
import { IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import OwnPlanCard from '../components/OwnPlanCard';
import Swal from 'sweetalert2';
import UploadIcon from '@mui/icons-material/Upload';
import { UserContext } from '../App';
import { ReactComponent as YourSvg } from '../images/right_milktea_curve_line.svg';
import firebaseDB from '../utils/firebaseConfig';
import sparkle from '../images/dashboard/spark.png';
import styled from 'styled-components';
import { uploadImagePromise } from '../utils/functionList';
import { useNavigate } from 'react-router-dom';

const db = firebaseDB();

const SvgWrapper = styled.div`
  position: fixed;
  right: 20px;
  top: 5px;

  .milktea_svg_long {
    position: fixed;
    right: -31px;
    top: 53px;
  }
  z-index: -100;
`;

const UpperPartBackground = styled.div`
  background-color: ${themeColours.milktea};
  border: none;
  width: 400px;
  height: 400px;

  z-index: -100;
  border-radius: 50%;
  position: fixed;
  right: -184px;
  top: -145px;
`;

const Wrapper = styled.div`
  position: relative;
  padding-top: 20px;
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
    top: 58%;
    left: 10%;
  }

  .sparkle_left_small {
    position: absolute;
    width: 13px;
    bottom: 21%;
    left: 15%;
  }

  .sparkle_right {
    position: absolute;
    width: 24px;
    top: 24%;
    left: 25%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding-bottom: 80px;
  }
`;

const UserInfoWrapper = styled.div`
  padding-top: 20px;
  display: flex;
  align-items: center;
  height: 300px;

  .user_info_container {
    display: flex;
    flex-direction: column;
    margin-left: 30px;
  }

  .greeting {
    text-align: center;
    display: flex;
    margin-bottom: 20px;
    font-size: 30px;
    color: ${themeColours.light_orange};
    font-weight: 600;
  }

  .user_id {
    color: ${themeColours.dark_blue};
  }

  @media (max-width: 768px) {
    padding: 0;
    height: 200px;
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

  @media (max-width: 768px) {
    width: 350px;
  }
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
    min-width: 50%;
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

  .divider {
    color: ${themeColours.light_grey};
  }
  @media (max-width: 768px) {
    width: 70%;
  }
`;

function signOutFirebase() {
  const auth = getAuth();

  signOut(auth)
    .then(() => {
      Swal.fire('You were signed out!');
    })
    .catch((error) => {
      console.log(error);
    });
}

function Dashboard() {
  const [showAddPlanPopUp, setShowAddPlanPopup] = useState(false);
  const [userName, setUserName] = useState('');
  const [ownPlansIdList, setOwnPlansIdList] = useState([]);
  const [openEditPopUp, setOpenEditPopUp] = useState(false);
  const [showNoPlansText, setShowNoPlansText] = useState(false);
  const [displaySection, setDisplaySection] = useState('My Plans');
  const [userImage, setUserImage] = useState(null);
  const [showUserUploadIcon, setShowUserUploadIcon] = useState('hidden');
  const [loadindOpacity, setLoadindOpacity] = useState(1);
  const navigate = useNavigate();
  const uploadIconRef = useRef(null);

  const userInfo = useContext(UserContext);

  useEffect(() => {
    if (userName) {
      setLoadindOpacity(0);
    }
  }, [userName]);

  useEffect(async () => {
    if (!userInfo) {
      Swal.fire('Please login first!');
      navigate('/');
    } else {
      const ref = collection(db, 'userId', userInfo.userEmail, 'own_plans');
      const plansList = await getDocs(ref);

      if (plansList.docs.length === 0) {
        setShowNoPlansText(true);
      } else {
        setShowNoPlansText(false);
        const list = [];
        plansList.forEach((plan) => {
          list.push(plan.data().collection_id);
        });

        setOwnPlansIdList(list);
      }

      try {
        const userDoc = await getDoc(doc(db, 'userId', userInfo.userEmail));
        setUserImage(userDoc.data().userImage);
        setUserName(userDoc.data().username);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  function saveImgToDataBase(userImage) {
    try {
      setDoc(
        doc(db, 'userId', userInfo.userEmail),
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
    <ContentWrapper>
      <Wrapper>
        <FullLoading opacity={loadindOpacity} />
        <SvgWrapper>
          <UpperPartBackground></UpperPartBackground>
          <YourSvg className="milktea_svg_long"></YourSvg>
        </SvgWrapper>

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
                  onChange={async (e) => {
                    const imageFile = await uploadImagePromise(
                      e.target.files[0]
                    );
                    setUserImage(imageFile);
                    saveImgToDataBase(imageFile);
                  }}></input>
                <IconButton
                  style={{
                    visibility: showUserUploadIcon,
                  }}
                  ref={uploadIconRef}
                  aria-label="upload picture"
                  component="div">
                  <UploadIcon style={{ color: themeColours.dark_blue }} />
                </IconButton>
              </label>

              <div className="avatar_line"></div>
            </UserAvatarUpload>

            <div className="user_info_container">
              <div className="greeting">Hello!</div>
              <div className="user_id">{userName}</div>
              <div className="user_id">{userInfo.userEmail}</div>
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
            <div className="divider">|</div>
            <div
              className="plan_tab"
              value="fav_plan"
              onClick={(e) => setDisplaySection(e.target.textContent)}>
              Favourite Plans
            </div>
          </DisplaySwitch>
        </TopSectionWrapper>

        {showAddPlanPopUp && navigate('/new-plan')}

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
            <FavouriteFolderBar currentUserId={userInfo.userEmail} />
          </SectionContainer>
        )}
      </Wrapper>
    </ContentWrapper>
  );
}

export default Dashboard;
