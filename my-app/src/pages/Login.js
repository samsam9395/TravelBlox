import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';

const Wrapper = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  min-width: 50%;
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
  padding-top: 30px;
  padding-bottom: 200px;
  height: 1000px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0;
`;

const InputWrapper = styled.div`
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 5px;
  background-color: #f4976c;
  border: none;
  margin-top: 20px;
  border-radius: 5px;
  &:hover {
    background-color: #a65632;
  }
`;

const SignUpSwitcher = styled.div`
  font-size: 14px;
  letter-spacing: 1.5px;
  display: flex;
`;

const ClickTag = styled.div`
  color: #d06224;
  font-weight: 800;
  /* width: 40px; */
  padding: 0 10px;
`;

function signOutFirebase() {
  const auth = getAuth();

  signOut(auth)
    .then(() => {
      if (localStorage.getItem('accessToken')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userEmail');
        alert('You have been signed out!');
      } else {
        alert('You were not signed in!');
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function signUP(email, password, setIsNewUser) {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      setIsNewUser(true);
    })
    .catch((error) => {
      console.log(error.message);
      console.log(error.code);
    });
}

function Login(props) {
  // const [hasSignedIn, setHasSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setIsNewUser = props.setIsNewUser;

  function logOn(email, password) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(auth);
        console.log(user);
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        if (error.message === 'EMAIL_NOT_FOUND') {
          alert('Email not found! Please check again!');
        }
      });
  }

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user.accessToken);
        const uid = user.email;
        console.log(user);
        // localStorage.setItem('accessToken', user.accessToken);
        // localStorage.setItem('userEmail', user.email);
        props.setUserId(uid);
        // alert(`Welcome! ${uid}`);
        props.setHasSignedIn(true);
      } else {
        console.log('not logged in');
      }
    });
    console.log(props.hasSignedIn);
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
                <Button
                  onClick={() =>
                    email && password
                      ? (logOn(email, password), setEmail(''), setPassword(''))
                      : alert('please fill in both !')
                  }>
                  Login
                </Button>
                <SignUpSwitcher>Doesn't have an account yet?</SignUpSwitcher>
                <SignUpSwitcher>
                  Sign up
                  <ClickTag
                    onClick={() => {
                      setShowSignUp(!showSignUp);
                    }}>
                    here!
                  </ClickTag>
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
                <Button
                  onClick={() =>
                    email && password
                      ? (signUP(email, password),
                        setEmail(''),
                        setPassword(''),
                        setIsNewUser)
                      : alert('please fill in both !')
                  }>
                  Sign Up
                </Button>
                <SignUpSwitcher>Already has an account? </SignUpSwitcher>
                <SignUpSwitcher>
                  Sign in
                  <ClickTag
                    onClick={() => {
                      setShowSignUp(!showSignUp);
                    }}>
                    here!
                  </ClickTag>
                </SignUpSwitcher>
                <SignUpSwitcher>
                  Sign out
                  <ClickTag
                    onClick={() => {
                      signOutFirebase();
                    }}>
                    here!
                  </ClickTag>
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
