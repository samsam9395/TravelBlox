import { InputWrapper, SignUpSwitcher, Title } from './loginUIStyles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import IconButton from '@mui/material/IconButton';
import { InputAdornment } from '@mui/material';
import { LightOrangeBtn } from '../../styles/globalTheme';
import React from 'react';
import Swal from 'sweetalert2';
import TextField from '@material-ui/core/TextField';
import firebaseDB from '../../utils/firebaseConfig';

async function signUp(email, password, username) {
  const docRef = doc(db, 'userId', email);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    Swal.fire('You are a member already!');
  } else {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(222, user);
        return user;
      })
      .then((user) => {
        setDoc(doc(db, 'userId', user.email), {
          id: user.email,
          username: username,
          userImage:
            'https://is4-ssl.mzstatic.com/image/thumb/Purple125/v4/79/77/67/7977678c-89be-76ff-b9f3-cdc560170cb6/source/256x256bb.jpg',
          uid: user.uid,
        });
        return user.email;
      })
      .then((emailId) => {
        setDoc(doc(db, 'userId', emailId, 'fav_folders', 'default'), {
          folder_name: 'default',
        });
      })
      .then(() =>
        Swal.fire({
          timer: 1500,
          showConfirmButton: false,
          icon: 'success',
          title: 'You are now ready to start planning!',
        })
      )
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          Swal.fire('Email already in use, please pick another one!');
        }
      });
  }
}

const db = firebaseDB();
function SignUpForm({
  setEmail,
  setPassword,
  setUserName,
  setShowPassword,
  setShowSignUp,
  email,
  password,
  username,
  showPassword,
  showSignUp,
}) {
  return (
    <>
      <Title>Start your journey!</Title>
      <InputWrapper>
        <TextField
          required
          fullWidth
          value={email}
          label="email"
          size="small"
          variant="outlined"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </InputWrapper>
      <InputWrapper>
        <TextField
          required
          fullWidth
          value={username}
          label="username"
          size="small"
          variant="outlined"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
      </InputWrapper>
      <InputWrapper>
        <TextField
          required
          fullWidth
          type={showPassword ? 'text' : 'password'}
          value={password}
          label="password"
          variant="outlined"
          size="small"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </InputWrapper>
      <LightOrangeBtn
        marginBottom="20px"
        marginTop="20px"
        onClick={() =>
          email && password && username
            ? (signUp(email, password, username),
              setEmail(''),
              setPassword(''),
              setUserName(''))
            : Swal.fire('please fill in both !')
        }>
        Sign Up
      </LightOrangeBtn>

      <SignUpSwitcher>
        Already has an account?
        <div className="signSection">
          Sign in
          <div
            className="click_here hoverCursor"
            onClick={() => {
              setShowSignUp(!showSignUp);
            }}>
            here!
          </div>
        </div>
      </SignUpSwitcher>
    </>
  );
}

export default SignUpForm;
