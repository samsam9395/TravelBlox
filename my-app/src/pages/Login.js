import React, { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, addDoc, setDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import firebaseDB from '../utils/firebaseConfig';
import { LightOrangeBtn, themeColours } from '../styles/globalTheme';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const db = firebaseDB();

const Wrapper = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
  z-index: 4;
  margin-top: 150px;
  background-color: white;
  border-radius: 20px;
`;

const ImageContainer = styled.div`
  width: 30%;
  margin-right: 10px;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('https://images.unsplash.com/photo-1568179576330-bf2e6e4a30fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80');
`;

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding-top: 30px; */
  padding-bottom: 50px;
  height: 1000px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 15px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  width: 40%;
`;

const InputWrapper = styled.div`
  margin-top: 20px;
`;

const SignUpSwitcher = styled.div`
  font-size: 14px;
  letter-spacing: 1.5px;
  display: flex;
  flex-direction: column;

  .signSection {
    display: flex;
    margin-top: 5px;
  }

  .click_here {
    color: #d06224;
    font-weight: 800;
    /* width: 40px; */
    padding: 0 10px;
  }
`;

async function signUP(email, password, username) {
  const docRef = doc(db, 'userId', email);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    Swal.fire('You are a member already!');
  } else {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        return user.email;
      })
      .then((emailId) => {
        setDoc(doc(db, 'userId', emailId), {
          id: emailId,
          username: username,
          userImage:
            'https://is4-ssl.mzstatic.com/image/thumb/Purple125/v4/79/77/67/7977678c-89be-76ff-b9f3-cdc560170cb6/source/256x256bb.jpg',
        });
        return emailId;
      })
      .then((emailId) => {
        setDoc(doc(db, 'userId', emailId, 'fav_folders', 'default'), {
          folder_name: 'default',
        });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          Swal.fire('Email already in use, please pick another one!');
        }
        console.log(error.message);
        console.log(error.code);
      });
  }
}

function Login(props) {
  // const [hasSignedIn, setHasSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setIsNewUser = props.setIsNewUser;
  const navigate = useNavigate();

  function logOn(email, password) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        if (error.message === 'EMAIL_NOT_FOUND') {
          Swal.fire('Email not found! Please check again!');
        }
      });
  }

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        // console.log(user.accessToken);
        console.log(user);
        console.log('run this page once');
        // alert(`Welcome! ${user.email}`);
        localStorage.setItem('accessToken', user.accessToken);
        localStorage.setItem('userEmail', user.email);
        navigate('/discover');
      } else {
        console.log('not logged in');
      }
    });
  }, []);

  return (
    <>
      <Wrapper>
        <LoginWrapper>
          <ImageContainer></ImageContainer>
          <InputContainer>
            {!showSignUp ? (
              <>
                <Title>Welcome Back!</Title>
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
                    fullWidth
                    required
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
                            //   onMouseDown={handleMouseDownPassword}
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
                    email && password
                      ? (logOn(email, password), setEmail(''), setPassword(''))
                      : Swal.fire('please fill in both !')
                  }>
                  Login
                </LightOrangeBtn>
                <SignUpSwitcher>
                  Doesn't have an account yet?
                  <div className="signSection">
                    Sign up
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
            ) : (
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
                            //   onMouseDown={handleMouseDownPassword}
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
                      ? (signUP(email, password, username),
                        setEmail(''),
                        setPassword(''),
                        setUserName(''),
                        setIsNewUser)
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
            )}
          </InputContainer>
        </LoginWrapper>
      </Wrapper>
    </>
  );
}

export default Login;
