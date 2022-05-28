import React, { useState } from 'react';

import SignInForm from '../components/login/SignInForm';
import SignUpForm from '../components/login/SignUpForm';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 4;
  margin: 130px 0;
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
  padding-bottom: 50px;
  width: 100%;
  min-height: 300px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  width: 40%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

function Login() {
  const [email, setEmail] = useState('user@user.com');
  const [password, setPassword] = useState('user1234');
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
                toggleShowPassword={() => setShowPassword(!showPassword)}
                toggleShowSignUp={() => setShowSignUp(!showSignUp)}
                email={email}
                password={password}
                showPassword={showPassword}
              />
            ) : (
              <SignUpForm
                setEmail={setEmail}
                setPassword={setPassword}
                setUserName={setUserName}
                toggleShowPassword={() => setShowPassword(!showPassword)}
                toggleShowSignUp={() => setShowSignUp(!showSignUp)}
                email={email}
                showPassword={showPassword}
                password={password}
                username={username}
              />
            )}
          </InputContainer>
        </LoginWrapper>
      </Wrapper>
    </>
  );
}

export default Login;
