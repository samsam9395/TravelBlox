import {
  ContentWrapper,
  LightOrangeBtn,
  fonts,
  themeColours,
} from '../styles/globalTheme';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';

import FavouriteFolderBar from '../components/favourite/FavouriteFolderBar';
import FullLoading from '../components/general/FullLoading';
import { IconButton } from '@mui/material';
import LogoutMUIIcon from '@mui/icons-material/Logout';
import { ReactComponent as MilkteaCurveLineSVG } from '../images/dashboard/right_milktea_curve_line.svg';
import OwnPlanCard from '../components/dashboard/OwnPlanCard';
import Swal from 'sweetalert2';
import UploadIcon from '@mui/icons-material/Upload';
import { UserContext } from '../App';
import firebaseService from '../utils/fireabaseService';
import sparkle from '../images/dashboard/spark.png';
import styled from 'styled-components';
import { uploadImagePromise } from '../utils/functionList';
import { useNavigate } from 'react-router-dom';

const SvgWrapper = styled.div`
  position: fixed;
  right: 20px;
  top: 5px;

  z-index: -100;
`;

const MilkteaCurveLine = styled(MilkteaCurveLineSVG)`
  position: fixed;
  right: -31px;
  top: 53px;
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

  @media (max-width: 768px) {
    flex-direction: column;
    padding-bottom: 80px;
  }
`;

const SparkleLeft = styled.img`
  position: absolute;
  width: 29px;
  top: 58%;
  left: 10%;
`;
const SparkleLeftSmall = styled.img`
  position: absolute;
  width: 13px;
  bottom: 21%;
  left: 15%;
`;
const SparkleRight = styled.img`
  position: absolute;
  width: 24px;
  top: 24%;
  left: 25%;
`;

const UserInfoWrapper = styled.div`
  padding-top: 20px;
  display: flex;
  align-items: center;
  height: 300px;

  @media (max-width: 768px) {
    padding: 0;
    height: 200px;
  }
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 30px;
`;
const Greeting = styled.div`
  text-align: center;
  display: flex;
  margin-bottom: 20px;
  font-size: 30px;
  color: ${themeColours.light_orange};
  font-weight: 600;
`;

const UserBasicInfo = styled.div`
  color: ${themeColours.dark_blue};
`;

const UserImg = styled.img`
  display: block;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  border: none;
  object-fit: cover;
`;

const UserAvatarUpload = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: grey;
  position: relative;
`;

const UserAvatarUploadIcon = styled.label`
  position: absolute;
  bottom: 0;
  right: -10px;
  border-radius: 50%;

  &:hover {
    background-color: rgb(0 0 0 / 12%);
  }
`;

const AvatarDecorateLine = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: absolute;
  left: -29px;
  top: -23px;
  border: 1px solid ${themeColours.orange_grey};
  z-index: -10;
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
`;

const LogoutIcon = styled(LogoutMUIIcon)`
  margin-right: 5px;
`;

const SectionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${fonts.secondary_font}, sans-serif;

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

  .divider {
    color: ${themeColours.light_grey};
  }
  @media (max-width: 768px) {
    width: 70%;
  }
`;

const Divider = styled.div``;

const PlanTab = styled.div`
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
`;

function signOutFirebase() {
  const auth = getAuth();

  return signOut(auth)
    .then(() => {
      Swal.fire('You were signed out!');
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
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
      if (firebaseService.getOwnPlans(userInfo.userEmail)) {
        setShowNoPlansText(false);
        setOwnPlansIdList();
      } else {
        setShowNoPlansText(true);
      }

      const userBasicInfo = await firebaseService.getUserBasicInfo(
        userInfo.userEmail
      );
      setUserImage(userBasicInfo.userImage);
      setUserName(userBasicInfo.username);
    }
  }, []);

  return (
    <ContentWrapper>
      <Wrapper>
        <FullLoading opacity={loadindOpacity} />
        <SvgWrapper>
          <UpperPartBackground />
          <MilkteaCurveLine />
        </SvgWrapper>

        <TopSectionWrapper>
          <SparkleLeft src={sparkle} alt="decorate sparkle" />
          <SparkleLeftSmall src={sparkle} alt="decorate sparkle" />
          <SparkleRight src={sparkle} alt="decorate sparkle" />

          <UserInfoWrapper>
            <UserAvatarUpload
              onMouseEnter={() => setShowUserUploadIcon('visible')}
              onMouseLeave={() => setShowUserUploadIcon('hidden')}>
              <UserImg src={userImage} alt="user image" />

              <UserAvatarUploadIcon htmlFor="user_avatar_file">
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
                    firebaseService.saveImgToDataBase(
                      imageFile,
                      userInfo.userEmail
                    );
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
              </UserAvatarUploadIcon>

              <AvatarDecorateLine />
            </UserAvatarUpload>

            <UserInfoContainer>
              <Greeting>Hello!</Greeting>
              <UserBasicInfo>{userName}</UserBasicInfo>
              <UserBasicInfo>{userInfo?.userEmail}</UserBasicInfo>
              <LogoutContainer
                onClick={() => {
                  if (signOutFirebase()) {
                    navigate('/');
                  }
                  console.log(signOutFirebase());
                }}>
                <LogoutIcon></LogoutIcon> Logout
              </LogoutContainer>
            </UserInfoContainer>
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
            <PlanTab
              value="own_plan"
              onClick={(e) => setDisplaySection(e.target.textContent)}>
              My Plans
            </PlanTab>
            <div className="divider">|</div>
            <PlanTab
              value="fav_plan"
              onClick={(e) => setDisplaySection(e.target.textContent)}>
              Favourite Plans
            </PlanTab>
          </DisplaySwitch>
        </TopSectionWrapper>

        {showAddPlanPopUp && navigate('/new-plan')}

        {displaySection === 'My Plans' && (
          <SectionContainer>
            <SectionWrapper>
              <div className="section_title">Plans</div>
            </SectionWrapper>

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
