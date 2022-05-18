import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import firebaseDB from '../utils/firebaseConfig';
import {
  doc,
  collection,
  writeBatch,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import Swal from 'sweetalert2';

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
function EditFavFolderSelector({
  index,
  favFolderEditIndex,
  favFolderName,
  setShowFavFolderEdit,
  currentUserId,
  setShowRenameBox,
  showRenameBox,
}) {
  const renameInputRef = useRef(null);

  useEffect(() => {
    if (renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [showRenameBox, renameInputRef.current]);

  async function deleteFavFolder(
    favFolderName,
    currentUserId,
    setShowFavFolderEdit
  ) {
    const batch = writeBatch(db);

    if (favFolderName === 'default') {
      Swal.fire('You cannot delete default folder!');
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
        batch.delete(doc.ref);
      });

      try {
        await batch.commit();
        setShowFavFolderEdit(false);
        Swal.fire(`${favFolderName} is deleted!`);
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
      </Wrapper>
    )
  );
}

export default EditFavFolderSelector;
