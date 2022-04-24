import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function DateTimeSelector(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        renderInput={(prop) => (
          <TextField required {...prop} sx={{ m: 1, minWidth: 80 }} />
        )}
        label="Start Time"
        value={props.startTimeValue}
        onChange={(newValue) => {
          console.log(newValue);
          props.setStartTimeValue(newValue);
        }}
      />
      <DateTimePicker
        renderInput={(prop) => (
          <TextField required {...prop} sx={{ m: 1, minWidth: 80 }} />
        )}
        label="End Time"
        value={props.endTimeValue}
        onChange={(newValue) => {
          console.log(newValue);
          props.setEndTimeValue(newValue);
        }}
      />
    </LocalizationProvider>
  );
}