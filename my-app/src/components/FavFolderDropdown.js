import React, { useState, useEffect, useRef } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import styled from 'styled-components';
import firebaseDB from '../utils/firebaseConfig';
import {
  LightOrangeBtn,
  themeColours,
  LightBlueBtn,
} from '../styles/globalTheme';
import '../favourite/favDropDown.scss';
import { getFavPlan } from '../utils/functionList';

const db = firebaseDB();

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 39px;
  /* position: absolute; */
  /* top: 50px; */
`;

const ImportBtnWrapper = styled.div`
  position: absolute;
  /* top: calc(100% + 115px); */
  top: calc(100% + 120px);
  right: -130px;
`;

const ImportWrapperTest = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`;

function FavFolderDropdown({
  importTimeBlock,
  planDocRef,
  setAddedTimeBlock,
  startDateValue,
  currentUserId,
}) {
  const [favPlansNameList, setFavPlansNameList] = useState(null);
  const [showFavPlans, setShowFavPlans] = useState(false);
  const [dropDownOption, setDropDownOption] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [showSecondLayer, setShowSecondLayer] = useState(false);
  const [showImportBtn, setShowImportBtn] = useState(false);

  console.log('favPlansNameList', favPlansNameList);

  // function HandleShowDropDown() {
  //   setShowSecondLayer(true);
  // }

  useEffect(async () => {
    const favFolderRef = collection(db, 'userId', currentUserId, 'fav_folders');

    try {
      const list = await getDocs(favFolderRef);
      list.docs.map((e) => console.log(e.data()));
      setDropDownOption(list.docs.map((e) => e.data().folder_name));
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function importTimeBlock(selectedPlanId) {
    console.log('importTimeBlock clicked', selectedPlanId);
    let importEndTime = new Date(startDateValue);
    importEndTime.setHours(importEndTime.getHours() + 2);

    const blocksListRef = collection(
      db,
      'plans',
      selectedPlanId,
      'time_blocks'
    );

    const docSnap = await getDocs(blocksListRef);

    // console.log(docSnap.docs.map((e) => e.data()));
    const data = docSnap.docs.map((e) => e.data());
    const importEvents = data.map((e) => ({
      status: 'imported',
      start: new Date(startDateValue),
      end: new Date(importEndTime),
      title: e.title,
      id: e.id,
      place_id: e.place_id,
      place_format_address: e.place_format_address,
      place_name: e.place_name,
      place_formatted_phone_number: e.international_phone_number || '',
      place_url: e.place_url,
      place_types: e.place_types,
      place_img: e.place_img,
    }));
    console.log(importEvents);
    return importEvents; //for updating local event
  }

  async function addImportToDataBase(planDocRef, importResult) {
    console.log('adding to dataBase', importResult);
    console.log('db', 'plans', planDocRef, 'time_blocks');

    console.log(11, importResult);
    if (importResult) {
      // try batch
      const batch = writeBatch(db);

      importResult.forEach(async (timeblock) => {
        console.log(22, timeblock);

        const createRef = doc(
          collection(db, 'plans', planDocRef, 'time_blocks')
        );
        const importActionRef = doc(
          db,
          'plans',
          planDocRef,
          'time_blocks',
          createRef.id
        );

        batch.set(
          importActionRef,
          {
            title: timeblock.title,
            start: timeblock.start,
            end: timeblock.end,
            place_id: timeblock.place_id,
            place_name: timeblock.place_name,
            place_format_address: timeblock.place_format_address,
            id: createRef.id,
            place_img: timeblock.place_img || '',
            place_formatted_phone_number:
              timeblock.place_formatted_phone_number || '',
            place_url: timeblock.place_url,
            place_types: timeblock.place_types || '',
            status: 'imported',
          },
          { merge: true }
        );
      });
      try {
        await batch.commit();
        console.log(setAddedTimeBlock);
        if (setAddedTimeBlock) {
          console.log('going to set setAddedTimeBlock true');
          setAddedTimeBlock(true);
        }
        console.log('Successfully imported!');
        alert('Successfully imported!');
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    console.log('222 favPlansNameList', favPlansNameList);
  }, [favPlansNameList, showSecondLayer]);

  const dropDownRef = useRef([]);

  console.log(66, showSecondLayer);
  console.log(77, showImportBtn);

  return (
    <Wrapper>
      <div className="dropdown">
        <input type="checkbox" id="dropdown" />
        <label
          className="dropdown__face"
          for="dropdown"
          onClick={() => {
            setShowSecondLayer(showSecondLayer ? !showSecondLayer : false);
            setShowImportBtn(false);
          }}>
          <div className="dropdown__text">Folders</div>

          <div className="dropdown__arrow"></div>
        </label>
        <ul className="dropdown__items">
          {dropDownOption?.map((e, index) => (
            <li
              value={e.fav_plan_doc_ref || ''}
              key={index}
              onClick={(e) => {
                setShowSecondLayer(true);
                getFavPlan(
                  e.target.textContent,
                  currentUserId,
                  setFavPlansNameList
                );
              }}>
              {e}
            </li>
          ))}
        </ul>
        <ul
          className="secondlayer_dropdown__items"
          style={{
            opacity: !showSecondLayer ? '0' : '1',
            visibility: !showSecondLayer ? 'hidden' : 'visible',
            top: !showSecondLayer ? 'calc(100% + 10px)' : 'calc(100% + 120px)',
          }}>
          {favPlansNameList?.map((e, index) => (
            <li
              ref={(element) => (dropDownRef.current[index] = element)}
              value={e.fav_plan_doc_ref || ''}
              key={index}
              onClick={(e) => {
                setSelectedPlanId(e.target.textContent);
                setShowImportBtn(true);
                dropDownRef.current.forEach((ref) => {
                  console.log(dropDownRef.current);
                  console.log(ref);
                  if (dropDownRef.current.indexOf(ref) === index) {
                    ref.style.color = themeColours.orange;
                  } else {
                    ref.style.color = 'white';
                  }
                });
              }}>
              {e.fav_plan_title}
            </li>
          ))}
        </ul>
        <ImportBtnWrapper>
          {showImportBtn && (
            <LightOrangeBtn
              variant="outlined"
              onClick={async () => {
                // importTimeBlock(selectedPlanId, planDocRef);
                const importResult = await importTimeBlock(selectedPlanId);
                console.log(importResult);
                addImportToDataBase(planDocRef, importResult);
              }}>
              Import
            </LightOrangeBtn>
          )}
        </ImportBtnWrapper>
      </div>

      <svg>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>
    </Wrapper>
  );
}

export default FavFolderDropdown;
