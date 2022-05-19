import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { themeColours } from '../../styles/globalTheme';
import PropTypes from 'prop-types';

DateTimeSelector.propTypes = {
  startTimeValue: PropTypes.string,
  endTimeValue: PropTypes.string,
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
