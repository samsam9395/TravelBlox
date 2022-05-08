import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';
import firebaseDB from '../utils/firebaseConfig';
import PublicPlanCard from '../components/PublicPlanCard';
import { themeColours } from '../utils/globalTheme';

const db = firebaseDB();

const PlanCollectionWrapper = styled.div`
  display: flex;
  padding: 15px;
  width: 100%;
  box-sizing: content-box;
  flex-wrap: wrap;

  margin: 30px 0;
`;

const SearchContainer = styled.div`
  padding-top: 20px;
  width: 70%;
  margin: auto;
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    margin: none;
  }
`;

const MainImgContainer = styled.div`
  width: 100%;
  height: 300px;
`;

const MainImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 0 -92px;
  @media (max-width: 768px) {
    object-position: unset;
  }
`;

const CallToActionText = styled.div`
  font-size: 36px;
  font-weight: 600;
  min-width: 300px;
  .text_where {
    font-size: 48px;
  }

  .text_are_you {
    text-align: center;
    padding-left: 30px;
  }

  .text_heading_to {
    display: flex;
    align-items: center;
  }
  .text_heading {
    font-size: 40px;
    margin-right: 20px;
    font-style: italic;
    color: ${themeColours.orange};
  }
  @media (max-width: 768px) {
    margin-bottom: 30px;
    width: 70%;
    line-height: 2em;
    .text_are_you {
      text-align: right;
      padding-left: 30px;
    }
  }
`;

// const SearchInput = styled.input`
//   width: auto;
//   padding: 0 10px;
//   height: 30px;
// `;

const SearchInputMUI = styled(TextField)({
  '& label.Mui-focused': {
    color: themeColours.orange,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'red',
  },
  // minWidth: '30vw',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: themeColours.orange,
    },
  },
  '&:hover label.Mui-focused': {
    borderColor: 'yellow',
  },
  '&.Mui-focused fieldset': {
    borderColor: 'green',
  },
  // },
});

// defaultImg={defaultImg}
function Allplans(props) {
  const [allPlansList, setAllPlansList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [displayPlans, setDisplayPlans] = useState([]);
  const [discoverMainImg, setDiscoverMainImg] = useState('');

  useEffect(async () => {
    const allPlans = await getDocs(collection(db, 'allPlans'));
    // console.log(allPlans);

    if (allPlans.docs.length === 0) {
      console.log('No plans yet!');
    } else {
      setAllPlansList(allPlans.docs.map((e) => e.data()));
      setDisplayPlans(allPlans.docs.map((e) => e.data()));
    }
  }, []);

  useEffect(async () => {
    const discoverMainImg = await getDoc(
      doc(db, 'main-components', 'discover_main_image')
    );
    // console.log(discoverMainImg.data().discover_main_image);

    setDiscoverMainImg(discoverMainImg.data().discover_main_image);
  }, []);

  useEffect(() => {
    let list = [];

    allPlansList.map((e) => {
      // console.log(222, e.country.label);
      if (e.author === inputValue.toLowerCase()) {
        // console.log('its equal!!! ', e);
        list.push(e);
        setDisplayPlans(list);
      } else if (e.title.toLowerCase().includes(inputValue.toLowerCase())) {
        // console.log('title includes ', e);
        list.push(e);
        setDisplayPlans(list);
      } else if (e.country.label.toLowerCase() === inputValue.toLowerCase()) {
        // console.log('country is equal!!! ', e);
        list.push(e);
        setDisplayPlans(list);
      }
      console.log(displayPlans);
    });
  }, [inputValue]);

  return (
    <>
      <MainImgContainer>
        <MainImg src={discoverMainImg}></MainImg>
      </MainImgContainer>
      <SearchContainer>
        <CallToActionText>
          <div className="text_where">Where</div>
          <div className="text_are_you">are you</div>{' '}
          <div className="text_heading_to">
            {' '}
            <div className="text_heading">heading</div> to?
          </div>{' '}
        </CallToActionText>
        <SearchInputMUI
          variant="standard"
          fullWidth
          id="standard-adornment-amount"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon
                position="start"
                style={{ color: themeColours.orange }}>
                Search
              </SearchIcon>
            ),
          }}></SearchInputMUI>
      </SearchContainer>

      <PlanCollectionWrapper>
        {displayPlans.map((planInfo, index) => (
          <PublicPlanCard
            planInfo={planInfo}
            key={index}
            defaultImg={props.defaultImg}
          />
        ))}
      </PlanCollectionWrapper>
    </>
  );
}

export default Allplans;
