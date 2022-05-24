import '../styles/libraryStyles.scss';

import { LightOrangeBtn, fonts, themeColours } from '../styles/globalTheme';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import styled, { css, keyframes } from 'styled-components';

import DayBlockCard from '../components/daily_event_card/DayBlockCard';
import DayCalendar from '../components/daily_event_card/DayCalendar';
import ExportGCalendarBtn from '../components/google_calendar/ExportGCalendarBtn';
import FullLoading from '../components/general/FullLoading';
import ImageEnlarge from '../components/daily_event_card/ImageEnlarge';
import { ReactComponent as MilkTeaLeftCurveLine } from '../images/milktea_line_left.svg';
import Swal from 'sweetalert2';
import Timeline from '../components/daily_event_card/Timeline';
import { UserContext } from '../App';
import firebaseDB from '../utils/firebaseConfig';
import { loopThroughDays } from '../utils/functionList';
import sunburst from '../images/static/sunburst_solid.png';
import { useParams } from 'react-router-dom';

const db = firebaseDB();

const zoomInAnimation = keyframes`
  0% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1.5, 1.5);
  }
`;

const Wrapper = styled.div`
  width: 90vw;
  margin: auto;
  padding: 100px 0;

  @media (max-width: 768px) {
    padding: 80px 15px 80px 15px;
  }
`;

const UpperContainer = styled.div`
  display: flex;
  box-sizing: content-box;
  width: 100%;
  height: 500px;
  margin-bottom: 30px;
  position: relative;

  .milktea_svg_left {
    position: absolute;
    right: 119px;
    top: -150px;
    z-index: -10;
  }
`;

const LowerContainer = styled.div`
  display: flex;
  justify-content: center;
  box-sizing: content-box;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FavouriteFolderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const PlanInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 20px;
  justify-content: center;
  flex-grow: 0;

  @media (max-width: 768px) {
    padding-right: 10px;
    width: 20%;
  }
`;

const UserInfoContainer = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;

  .user_info_title {
    text-align: center;
    display: flex;
    margin-top: 20px;
    color: ${themeColours.light_grey};
    flex-direction: column;
    font-weight: 600;
    font-style: italic;
  }

  .author_name {
    font-style: normal;
    font-weight: 600;
    margin: 10px 0 5px 0;
    letter-spacing: 1px;
    color: ${themeColours.darker_orange};
  }

  .author_id {
    font-style: normal;
    color: ${themeColours.dark_blue};
    font-weight: 200;
    padding-left: 10px;
    font-size: 12px;
  }

  .user_img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const PlanCardsWrapper = styled.div`
  margin-top: 50px;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const FavouriteFolderDropDownOptions = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
  position: absolute;
  width: 90%;
  top: 33px;
  left: 10px;
  color: white;
  border-radius: 0 0 10px 10px;
  background-color: ${themeColours.light_orange};

  .folder_option {
    padding: 5px;
    &:hover {
      cursor: pointer;
      background-color: ${themeColours.pale};
      border-radius: 10px;
    }
  }
`;
const PlanMainImageContainer = styled.div`
  width: 80%;
  height: 100%;
  position: relative;
  border-radius: 10px;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-grow: 1;

  &:hover {
    .planTitle_text_bakground {
      transform: translate(0, 100%);
      transition: all 0.3s ease-in-out 0s;
      -webkit-transition: all 0.3s ease-in-out 0s;
    }
  }

  .sunburst {
    position: absolute;
    right: 34px;
    top: 30px;
    width: 60px;
  }
  .sunburst_small {
    position: absolute;
    right: 74px;
    top: 217px;
    width: 40px;
  }
`;

const PlanMainImage = styled.div`
  width: 445px;
  height: 100%;
  opacity: 100%;
  border-radius: 15px;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 500px 500px 0 0;
    &:hover {
      cursor: pointer;
      animation-name: ${zoomInAnimation};
      animation-duration: 1.5s;
    }
  }

  @media (max-width: 768px) {
    width: 70%;
  }
`;

const PlanTitleText = styled.div`
  font-family: ${fonts.handwriting}, ${fonts.main_font};
  width: 55%;
  position: absolute;
  left: 2%;
  top: -3%;
  font-size: clamp(55px, 4vw, 105px);
  letter-spacing: 5px;
  color: ${themeColours.dark_blue};
  text-shadow: 2px 1px ${themeColours.pale};

  .location_text {
    font-family: ${fonts.handwriting}, ${fonts.main_font};
    font-weight: 400;
    letter-spacing: 1px;
    text-shadow: none;
    color: ${themeColours.pale};
    font-size: clamp(1.5em, 4vw, 5vw);
    position: absolute;
    color: #fceebf;
    right: -44%;
    text-shadow: 2px 1px ${themeColours.light_grey};
  }

  @media (max-width: 768px) {
    top: 35%;
    width: 55%;
    left: 3%;
  }
`;

const BtnWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  position: relative;
  flex-direction: column;
`;

const ColouredLine = ({ colour }) => (
  <hr
    style={{
      colour: colour,
      backgroundColor: colour,
      height: 2,
    }}
  />
);

const Tab = styled.div`
  z-index: 5;
  padding: 10px;
  ${(props) =>
    props.isCurrentActiveTab === props.tabName
      ? css`
          color: ${themeColours.dark_blue};
          border-bottom: 1px solid ${themeColours.dark_blue};
          font-weight: 600;
        `
      : css`
          color: ${themeColours.light_grey};
          padding-bottom: 'none';
          font-weight: 'normal';
        `};
`;

const SwitchTab = styled.div`
  display: flex;
  width: 500px;
  margin: auto;
  font-size: 18px;
  justify-content: space-evenly;
  align-items: center;

  .tab_calendar {
    color: ${themeColours.dark_blue};
    font-weight: 600;
    border-bottom: 1px solid ${themeColours.dark_blue};
  }

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ToTopScroll = styled.div`
  letter-spacing: 3px;
  font-family: ${fonts.secondary_font}, ${fonts.main_font}, sans-serif;
  font-size: 14px;
  float: right;
`;

function StaticPlanDetail() {
  const userInfo = useContext(UserContext);
  const { planDocRef } = useParams();
  const [mainImage, setMainImage] = useState(null);
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [author, setAuthor] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberofDays, setNumberofDays] = useState(0);
  const [timestampList, setTimestampList] = useState([]);
  const [showfavDropDown, setShowFavDropDown] = useState(false);

  const [stopTimelineNav, settopTimelineNav] = useState(false);
  const planCollectionRef = doc(db, 'plans', planDocRef);
  const itemEls = useRef(new Array());
  const timelineRefArray = useRef(new Array());

  const navTabDay = useRef(null);
  const navTabMap = useRef(null);
  const navTabCalendar = useRef(null);

  const [dropDownFavouriteFolderOption, setDropDownFavouriteFolderOption] =
    useState([]);

  const [userImage, setUserImage] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [loadindOpacity, setLoadindOpacity] = useState(1);
  const [showTab, setShowTab] = useState('calendar');

  const planImageRef = useRef(null);

  async function handleFavouriteAction(
    planDocRef,
    author,
    selectFavFolder,
    planTitle,
    setShowFavDropDown
  ) {
    if (userInfo.userEmail === author) {
      Swal.fire('Do not favourite your own plan!');
    } else if (selectFavFolder !== '') {
      const favRef = doc(
        db,
        'userId',
        userInfo.userEmail,
        'fav_plans',
        planDocRef
      );

      try {
        await setDoc(favRef, {
          fav_plan_doc_ref: planDocRef,
          infolder: selectFavFolder,
          fav_plan_title: planTitle,
        });
        setShowFavDropDown(false);

        Swal.fire({
          title: 'Successfully favourite this plan',
          width: 600,
          text: 'You can now import this schedule to your own travel plans!',
          confirmButtonText: 'OK',
          focusConfirm: 'false',
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      Swal.fire('Please select a folder!');
    }
  }

  useEffect(async () => {
    if (userInfo) {
      const favFolderRef = collection(
        db,
        'userId',
        userInfo.userEmail,
        'fav_folders'
      );

      try {
        const list = await getDocs(favFolderRef);
        setDropDownFavouriteFolderOption(
          list.docs.map((e) => e.data().folder_name)
        );
      } catch (error) {
        console.log(error);
      }
    }
  }, [userInfo]);

  useEffect(async () => {
    const docSnap = await getDoc(planCollectionRef);
    const data = docSnap.data();

    setPlanTitle(data.title);
    setCountry(data.country);
    setMainImage(data.main_image);
    setStartDate(data.start_date);
    setEndDate(data.end_date);
    setAuthor(data.author);
  }, []);

  useEffect(async () => {
    if (author) {
      try {
        const userDoc = await getDoc(doc(db, 'userId', author));
        setUserImage(userDoc.data().userImage);
        setAuthorName(userDoc.data().username);
      } catch (error) {
        console.log(error);
      }
    }
  }, [author]);

  useEffect(() => {
    const nofDays =
      (endDate.seconds * 1000 - startDate.seconds * 1000) /
      (1000 * 60 * 60 * 24);
    setNumberofDays(nofDays);
  }, [endDate, startDate]);

  useEffect(() => {
    if (loopThroughDays(startDate.seconds * 1000, numberofDays).length === 0) {
      setTimestampList(loopThroughDays(startDate.seconds * 1000, 0));
    } else {
      setTimestampList(loopThroughDays(startDate.seconds * 1000, numberofDays));
    }
  }, [numberofDays]);

  const FavFolderRef = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        showfavDropDown &&
        FavFolderRef.current &&
        !FavFolderRef.current.contains(e.target)
      ) {
        setShowFavDropDown(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showfavDropDown]);

  if (itemEls.current.length > 0) {
    for (let ref of itemEls.current) {
      if (ref.current === null) {
        let index = itemEls.current.indexOf(ref);
        itemEls.current.splice(index, 1);
      }
    }
  }

  useEffect(() => {
    if (mainImage && authorName && timestampList.length !== 0) {
      setLoadindOpacity(0);
    }
  }, [mainImage, authorName]);

  return (
    <Wrapper>
      <FullLoading opacity={loadindOpacity} />
      {showFullImage && (
        <ImageEnlarge
          mainImage={mainImage}
          setShowFullImage={setShowFullImage}
        />
      )}
      <UpperContainer>
        <MilkTeaLeftCurveLine className="milktea_svg_left"></MilkTeaLeftCurveLine>
        <PlanMainImageContainer>
          <PlanMainImage className="overlay" ref={planImageRef}>
            <img
              src={mainImage}
              loading="lazy"
              alt="plan image"
              onClick={() => setShowFullImage(true)}
            />
          </PlanMainImage>

          <img src={sunburst} alt="sunburst" className="sunburst" />
          <img src={sunburst} alt="sunburst" className="sunburst_small" />
          <PlanTitleText>
            {planTitle}
            <div className="location_text">{country.label}</div>
          </PlanTitleText>
        </PlanMainImageContainer>

        <PlanInfoWrapper>
          <UserInfoContainer>
            <img className="user_img" src={userImage} alt="" />

            <div className="user_info_title">
              Planned by:
              {authorName && <div className="author_name">{authorName}</div>}
              <div className="author_id">{author}</div>
            </div>
          </UserInfoContainer>

          <BtnWrapper>
            <FavouriteFolderWrapper>
              <LightOrangeBtn
                padding="10px"
                fontSize="14px"
                width="165px"
                onClick={() => setShowFavDropDown(!showfavDropDown)}>
                Favourite this plan
              </LightOrangeBtn>
              {showfavDropDown && (
                <FavouriteFolderDropDownOptions>
                  {dropDownFavouriteFolderOption?.map((folderName, index) => (
                    <div
                      key={index}
                      className="folder_option"
                      onClick={() =>
                        handleFavouriteAction(
                          planDocRef,
                          author,
                          folderName,
                          planTitle,
                          setShowFavDropDown
                        )
                      }>
                      {folderName}
                    </div>
                  ))}
                </FavouriteFolderDropDownOptions>
              )}
            </FavouriteFolderWrapper>
            <ExportGCalendarBtn planDocRef={planDocRef} planTitle={planTitle} />
          </BtnWrapper>
        </PlanInfoWrapper>
      </UpperContainer>

      <ColouredLine colour={'black'} />

      <SwitchTab>
        <Tab
          tabName="calendar"
          ref={navTabCalendar}
          className="tab"
          isCurrentActiveTab={showTab}
          onClick={() => {
            setShowTab('calendar');
            settopTimelineNav(true);
          }}>
          Calendar
        </Tab>
        <Tab
          tabName="route"
          ref={navTabMap}
          className="tab "
          isCurrentActiveTab={showTab}
          onClick={() => {
            setShowTab('route');
            settopTimelineNav(false);
          }}>
          Map
        </Tab>
        <Tab
          tabName="dayByday"
          ref={navTabDay}
          className="tab"
          isCurrentActiveTab={showTab}
          onClick={() => {
            setShowTab('dayByday');
            settopTimelineNav(false);
          }}>
          Day by Day
        </Tab>
      </SwitchTab>

      <LowerContainer>
        {stopTimelineNav ? (
          <Timeline
            NumofDays={timestampList.length}
            RefList={itemEls}
            timelineRefArray={timelineRefArray}
            stopTimelineNav={'none'}
          />
        ) : (
          <Timeline
            NumofDays={timestampList.length}
            RefList={itemEls}
            timelineRefArray={timelineRefArray}
            stopTimelineNav={'auto'}
          />
        )}
        <PlanCardsWrapper>
          {showTab !== 'calendar' &&
            timestampList.map((day, index) => {
              return (
                <DayBlockCard
                  timelineRefArray={timelineRefArray}
                  itemEls={itemEls}
                  currentDayDate={day}
                  day={day}
                  planDocRef={planDocRef}
                  index={index}
                  key={index}
                  showTab={showTab}
                />
              );
            })}
          {showTab === 'calendar' && timestampList[0] != 'Invalid Date' && (
            <DayCalendar
              planDocRef={planDocRef}
              currentDayDate={timestampList[0]}
            />
          )}
        </PlanCardsWrapper>
      </LowerContainer>
      <ToTopScroll
        className="hoverCursor"
        onClick={() => window.scrollTo({ top: 120, behavior: 'smooth' })}>
        ^Top
      </ToTopScroll>
    </Wrapper>
  );
}
export default StaticPlanDetail;
