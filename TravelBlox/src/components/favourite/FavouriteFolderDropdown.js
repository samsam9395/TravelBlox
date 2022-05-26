import { LightOrangeBtn, themeColours } from '../../styles/globalTheme';
import React, { useEffect, useRef, useState } from 'react';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';

import Swal from 'sweetalert2';
import firebaseDB from '../../utils/firebaseConfig';
import { getFavPlan } from '../../utils/functionList';
import styled from 'styled-components';

const db = firebaseDB();

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 180px;
  position: absolute;
`;

const FavFolderDropDownOptions = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  position: relative;
  width: 100%;
  top: 60px;
  left: 181px;
  margin-top: 10px;
  border-radius: 10px;
  color: ${themeColours.blue};
  border: 1px solid ${themeColours.blue};
  transition: all 1.3s;

  .folder_option {
    padding: 5px;
    &:hover {
      cursor: pointer;
      background-color: ${themeColours.pale};
      border-radius: 10px;
    }
  }
`;

const FavPlanDropDownOptions = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 5px 15px;
  width: 100%;
  top: calc(120% + 60px);
  left: 181px;
  background-color: white;
  border: 1px solid ${themeColours.blue};
  border-radius: 10px;

  color: ${themeColours.blue};

  .folder_option {
    padding: 5px;
    &:hover {
      cursor: pointer;
      background-color: ${themeColours.pale};
      border-radius: 10px;
    }
  }
`;

const ImportBtnWrapper = styled.div`
  width: 100%;
  position: absolute;
  top: calc(120% + 60px);
  right: -373px;
`;

function FavFolderDropdown({
  importTimeBlock,
  planDocRef,
  setAddedTimeBlock,
  startDateValue,
  currentUserId,
  setShowFavContainer,
}) {
  const [favPlansNameList, setFavPlansNameList] = useState([]);
  const [dropDownFavFolderOption, setDropDownFavFolderOption] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [showSecondLayer, setShowSecondLayer] = useState(false);
  const [showImportBtn, setShowImportBtn] = useState(false);

  useEffect(async () => {
    const favFolderRef = collection(db, 'userId', currentUserId, 'fav_folders');

    try {
      const list = await getDocs(favFolderRef);
      list.docs.map((e) => console.log(e.data()));
      setDropDownFavFolderOption(list.docs.map((e) => e.data().folder_name));
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function importTimeBlock(selectedPlanId) {
    let importEndTime = new Date(startDateValue);
    importEndTime.setHours(importEndTime.getHours() + 2);

    const blocksListRef = collection(
      db,
      'plans',
      selectedPlanId,
      'time_blocks'
    );

    const docSnap = await getDocs(blocksListRef);

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
    return importEvents; //for updating local event
  }

  async function addImportToDataBase(planDocRef, importResult) {
    if (importResult) {
      const batch = writeBatch(db);

      importResult.forEach(async (timeblock) => {
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
        if (setAddedTimeBlock) {
          setAddedTimeBlock(true);
        }
        Swal.fire('Successfully imported!');
        setShowFavContainer(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const dropDownRef = useRef([]);

  return (
    <Wrapper>
      <FavFolderDropDownOptions>
        {dropDownFavFolderOption?.map((folderName, index) => (
          <div
            key={index}
            className="folder_option"
            onClick={(e) => {
              setShowSecondLayer(true);
              getFavPlan(
                e.target.textContent,
                currentUserId,
                setFavPlansNameList
              );
            }}>
            {folderName}
          </div>
        ))}
      </FavFolderDropDownOptions>

      {showSecondLayer && (
        <FavPlanDropDownOptions>
          {favPlansNameList.length <= 0 ? (
            <div className="folder_option">No plans yet!</div>
          ) : (
            favPlansNameList?.map((planName, index) => (
              <div
                ref={(element) => (dropDownRef.current[index] = element)}
                key={index}
                className="folder_option"
                onClick={(e) => {
                  setSelectedPlanId(planName.fav_plan_doc_ref);
                  setShowImportBtn(true);
                  dropDownRef.current.forEach((ref) => {
                    if (dropDownRef.current.indexOf(ref) === index) {
                      ref.style.color = themeColours.light_orange;
                    } else {
                      ref.style.color = 'white';
                    }
                  });
                }}>
                {planName.fav_plan_title}
              </div>
            ))
          )}
        </FavPlanDropDownOptions>
      )}

      <ImportBtnWrapper>
        {showImportBtn && (
          <LightOrangeBtn
            variant="outlined"
            onClick={async () => {
              const importResult = await importTimeBlock(selectedPlanId);
              addImportToDataBase(planDocRef, importResult);
            }}>
            Import
          </LightOrangeBtn>
        )}
      </ImportBtnWrapper>
    </Wrapper>
  );
}

export default FavFolderDropdown;
