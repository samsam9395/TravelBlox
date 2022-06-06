import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import firebaseDB from '../../utils/firebaseConfig';
import styled from 'styled-components';

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
  padding: 5px;

  .options {
    padding: 5px;

    &:hover {
      border-radius: 10px;
      background: rgba(85, 207, 214, 0.5);
      cursor: pointer;
    }
  }
`;
EditFavouriteFolderSelector.propTypes = {
  index: PropTypes.number,
  favFolderEditIndex: PropTypes.number,
  favFolderName: PropTypes.string,
  setShowFavFolderEdit: PropTypes.func,
  currentUserId: PropTypes.string,
};

function EditFavouriteFolderSelector({
  index,
  favFolderEditIndex,
  favFolderName,
  setShowFavFolderEdit,
  currentUserId,
}) {
  const renameInputRef = useRef(null);

  useEffect(() => {
    if (renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [renameInputRef.current]);

  async function deleteFavFolder(favFolderName, currentUserId) {
    const batch = writeBatch(db);

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
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    index === favFolderEditIndex && (
      <Wrapper>
        <div
          className="options"
          onClick={() => {
            if (favFolderName === 'default') {
              Swal.fire('You cannot delete default folder!');
            } else {
              Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
              }).then((result) => {
                if (result.isConfirmed) {
                  if (
                    deleteFavFolder(
                      favFolderName,
                      currentUserId,
                      setShowFavFolderEdit
                    )
                  ) {
                    setShowFavFolderEdit(false);
                    Swal.fire(`${favFolderName} is deleted!`);
                  }
                }
              });
            }
          }}>
          Delete
        </div>
      </Wrapper>
    )
  );
}

export default EditFavouriteFolderSelector;
