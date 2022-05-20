import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import { themeColours } from '../../styles/globalTheme';

DateTimeSelector.propTypes = {
  startTimeValue: PropTypes.instanceOf(Date),
  endTimeValue: PropTypes.instanceOf(Date),
  setEndTimeValue: PropTypes.func,
};

export default function DateTimeSelector(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        renderInput={(prop) => (
          <TextField
            required
            {...prop}
            sx={{
              m: 1,
              minWidth: 80,
              svg: { color: themeColours.light_orange },
              label: { color: themeColours.light_orange },
            }}
          />
        )}
        label="Start Time"
        value={props.startTimeValue}
        onChange={(newValue) => {
          props.setStartTimeValue(newValue);
        }}
      />
      <DateTimePicker
        renderInput={(prop) => (
          <TextField
            required
            {...prop}
            sx={{
              m: 1,
              minWidth: 80,
              svg: { color: themeColours.light_orange },
              label: { color: themeColours.light_orange },
            }}
          />
        )}
        label="End Time"
        value={props.endTimeValue}
        onChange={(newValue) => {
          props.setEndTimeValue(newValue);
        }}
      />
    </LocalizationProvider>
  );
}
