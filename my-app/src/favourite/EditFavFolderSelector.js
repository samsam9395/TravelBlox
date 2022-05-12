import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import firebaseDB from '../utils/firebaseConfig';
import {
  doc,
  setDoc,
  collection,
  getDoc,
  deleteDoc,
  writeBatch,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

const db = firebaseDB();

const Wrapper = styled.div`
  width: 100px;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);

  display: flex;
  flex-direction: column;
  position: absolute;
  right: -50px;
  top: 40px;
  padding: 10px;

  .options {
    background: rgba(255, 255, 255, 0.75);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 5px;
    margin-bottom: 3px;

    &:hover {
      background: rgba(85, 207, 214, 0.5);
      cursor: pointer;
    }
  }
`;

// const RenameInput = styled.input`
//   background: rgba(255, 255, 255, 0.75);
//   box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
//   backdrop-filter: blur(2px);
//   -webkit-backdrop-filter: blur(2px);
//   border-radius: 10px;
//   border: 1px solid rgba(255, 255, 255, 0.18);
//   padding: 5px;
//   margin-top: 5px;
//   width: 100%;
//   font-size: inherit;
//   text-align: center;

//   &:hover {
//     background: rgba(85, 207, 214, 0.5);
//     cursor: text;
//   }
// `;

// async function renameFavFolder(
//   favFolderName,
//   showFavFolderEdit,
//   currentUserId
// ) {
//   const folderRef = doc(
//     db,
//     'userId',
//     currentUserId,
//     'fav_folders',
//     favFolderName
//   );

//   if (favFolderName === 'default') {
//     alert('You cannot rename default folder!');
//   } else {
//     try {
//       await setDoc(folderRef, {});
//       showFavFolderEdit(false);
//       alert(`${favFolderName} is renamed!`);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

function EditFavFolderSelector({
  index,
  favFolderEditIndex,
  favFolderName,
  setShowFavFolderEdit,
  currentUserId,
  setShowRenameBox,
  showRenameBox,
}) {
  // const [showRenameBox, setShowRenameBox] = useState(false);
  const [renameInput, setRenameInput] = useState('');

  const renameInputRef = useRef(null);

  useEffect(() => {
    // console.log(renameInputRef);
    if (renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [showRenameBox, renameInputRef.current]);

  // setShowRenameBox(index)
  // console.log('current index', index)

  async function deleteFavFolder(
    favFolderName,
    currentUserId,
    setShowFavFolderEdit
  ) {
    const batch = writeBatch(db);

    if (favFolderName === 'default') {
      alert('You cannot delete default folder!');
    } else {
      const folderRef = doc(
        db,
        'userId',
        currentUserId,
        'fav_folders',
        favFolderName
      );

      const favRef = collection(db, 'userId', currentUserId, 'fav_plans');
      const planQuery = query(favRef, where('infolder', '==', favFolderName));
      const plansList = await getDocs(planQuery);

      batch.delete(folderRef);

      plansList.forEach((doc) => {
        // console.log(doc.ref);
        batch.delete(doc.ref);
      });

      try {
        await batch.commit();
        setShowFavFolderEdit(false);
        alert(`${favFolderName} is deleted!`);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    index === favFolderEditIndex && (
      <Wrapper>
        <div
          className="options"
          onClick={() =>
            deleteFavFolder(favFolderName, currentUserId, setShowFavFolderEdit)
          }>
          Delete
        </div>

        {/* <div className="options" onClick={() => setShowRenameBox(index)}>
          Rename
        </div> */}
      </Wrapper>
    )
  );
}

export default EditFavFolderSelector;
