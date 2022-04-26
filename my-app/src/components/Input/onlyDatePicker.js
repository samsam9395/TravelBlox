import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function OnlyDatePicker(props) {
  //   setStartDateValue={setStartDateValue}
  //   startDateValue={startDateValue}
  //   setEndDateValue={setEndDateValue}
  //   endDateValue={endDateValue}

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        sx={{ m: 1, width: 80 }}
        label="start date"
        value={props.startDateValue}
        onChange={(e) => {
          props.setStartDateValue(e);
          console.log(e);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
      <DatePicker
        sx={{ m: 1, minWidth: 80 }}
        label="end date"
        value={props.endDateValue}
        onChange={(e) => {
          props.setEndDateValue(e);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
