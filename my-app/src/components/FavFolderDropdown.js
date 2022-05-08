import React, { useState, useEffect } from 'react';
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
const db = firebaseDB();

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  align-items: center;
  position: relative;
`;

function FavFolderDropdown({
  favPlansNameList,
  setSelectedPlanId,
  importTimeBlock,
  selectedPlanId,
  planDocRef,
  setAddedTimeBlock,
  startDateValue,
}) {
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

  return (
    <Wrapper>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Plan</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value)}
          label="Plans">
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {favPlansNameList.map((e, index) => (
            <MenuItem value={e.fav_plan_doc_ref || ''} key={index}>
              {e.fav_plan_title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <Button
        variant="outlined"
        onClick={() => importTimeBlock(selectedPlanId, planDocRef)}>
        Import
      </Button> */}
      <Button
        variant="outlined"
        onClick={async () => {
          // importTimeBlock(selectedPlanId, planDocRef);
          const importResult = await importTimeBlock(selectedPlanId);
          console.log(importResult);
          addImportToDataBase(planDocRef, importResult);
        }}>
        Import
      </Button>
    </Wrapper>
  );
}

export default FavFolderDropdown;
