import React, { useState } from 'react';

import SignInForm from '../components/login/SignInForm';
import SignUpForm from '../components/login/SignUpForm';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
  z-index: 4;
  margin-top: 150px;
  background-color: white;
  border-radius: 20px;
  max-width: 100%;
`;

const ImageContainer = styled.div`
  width: 300px;
  margin-right: 10px;
  height: 380px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('https://images.unsplash.com/photo-1568179576330-bf2e6e4a30fe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80');
`;

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 50px;
  width: 100%;
  height: 420px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  width: 40%;
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Wrapper>
        <LoginWrapper>
          <ImageContainer></ImageContainer>
          <InputContainer>
            {!showSignUp ? (
              <SignInForm
                setEmail={setEmail}
                setPassword={setPassword}
                setShowPassword={setShowPassword}
                setShowSignUp={setShowSignUp}
                email={email}
                password={password}
                showPassword={showPassword}
                showSignUp={showSignUp}
              />
            ) : (
              <SignUpForm
                setEmail={setEmail}
                setPassword={setPassword}
                setUserName={setUserName}
                setShowPassword={setShowPassword}
                setShowSignUp={setShowSignUp}
                email={email}
                password={password}
                username={username}
                showPassword={showPassword}
                showSignUp={showSignUp}
              />
            )}
          </InputContainer>
        </LoginWrapper>
      </Wrapper>
    </>
  );
}

export default Login;
