import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './GenerateAvatar';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import CheckIcon from '@mui/icons-material/Check';
import { doc, getDoc, addDoc, setDoc, collection } from 'firebase/firestore';
import firebaseDB from '../../utils/firebaseConfig';

const db = firebaseDB();

const Wrapper = styled.div`
  width: 120px;
  height: 120px;
  position: relative;
`;

const AvatarImage = styled.div`
  width: 100px;
  height: 100px;
  /* border-radius: 50%; */
  position: relative;
`;

const EditIconWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: -40px;
`;

const RandomIconWrapper = styled.div`
  position: absolute;
  top: 60px;
  right: -40px;
`;

const OkayIconWrapper = styled.div`
  position: absolute;
  top: 90px;
  right: -40px;
`;

function UserAvatar({ currentUserId, fromLocate }) {
  const [userImage, setUserImage] = useState(null);
  const [avatarConfig, setAvatarConfig] = useState(null);
  const [showChangeAvatar, setShowChangeAvatar] = useState(false);

  useEffect(async () => {
    if (currentUserId) {
      const userDoc = await getDoc(doc(db, 'userId', currentUserId));
      if (userDoc.data().avatarConfig) {
        setAvatarConfig(userDoc.data().avatarConfig);
      }
    }
    // console.log(111, userDoc.data());
  }, [currentUserId]);

  function randomAvatar() {
    const config = { ...generateRandomAvatarOptions() };

    setAvatarConfig(config);
  }

  function SaveConfigToDataBase(currentUserId) {
    try {
      setDoc(
        doc(db, 'userId', currentUserId),
        {
          avatarConfig: avatarConfig,
        },
        { merge: true }
      );
      alert('Saved your avatar!');
      setShowChangeAvatar(false);
    } catch (error) {
      console.log(error);
    }
  }

  // console.log(avatarConfig);

  return (
    <Wrapper>
      <AvatarImage>
        <Avatar
          avatarStyle="Circle"
          style={{ width: '120px', height: '120px' }}
          {...(avatarConfig ? { ...avatarConfig } : null)}
        />

        {fromLocate === 'dashboard' && (
          <EditIconWrapper className="hoverCursor">
            <EditIcon
              onClick={() => setShowChangeAvatar(!showChangeAvatar)}></EditIcon>
          </EditIconWrapper>
        )}
        {showChangeAvatar && (
          <>
            <RandomIconWrapper className="hoverCursor">
              <ShuffleIcon onClick={() => randomAvatar()}></ShuffleIcon>
            </RandomIconWrapper>
            <OkayIconWrapper
              className="hoverCursor"
              onClick={() => SaveConfigToDataBase(currentUserId)}>
              <CheckIcon></CheckIcon>
            </OkayIconWrapper>
          </>
        )}
      </AvatarImage>
    </Wrapper>
  );
}

export default UserAvatar;
