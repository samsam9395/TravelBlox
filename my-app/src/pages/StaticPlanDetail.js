import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { doc, getDoc, collection, setDoc, getDocs } from 'firebase/firestore';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import DayBlockCard from '../components/DailyEventCard/DayBlockCard';
import { useLocation } from 'react-router-dom';
import firebaseDB from '../utils/firebaseConfig';
import ExportGCalendarBtn from '../components/GoogleCalendar/ExportGCalendarBtn';
import { themeColours, LightOrangeBtn } from '../styles/globalTheme';
import '../styles/libraryStyles.scss';
import Timeline from '../components/DailyEventCard/Timeline';
import UserAvatar from '../components/user/Avatar';
import CheckIcon from '@mui/icons-material/Check';
import DayCalendar from '../components/DailyEventCard/DayCalendar';
import leafShadow from '../images/static/leaf_right_with window.png';
import sunburst from '../images/static/sunburst_solid.png';
// import leafShadow from '../images/static/only_sunshine.png';
import { ReactComponent as MilkTeaLeftCurveLine } from '../images/milktea_line_left.svg';
import ImageEnlarge from '../components/DailyEventCard/ImageEnlarge';

const db = firebaseDB();

const zoomInAnimation = keyframes`
  0% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1.5, 1.5);
  }
`;

const UpperContainer = styled.div`
  display: flex;
  /* flex-direction: column; */
  /* justify-content: space-between; */
  box-sizing: content-box;
  width: 100%;
  height: 500px;
  margin-bottom: 30px;
  position: relative;

  /* .leaf_shadow {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    left: -102px;
    width: 119%;
    height: 110%;
    top: -50px;
    z-index: 5;
    border-radius: 10px;
  } */

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
`;

const FavFolderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  /* margin-bottom: 30px; */
`;

const PlanInfoWrapper = styled.div`
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 20px;
  justify-content: center;
  flex-grow: 0;
`;

const UserInfoContainer = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .user_info_title {
    text-align: center;
    display: flex;
    margin-top: 20px;
    color: ${themeColours.dark_blue};
    flex-direction: column;
    font-weight: 600;
  }

  .authorId {
    color: ${themeColours.dark_blue};
    font-weight: 400;
    padding-left: 10px;
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
  width: 950px;
`;

const FavFolderDropDownOptions = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 15px;
  position: absolute;
  width: 90%;
  top: 44px;
  left: 10px;
  background-color: white;
  border-radius: 0 0 10px 10px;

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
  /* overflow: hidden; */
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
  /* width: 300px;
  height: 300px; */

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
      /* object-fit: contain; */
      /* transition: 0.7s; */
      /* background-color: red; */
      cursor: pointer;
      animation-name: ${zoomInAnimation};
      animation-duration: 1.5s;
      /* animation-iteration-count: infinite; */
    }
  }
`;

const PlanTitleText = styled.div`
  width: 55%;
  z-index: 10;
  font-family: 'Gellatio';
  position: absolute;
  font-weight: 800;
  top: 25%;
  left: 0%;
  /* top: 14%; */
  /* left: 26%; */
  /* transform: translate(-57%, -50%); */
  font-size: 4vw;
  letter-spacing: 3px;
  color: ${themeColours.dark_blue};
  text-shadow: 2px 1px ${themeColours.pale};

  .location_text {
    font-family: 'Gellatio';
    font-weight: 400;
    letter-spacing: 1px;
    text-shadow: none;
    color: ${themeColours.pale};
    font-size: 5.5vw;
    position: absolute;
    color: #fceebf;
    right: -44%;
  }
`;

const BtnWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  position: relative;
  flex-direction: column;
`;

const FavFolderAutocompleteWrapper = styled.div`
  position: absolute;
  top: 45px;
  left: 12px;
  display: flex;
  align-items: center;
`;

const FavFolderAutocomplete = styled(TextField)({
  '& label.Mui-focused': {
    color: themeColours.light_orange,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: themeColours.light_orange,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: themeColours,
    },
    '&:hover fieldset': {
      borderColor: 'yellow',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'green',
    },
  },
});

const ColouredLine = ({ colour }) => (
  <hr
    style={{
      colour: colour,
      backgroundColor: colour,
      height: 2,
    }}
  />
);

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  // console.log('777, nextday is ', result);
  return result;
}

function loopThroughDays(startday, days) {
  const scheduleTimestampList = [];
  const lastDay = addDays(startday, days);
  // console.log(111, startday);
  // console.log(222, lastDay);

  for (let i = 0; i <= days; i++) {
    const nextday = addDays(startday, i);
    scheduleTimestampList.push(nextday);
    // console.log(scheduleTimestampList);

    if (nextday === lastDay) {
      console.log('reached last day');
      break;
    }
  }
  return scheduleTimestampList;
}

const SwitchTab = styled.div`
  display: flex;
  width: 500px;
  margin: auto;
  font-size: 18px;
  justify-content: space-evenly;
  align-items: center;

  .tab {
    padding: 10px;
    color: rgb(0 33 58 / 60%);
  }

  .tab_map {
    color: ${themeColours.dark_blue};
    font-weight: 600;
    border-bottom: 1px solid ${themeColours.dark_blue};
    /* border-bottom-style: ; */
  }

  &:hover {
    cursor: pointer;
  }
`;

const ToTopScroll = styled.div`
  letter-spacing: 3px;
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  float: right;
  /* position: absolute;
  bottom: 0; */
`;
//user={user}
function StaticPlanDetail(props) {
  const [mainImage, setMainImage] = useState(null);
  const [planTitle, setPlanTitle] = useState('');
  const [country, setCountry] = useState('');
  const [hasVisited, setHasVitied] = useState(true);
  const [author, setAuthor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberofDays, setNumberofDays] = useState(0);
  const [timestampList, setTimestampList] = useState([]);
  const [showfavDropDown, setShowFavDropDown] = useState(false);
  const [selectedFavFolder, setSelectedFavFolder] = useState('');
  const [showTab, setShowTab] = useState('route');
  const [stopTimelineNav, settopTimelineNav] = useState(false);

  const location = useLocation();
  const planDocRef = location.state.planDocRef;

  const planCollectionRef = doc(db, 'plans', planDocRef);
  const itemEls = useRef(new Array());
  const timelineRefArray = useRef(new Array());

  const navTabDay = useRef(null);
  const navTabMap = useRef(null);
  const navTabCalendar = useRef(null);
  const refNames = [navTabDay, navTabMap, navTabCalendar];
  const [dropDownFavFolderOption, setDropDownFavFolderOption] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);

  const navTimelineRef = useRef(null);
  const planImageRef = useRef(null);

  function toSiwtchTab(tabName, tabRef) {
    for (let name of refNames) {
      const styles = {
        color: 'rgb(0 33 58 / 70%)',
        fontWeight: 'normal',
        borderBottomWidth: 'none',
        borderBottomStyle: 'none',
        paddingBottom: 'none',
      };
      if (name !== tabRef) {
        Object.assign(name.current.style, styles);
      }
    }

    const styles = {
      color: themeColours.dark_blue,
      fontWeight: 600,
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
    };
    setShowTab(tabName);

    Object.assign(tabRef.current.style, styles);
  }

  // handleFavAction(collectionID, author)
  async function handleFavAction(
    planDocRef,
    author,
    selectFavFolder,
    planTitle,
    setShowFavDropDown
  ) {
    const currentUserEmail = props.user.email;

    if (currentUserEmail === author) {
      alert('Do not favourite your own plan!');
    } else if (selectFavFolder !== '') {
      // console.log(selectFavFolder);
      const favRef = doc(
        db,
        'userId',
        currentUserEmail,
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
        alert('Successfully favourite this plan!');
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('Please select a folder!');
    }
  }

  useEffect(async () => {
    if (props.user) {
      const favFolderRef = collection(
        db,
        'userId',
        props.user.email,
        'fav_folders'
      );

      try {
        const list = await getDocs(favFolderRef);
        list.docs.map((e) => console.log(222, e.data()));
        setDropDownFavFolderOption(list.docs.map((e) => e.data().folder_name));
      } catch (error) {
        console.log(error);
      }
    }
  }, [props.user]);

  useEffect(async () => {
    const docSnap = await getDoc(planCollectionRef);
    const data = docSnap.data();
    console.log(data);

    setPlanTitle(data.title);
    setCountry(data.country);
    setMainImage(data.main_image);
    setStartDate(data.start_date);
    setEndDate(data.end_date);
    setHasVitied(data.visited);
    setAuthor(data.author);
  }, []);

  useEffect(async () => {
    if (author) {
      try {
        const userDoc = await getDoc(doc(db, 'userId', author));
        setUserImage(userDoc.data().userImage);
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

  // console.log('numberofDays should not change', numberofDays);

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
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
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
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showfavDropDown]);

  if (itemEls.current.length > 0) {
    for (let ref of itemEls.current) {
      // console.log(223, ref.current);
      if (ref.current === null) {
        let index = itemEls.current.indexOf(ref);
        itemEls.current.splice(index, 1);
      }
    }
  }

  // console.log(777, itemEls);
  // console.log(888, itemEls.current[0]);
  // console.log(999, itemEls.current.length);

  return (
    <>
      {showFullImage && (
        <ImageEnlarge
          mainImage={mainImage}
          setShowFullImage={setShowFullImage}
        />
      )}
      <UpperContainer>
        {/* <img className="leaf_shadow" src={leafShadow} alt="" /> */}

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
            {/* <UserAvatar currentUserId={author} fromLocate={'static'} /> */}
            <div className="user_info_title">
              Planned by:
              <div className="authorId">{author}</div>
            </div>
          </UserInfoContainer>

          <BtnWrapper>
            <FavFolderWrapper>
              <LightOrangeBtn
                style={{ width: 195 }}
                onClick={() => setShowFavDropDown(!showfavDropDown)}>
                Favourite this plan
              </LightOrangeBtn>
              {showfavDropDown && (
                <FavFolderDropDownOptions>
                  {dropDownFavFolderOption?.map((folderName, index) => (
                    <div
                      key={index}
                      className="folder_option"
                      // onClick={() => console.log()}
                      onClick={() =>
                        handleFavAction(
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
                </FavFolderDropDownOptions>
              )}
            </FavFolderWrapper>
            <ExportGCalendarBtn planDocRef={planDocRef} planTitle={planTitle} />
          </BtnWrapper>
        </PlanInfoWrapper>
      </UpperContainer>

      <ColouredLine colour={'black'} />

      <SwitchTab>
        <div
          ref={navTabMap}
          className="tab tab_map"
          onClick={() => {
            toSiwtchTab('route', navTabMap);
            settopTimelineNav(false);
          }}>
          Map
        </div>
        <div
          ref={navTabDay}
          className="tab"
          onClick={() => {
            toSiwtchTab('dayByday', navTabDay);
            settopTimelineNav(false);
          }}>
          Day by Day
        </div>
        <div
          ref={navTabCalendar}
          className="tab"
          onClick={() => {
            toSiwtchTab('calendar', navTabCalendar);
            settopTimelineNav(true);
          }}>
          Calendar
        </div>
      </SwitchTab>

      <LowerContainer>
        {stopTimelineNav ? (
          <Timeline
            // ref={navTimelineRef}
            NumofDays={timestampList.length}
            RefList={itemEls}
            timelineRefArray={timelineRefArray}
            stopTimelineNav={'none'}
          />
        ) : (
          <Timeline
            // ref={navTimelineRef}
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
          {showTab === 'calendar' && (
            <DayCalendar
              planDocRef={planDocRef}
              currentDayDate={timestampList[0]}
              // showType={'week'}
            />
          )}
        </PlanCardsWrapper>
      </LowerContainer>
      <ToTopScroll
        className="hoverCursor"
        onClick={() => window.scrollTo({ top: 120, behavior: 'smooth' })}>
        ^Top
      </ToTopScroll>
    </>
  );
}
export default StaticPlanDetail;
