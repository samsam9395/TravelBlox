import { InputWrapper, SignUpSwitcher, Title } from './loginUIStyles';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import IconButton from '@mui/material/IconButton';
import { InputAdornment } from '@mui/material';
import { LightOrangeBtn } from '../../styles/globalTheme';
import PropTypes from 'prop-types';
import React from 'react';
import Swal from 'sweetalert2';
import TextField from '@material-ui/core/TextField';
import firebaseService from '../../utils/fireabaseService';

SignUpForm.propTypes = {
  setEmail: PropTypes.func,
  setPassword: PropTypes.func,
  setUserName: PropTypes.func,
  toggleShowPassword: PropTypes.func,
  toggleShowSignUp: PropTypes.func,
  email: PropTypes.string,
  password: PropTypes.string,
  username: PropTypes.string,
  showPassword: PropTypes.func,
};

function SignUpForm({
  setEmail,
  setPassword,
  setUserName,
  toggleShowPassword,
  toggleShowSignUp,
  email,
  password,
  username,
  showPassword,
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
                <IconButton onClick={() => toggleShowPassword()} edge="end">
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
            ? (firebaseService.signUp(email, password, username),
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
            onClick={() => toggleShowSignUp()}>
            here!
          </div>
        </div>
      </SignUpSwitcher>
    </>
  );
}

export default SignUpForm;
